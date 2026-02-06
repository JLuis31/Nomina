"use client";

import "../CalculatePayroll/PayrollCalculation.scss";
import NavDesktop from "../../NavDesktop/NavDesktop";
import Exceptions from "./AddExceptions/AddExceptions";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";

const PayrollCalculation = () => {
  const { defaultConceptsDetails, payFrequencyDetails } = useUsersDetails();

  const [data, setData] = useState({
    payFrequency: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [showExceptionsModal, setShowExceptionsModal] = useState(false);
  const [actualPeriod, setActualPeriod] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Id_Concept");

  useEffect(() => {
    if (data.payFrequency === "") return;
    const fetchActualPeriod = async () => {
      try {
        const response = await axios.get(
          `/api/PayrollCalculation/ActualPeriod?IdPaymentFrequency=${data.payFrequency}`,
        );
        if (response.status === 200) {
          const dateFormatter = new Intl.DateTimeFormat("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const startDate = dateFormatter.format(
            new Date(response.data.Period_Start),
          );
          const endDate = dateFormatter.format(
            new Date(response.data.Period_End),
          );
          setActualPeriod(
            `${startDate} - ${endDate} - (${response.data.Id_Period})`,
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error, { duration: 1000 });
          setActualPeriod("");
        }
      }
    };
    fetchActualPeriod();
  }, [data.payFrequency]);

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

  const filteredConcepts = defaultConceptsDetails.filter(
    (concept: any) => concept.Id_PayFrequency === Number(data.payFrequency),
  );

  const sortedConcepts = sortData([...filteredConcepts]);

  const paginatedConcepts = sortedConcepts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const CalculatePayroll = () => {
    if (data.payFrequency === "") {
      toast.error("Please select a payment frequency");
      return;
    }
    try {
      const response = axios.get(
        `/api/PayrollCalculation?payFrequency=${data.payFrequency}`,
      );
      localStorage.setItem("payFrequency", data.payFrequency);
      localStorage.setItem("actualPeriod", actualPeriod);

      toast.promise(response, {
        loading: "Calculating payroll...",
        success: "Payroll calculated successfully!",
        error: "Error calculating payroll",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Error calculating payroll");
      }
    }
  };

  return (
    <div>
      <NavDesktop />
      <div className="payroll-Calculation-container">
        <h2 style={{ marginTop: "2rem" }}>Payroll Calculation</h2>
        <label htmlFor="">Calculations for Payroll</label>
        <hr />
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Payment Frequency</InputLabel>
              <Select
                value={data.payFrequency}
                onChange={(e) =>
                  setData({ ...data, payFrequency: e.target.value })
                }
                label="Payment Frequency"
              >
                <MenuItem value="">Select a Payment Frequency period</MenuItem>
                {payFrequencyDetails.map((frequency: any) => (
                  <MenuItem
                    key={frequency.Id_PayFrequency}
                    value={String(frequency.Id_PayFrequency)}
                  >
                    {frequency.Description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Actual Period"
                value={actualPeriod || "No period available"}
                disabled
                variant="outlined"
                sx={{ minWidth: 200 }}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <button
              onClick={CalculatePayroll}
              className="addPayrollPeriods"
              style={{
                backgroundColor: "#345d8a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: actualPeriod === "" ? "none" : "block",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2a4a6e";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#345d8a";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {" "}
              Calculate Payroll
            </button>
            <button
              className="addPayrollPeriods"
              style={{
                display: data.payFrequency === "" ? "none" : "block",
                backgroundColor: "#345d8a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                pointerEvents: data.payFrequency === "" ? "none" : "auto",
              }}
              onClick={() => setShowExceptionsModal(true)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2a4a6e";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#345d8a";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {" "}
              Exceptions
            </button>
          </Box>
        </Box>

        {data.payFrequency && (
          <Box sx={{ width: "100%", mt: 3 }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
                Default Concepts for Selected Frequency
              </Typography>
              <TableContainer>
                <Table className="table" size={dense ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{ color: "white", backgroundColor: "#345d8a" }}
                        className="header"
                      >
                        <TableSortLabel
                          active={orderBy === "Id_Concept"}
                          direction={orderBy === "Id_Concept" ? order : "asc"}
                          onClick={() => handleRequestSort("Id_Concept")}
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
                          Id Concept
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: "white", backgroundColor: "#345d8a" }}
                        className="header"
                      >
                        <TableSortLabel
                          active={orderBy === "Description"}
                          direction={orderBy === "Description" ? order : "asc"}
                          onClick={() => handleRequestSort("Description")}
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
                          Description
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: "white", backgroundColor: "#345d8a" }}
                        className="header"
                      >
                        <TableSortLabel
                          active={orderBy === "Id_Concept_Type"}
                          direction={
                            orderBy === "Id_Concept_Type" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("Id_Concept_Type")}
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
                          Concept Type
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: "white", backgroundColor: "#345d8a" }}
                        className="header"
                      >
                        <TableSortLabel
                          active={orderBy === "Per_Hour"}
                          direction={orderBy === "Per_Hour" ? order : "asc"}
                          onClick={() => handleRequestSort("Per_Hour")}
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
                          Per Hour
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: "white", backgroundColor: "#345d8a" }}
                        className="header"
                      >
                        <TableSortLabel
                          active={orderBy === "Per_Amount"}
                          direction={orderBy === "Per_Amount" ? order : "asc"}
                          onClick={() => handleRequestSort("Per_Amount")}
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
                          Per Amount
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredConcepts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="center"
                          style={{ backgroundColor: "#345d8a", color: "white" }}
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedConcepts.map((concept: any) => (
                        <TableRow key={concept.Id_Default_Concept}>
                          <TableCell align="center">
                            {concept.Id_Concept}
                          </TableCell>
                          <TableCell align="center">
                            {concept.Description}
                          </TableCell>
                          <TableCell align="center">
                            <span
                              style={{
                                backgroundColor:
                                  concept.Id_Concept_Type === "I"
                                    ? "#e8f5e9"
                                    : "#ffebee",
                                color:
                                  concept.Id_Concept_Type === "I"
                                    ? "#2e7d32"
                                    : "#c62828",
                                padding: ".5rem",
                                borderRadius: ".5rem",
                                fontWeight: "550",
                              }}
                            >
                              {concept.Id_Concept_Type === "I"
                                ? "Income"
                                : "Deduction"}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            {concept.Per_Hour}
                          </TableCell>
                          <TableCell align="center">
                            {concept.Per_Amount}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredConcepts.length > 0 && (
                <TablePagination
                  id="deductions-table-pagination"
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredConcepts.length}
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
        )}
      </div>
      {showExceptionsModal && (
        <Exceptions
          isOpen={showExceptionsModal}
          onClose={() => setShowExceptionsModal(false)}
          payFrequencyId={data.payFrequency}
        />
      )}{" "}
    </div>
  );
};

export default PayrollCalculation;
