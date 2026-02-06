"use client";
import "../CalculatePayroll/PayrollCalculation.scss";
import "@/app/Componentes/ValuesConfiguration/ValuesConfiguration.scss";
import { useEffect, useState } from "react";
import NavDesktop from "../../NavDesktop/NavDesktop";
import axios from "axios";
import ConceptsByEmployee from "./ConceptsByEmployee/ConceptsByEmployee";

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
} from "@mui/material";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const ViewPayrollCalculations = () => {
  const [employeesRecordsPayroll, setEmployeesRecordsPayroll] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Id_Employee");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const { payFrequencyDetails } = useUsersDetails();

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
    const employeeId = record.Id_Employee.toString().toLowerCase();
    const period = record.Id_Period.toString().toLowerCase();
    const payFreq =
      payFrequencyDetails
        .find((pf) => pf.Id_PayFrequency === record.Id_PayFrequency)
        ?.Description.toLowerCase() || "";

    return (
      employeeId.includes(searchLower) ||
      period.includes(searchLower) ||
      payFreq.includes(searchLower)
    );
  });

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleRowClick = (record: any) => {
    setSelectedEmployee(record);
    setShowModal(true);
  };
  return (
    <div>
      <NavDesktop />
      <div className="payroll-Calculation-container">
        <h2 style={{ marginTop: "2rem" }}>View Payroll Calculations</h2>
        <label htmlFor="">You can view all payroll calculations here.</label>
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
              placeholder="Filter by employee ID, pay frequency or period"
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
                      style={{ color: "white" }}
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
                      style={{ color: "white" }}
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
                      style={{ color: "white" }}
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
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "GorssSalary"}
                        direction={orderBy === "GorssSalary" ? order : "asc"}
                        onClick={() => handleRequestSort("GorssSalary")}
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
                        Gross Salary
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "Incomes_Sumatory"}
                        direction={
                          orderBy === "Incomes_Sumatory" ? order : "asc"
                        }
                        onClick={() => handleRequestSort("Incomes_Sumatory")}
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
                        Incomes
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
                      <TableSortLabel
                        active={orderBy === "Deductions_Sumatory"}
                        direction={
                          orderBy === "Deductions_Sumatory" ? order : "asc"
                        }
                        onClick={() => handleRequestSort("Deductions_Sumatory")}
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
                        Deductions
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
                          {payFrequencyDetails.find(
                            (pf) =>
                              pf.Id_PayFrequency === record.Id_PayFrequency,
                          )?.Description || record.Id_PayFrequency}
                        </TableCell>
                        <TableCell align="center">{record.Id_Period}</TableCell>
                        <TableCell align="center">
                          ${record.GrossSalary?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="center">
                          ${record.Incomes_Sumatory?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="center">
                          ${record.Deductions_Sumatory?.toFixed(2) || "0.00"}
                        </TableCell>
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
      </div>

      {showModal && selectedEmployee && (
        <ConceptsByEmployee
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          employeeData={selectedEmployee}
        />
      )}
    </div>
  );
};

export default ViewPayrollCalculations;
