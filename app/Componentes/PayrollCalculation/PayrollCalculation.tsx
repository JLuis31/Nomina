"use client";

import "@/app/Componentes/PayrollCalculation/PayrollCalculation.scss";
import "@/app/Componentes/ValuesConfiguration/ValuesConfiguration.scss";
import NavDesktop from "../NavDesktop/NavDesktop";
import Exceptions from "./AddExceptions/AddExceptions";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useState } from "react";
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
  Button,
} from "@mui/material";

const PayrollCalculation = () => {
  const { defaultConceptsDetails, payFrequencyDetails } = useUsersDetails();

  const [data, setData] = useState({
    payFrequency: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [showExceptionsModal, setShowExceptionsModal] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredConcepts = defaultConceptsDetails.filter(
    (concept: any) => concept.Id_PayFrequency === Number(data.payFrequency)
  );

  const paginatedConcepts = filteredConcepts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <NavDesktop />
      <div className="payroll-Calculation-container">
        <h2 style={{ marginTop: "2rem" }}>Payroll Calculation</h2>
        <label htmlFor="">Calculations for Payroll</label>
        <hr />
        <Box
          sx={{ mt: 3, mb: 4, display: "flex", gap: 2, alignItems: "center" }}
        >
          <FormControl sx={{ minWidth: 300 }}>
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
          <button
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
              opacity: data.payFrequency === "" ? "0" : "1",
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
            Add Exceptions
          </button>
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
                      <TableCell style={{ color: "white" }} className="header">
                        Id Concept
                      </TableCell>
                      <TableCell style={{ color: "white" }} className="header">
                        Description
                      </TableCell>
                      <TableCell style={{ color: "white" }} className="header">
                        Concept Type
                      </TableCell>
                      <TableCell style={{ color: "white" }} className="header">
                        Per Hour
                      </TableCell>
                      <TableCell style={{ color: "white" }} className="header">
                        Per Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredConcepts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No hay datos por mostrar
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedConcepts.map((concept: any) => (
                        <TableRow key={concept.Id_Default_Concept}>
                          <TableCell>{concept.Id_Concept}</TableCell>
                          <TableCell>{concept.Description}</TableCell>
                          <TableCell>
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
                          <TableCell>{concept.Per_Hour}</TableCell>
                          <TableCell>{concept.Per_Amount}</TableCell>
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
