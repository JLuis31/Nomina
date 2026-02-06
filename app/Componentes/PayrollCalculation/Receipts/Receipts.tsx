"use client";

import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

import { useEffect, useState } from "react";
import NavDesktop from "../../NavDesktop/NavDesktop";
import "./Receipts.scss";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  FormControlLabel,
  Switch,
  TableSortLabel,
  Modal,
  Button,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Receipts = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Id_Employee");
  const [employeesRecordsPayroll, setEmployeesRecordsPayroll] = useState<any[]>(
    [],
  );
  const [openModal, setOpenModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const { payFrequencyDetails, empleadosDetails, departmentDetails } =
    useUsersDetails();

  useEffect(() => {
    const fetchEmployeesWithRecordsPayroll = async () => {
      try {
        const response = await axios.get(
          "/api/PayrollCalculation/EmployeesWithRecords",
        );

        setEmployeesRecordsPayroll(response.data);
      } catch (error) {
        toast.error("Error fetching employees with payroll records.");
      }
    };
    fetchEmployeesWithRecordsPayroll();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data: any[]) => {
    return data.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedRecords = sortData([...employeesRecordsPayroll]);

  const filteredRecords = sortedRecords.filter((record: any) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    const emp = empleadosDetails.find(
      (e) => e.Id_Employee === record.Id_Employee,
    );
    const fullName = emp
      ? `${emp.Name} ${emp.First_SurName} ${emp.Second_Surname}`.toLowerCase()
      : "";
    const employeeId = record.Id_Employee.toString().toLowerCase();
    const period = record.Id_Period.toString().toLowerCase();
    const dept = departmentDetails.find(
      (dep) => dep.id_Department === emp?.id_Department,
    );
    const department = dept?.Description.toLowerCase() || "";

    return (
      employeeId.includes(searchLower) ||
      fullName.includes(searchLower) ||
      period.includes(searchLower) ||
      department.includes(searchLower)
    );
  });

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleRowClick = async (record: any) => {
    try {
      const response = await axios.get(
        `/api/PayrollCalculation/ReceiptsByEmployee?Id_Employee=${record.Id_Employee}&Id_PayFrequency=${record.Id_PayFrequency}`,
      );
      if (response.status === 200) {
        setReceiptData({ record, details: response.data });
        setOpenModal(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error fetching receipt for the selected record.",
        );
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReceiptData(null);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptData) return;

    const loadingToast = toast.loading("Generando PDF...");
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Recibo de Nómina", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Empleado: ${receiptData.details[0]?.FullName || "N/A"}`,
        14,
        30,
      );
      doc.text(`ID: ${receiptData.record.Id_Employee}`, 14, 36);
      doc.text(`Periodo: ${receiptData.record.Id_Period}`, 14, 42);
      doc.text(
        `Frecuencia: ${payFrequencyDetails.find((pf) => pf.Id_PayFrequency === receiptData.record.Id_PayFrequency)?.Description || receiptData.record.Id_PayFrequency}`,
        14,
        48,
      );
      doc.text(
        `Salario por Hora: $${Number(receiptData.details[0]?.SalaryPerHour || 0).toFixed(2)}`,
        14,
        54,
      );

      const conceptsData = receiptData.details
        .filter(
          (item: any, index: number, self: any[]) =>
            self.findIndex(
              (i: any) => i.Id_Concept_Detail === item.Id_Concept_Detail,
            ) === index,
        )
        .map((item: any) => [
          item.Id_Concept_Detail || "N/A",
          item.Id_Concept_Type_Detail || "N/A",
          `$${Number(item.Amount_Detail || 0).toFixed(2)}`,
        ]);

      if (conceptsData.length > 0) {
        autoTable(doc, {
          head: [["Concepto", "Tipo", "Monto"]],
          body: conceptsData,
          startY: 62,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [52, 93, 138] },
        });
      }

      const exceptionsData = receiptData.details
        .filter(
          (item: any, index: number, self: any[]) =>
            item.Id_Concept_Exception &&
            self.findIndex(
              (i: any) => i.Id_Concept_Exception === item.Id_Concept_Exception,
            ) === index,
        )
        .map((item: any) => [
          item.Id_Concept_Exception || "N/A",
          item.Id_Concept_Type_Exception || "N/A",
          `$${Number(item.Amount_Exception || 0).toFixed(2)}`,
        ]);

      if (exceptionsData.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY || 62;
        autoTable(doc, {
          head: [["Excepción", "Tipo", "Monto"]],
          body: exceptionsData,
          startY: finalY + 10,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [52, 93, 138] },
        });
      }

      const summaryY = (doc as any).lastAutoTable?.finalY || 62;
      doc.setFontSize(12);
      doc.text("Resumen", 14, summaryY + 15);
      doc.setFontSize(10);
      doc.text(
        `Ingresos Totales: $${Number(receiptData.details[0]?.Incomes_Sumatory || 0).toFixed(2)}`,
        14,
        summaryY + 22,
      );
      doc.text(
        `Deducciones Totales: $${Number(receiptData.details[0]?.Deductions_Sumatory || 0).toFixed(2)}`,
        14,
        summaryY + 28,
      );
      doc.text(
        `Impuestos Totales: $${Number(receiptData.details[0]?.Total_Tax_Deductions || 0).toFixed(2)}`,
        14,
        summaryY + 34,
      );
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(
        `Pago Neto: $${Number(receiptData.details[0]?.Net_Pay || 0).toFixed(2)}`,
        14,
        summaryY + 42,
      );

      doc.save(
        `Recibo_${receiptData.record.Id_Employee}_Periodo_${receiptData.record.Id_Period}.pdf`,
      );

      toast.dismiss(loadingToast);
      toast.success("Recibo descargado exitosamente");
      handleCloseModal();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div>
      <NavDesktop />
      <div className="receipts-main-container">
        <h2 style={{ marginTop: "2rem" }}>Download Receipts</h2>
        <label htmlFor="">You can download receipts here.</label>
        <hr />

        <div
          className="buscador"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <div className="filtro">
            <label className="labelfiltrarpor" htmlFor="">
              Search
            </label>
            <input
              type="text"
              placeholder="Filter by employee ID, name, department or period"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(0);
              }}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        <Box sx={{ width: "100%", mt: 3 }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
              Payroll Records
            </Typography>
            <TableContainer>
              <Table className="table" size={dense ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#345d8a" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "Id_Employee"}
                        direction={orderBy === "Id_Employee" ? order : "asc"}
                        onClick={() => handleRequestSort("Id_Employee")}
                        sx={{
                          "&.MuiTableSortLabel-root": {
                            color: "white",
                          },
                          "&.MuiTableSortLabel-root:hover": {
                            color: "white",
                          },
                          "&.Mui-active": {
                            color: "white",
                          },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Employee Id
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#345d8a", color: "white" }}
                      className="header"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#345d8a", color: "white" }}
                      className="header"
                    >
                      Department
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#345d8a", color: "white" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "Id_PayFrequency"}
                        direction={
                          orderBy === "Id_PayFrequency" ? order : "asc"
                        }
                        onClick={() => handleRequestSort("Id_PayFrequency")}
                        sx={{
                          "&.MuiTableSortLabel-root": {
                            color: "white",
                          },
                          "&.MuiTableSortLabel-root:hover": {
                            color: "white",
                          },
                          "&.Mui-active": {
                            color: "white",
                          },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Pay Frequency
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "#345d8a", color: "white" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "Id_Period"}
                        direction={orderBy === "Id_Period" ? order : "asc"}
                        onClick={() => handleRequestSort("Id_Period")}
                        sx={{
                          "&.MuiTableSortLabel-root": {
                            color: "white",
                          },
                          "&.MuiTableSortLabel-root:hover": {
                            color: "white",
                          },
                          "&.Mui-active": {
                            color: "white",
                          },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Period
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeesRecordsPayroll.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecords.map((record: any) => (
                      <TableRow
                        hover
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(record)}
                        key={record.Id_Employee}
                      >
                        <TableCell align="center">
                          {record.Id_Employee}
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            const emp = empleadosDetails.find(
                              (e) => e.Id_Employee === record.Id_Employee,
                            );
                            return emp
                              ? `${emp.Name} ${emp.First_SurName} ${emp.Second_Surname}`
                              : record.Id_Employee;
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            const emp = empleadosDetails.find(
                              (e) => e.Id_Employee === record.Id_Employee,
                            );
                            const dept = departmentDetails.find(
                              (dep) => dep.id_Department === emp?.id_Department,
                            );
                            return dept?.Description || record.Id_Department;
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          {payFrequencyDetails.find(
                            (pf) =>
                              pf.Id_PayFrequency === record.Id_PayFrequency,
                          )?.Description || record.Id_PayFrequency}
                        </TableCell>
                        <TableCell align="center">{record.Id_Period}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {employeesRecordsPayroll.length > 0 && (
              <TablePagination
                id="payroll-table-pagination"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRecords.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>

          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
              />
            }
            label="Compact view"
          />
        </Box>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="receipt-modal-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 700, md: 900 },
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {receiptData && (
              <>
                <Typography
                  id="receipt-modal-title"
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "#345d8a" }}
                >
                  Resumen del Recibo de Nómina
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Información del Empleado
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Typography>
                      <strong>ID:</strong> {receiptData.record.Id_Employee}
                    </Typography>
                    <Typography>
                      <strong>Nombre:</strong>{" "}
                      {receiptData.details[0]?.FullName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Salario por Hora:</strong> $
                      {Number(
                        receiptData.details[0]?.SalaryPerHour || 0,
                      ).toFixed(2)}
                    </Typography>
                    <Typography>
                      <strong>Frecuencia de Pago:</strong>{" "}
                      {payFrequencyDetails.find(
                        (pf) =>
                          pf.Id_PayFrequency ===
                          receiptData.record.Id_PayFrequency,
                      )?.Description || receiptData.record.Id_PayFrequency}
                    </Typography>
                    <Typography>
                      <strong>Periodo:</strong> {receiptData.record.Id_Period}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Detalle de Conceptos
                  </Typography>
                  <TableContainer component={Paper} elevation={2}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#345d8a" }}>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Concepto
                          </TableCell>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                            align="center"
                          >
                            Tipo
                          </TableCell>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                            align="right"
                          >
                            Monto
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {receiptData.details
                          .filter(
                            (item: any, index: number, self: any[]) =>
                              self.findIndex(
                                (i: any) =>
                                  i.Id_Concept_Detail ===
                                  item.Id_Concept_Detail,
                              ) === index,
                          )
                          .map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.Id_Concept_Detail || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {item.Id_Concept_Type_Detail || "N/A"}
                              </TableCell>
                              <TableCell align="right">
                                ${Number(item.Amount_Detail || 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Excepciones
                  </Typography>
                  <TableContainer component={Paper} elevation={2}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#345d8a" }}>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Concepto
                          </TableCell>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                            align="center"
                          >
                            Tipo
                          </TableCell>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                            align="right"
                          >
                            Monto
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {receiptData.details
                          .filter(
                            (item: any, index: number, self: any[]) =>
                              item.Id_Concept_Exception &&
                              self.findIndex(
                                (i: any) =>
                                  i.Id_Concept_Exception ===
                                  item.Id_Concept_Exception,
                              ) === index,
                          )
                          .map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.Id_Concept_Exception || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {item.Id_Concept_Type_Exception || "N/A"}
                              </TableCell>
                              <TableCell align="right">
                                ${Number(item.Amount_Exception || 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Resumen
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                      bgcolor: "#f5f5f5",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      <strong>Ingresos Totales:</strong> $
                      {Number(
                        receiptData.details[0]?.Incomes_Sumatory || 0,
                      ).toFixed(2)}
                    </Typography>
                    <Typography>
                      <strong>Deducciones Totales:</strong> $
                      {Number(
                        receiptData.details[0]?.Deductions_Sumatory || 0,
                      ).toFixed(2)}
                    </Typography>
                    <Typography>
                      <strong>Impuestos Totales:</strong> $
                      {Number(
                        receiptData.details[0]?.Total_Tax_Deductions || 0,
                      ).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#345d8a",
                      }}
                    >
                      <strong>Pago Neto:</strong> $
                      {Number(receiptData.details[0]?.Net_Pay || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{ color: "#345d8a", borderColor: "#345d8a" }}
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDownloadReceipt}
                    sx={{
                      bgcolor: "#345d8a",
                      "&:hover": { bgcolor: "#2a4a6f" },
                    }}
                  >
                    Descargar PDF
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Receipts;
