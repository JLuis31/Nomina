"use client";

import "@/app/Componentes/PayrollCalculation/PayrollCalculation.scss";
import "@/app/Componentes/ValuesConfiguration/ValuesConfiguration.scss";
import NavDesktop from "../NavDesktop/NavDesktop";
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

  const subsidioMensual2025 = [
    { limInf: 0.01, limSup: 9081.0, cantidad: 390.0 },
    { limInf: 9081.01, limSup: Infinity, cantidad: 0.0 },
  ];
  const isrMensual2025 = [
    { limInf: 0.01, limSup: 746.04, cuota: 0.0, porcentaje: 0.0192 },
    { limInf: 746.05, limSup: 6332.05, cuota: 14.32, porcentaje: 0.064 },
    { limInf: 6332.06, limSup: 11128.01, cuota: 371.83, porcentaje: 0.1088 },
    { limInf: 11128.02, limSup: 12935.82, cuota: 893.63, porcentaje: 0.16 },
    { limInf: 12935.83, limSup: 15487.71, cuota: 1182.88, porcentaje: 0.1792 },
    { limInf: 15487.72, limSup: 31236.49, cuota: 1640.18, porcentaje: 0.2136 },
    { limInf: 31236.5, limSup: 49233.0, cuota: 5004.12, porcentaje: 0.2352 },
    { limInf: 49233.01, limSup: 93993.9, cuota: 9236.89, porcentaje: 0.3 },
    { limInf: 93993.91, limSup: 125325.2, cuota: 22665.17, porcentaje: 0.32 },
    { limInf: 125325.21, limSup: 375975.61, cuota: 32691.18, porcentaje: 0.34 },
    { limInf: 375975.62, limSup: Infinity, cuota: 117912.32, porcentaje: 0.35 },
  ];

  const subsidioQuincenal2025 = [
    { limInf: 0.01, limSup: 4480.76, cantidad: 192.46 },
    { limInf: 4480.77, limSup: Infinity, cantidad: 0.0 },
  ];

  const isrQuincenal2025 = [
    { limInf: 0.01, limSup: 368.1, cuota: 0.0, porcentaje: 0.0192 },
    { limInf: 368.11, limSup: 3124.35, cuota: 7.05, porcentaje: 0.064 },
    { limInf: 3124.36, limSup: 5490.75, cuota: 183.45, porcentaje: 0.1088 },
    { limInf: 5490.76, limSup: 6382.8, cuota: 441.0, porcentaje: 0.16 },
    { limInf: 6382.81, limSup: 7641.9, cuota: 583.65, porcentaje: 0.1792 },
    { limInf: 7641.91, limSup: 15412.8, cuota: 809.25, porcentaje: 0.2136 },
    { limInf: 15412.81, limSup: 24292.65, cuota: 2469.15, porcentaje: 0.2352 },
    { limInf: 24292.66, limSup: 46378.5, cuota: 4557.75, porcentaje: 0.3 },
    { limInf: 46378.51, limSup: 61838.1, cuota: 11183.4, porcentaje: 0.32 },
    { limInf: 61838.11, limSup: 185514.3, cuota: 16130.55, porcentaje: 0.34 },
    { limInf: 185514.31, limSup: Infinity, cuota: 58180.35, porcentaje: 0.35 },
  ];

  const subsidioSemanal2025 = [
    { limInf: 0.01, limSup: 2091.04, cantidad: 89.84 },
    { limInf: 2091.05, limSup: Infinity, cantidad: 0.0 },
  ];

  const isrSemanal2025 = [
    { limInf: 0.01, limSup: 171.78, cuota: 0.0, porcentaje: 0.0192 },
    { limInf: 171.79, limSup: 1458.03, cuota: 3.29, porcentaje: 0.064 },
    { limInf: 1458.04, limSup: 2562.35, cuota: 85.61, porcentaje: 0.1088 },
    { limInf: 2562.36, limSup: 2978.64, cuota: 205.8, porcentaje: 0.16 },
    { limInf: 2978.65, limSup: 3566.22, cuota: 272.37, porcentaje: 0.1792 },
    { limInf: 3566.23, limSup: 7192.64, cuota: 377.65, porcentaje: 0.2136 },
    { limInf: 7192.65, limSup: 11336.57, cuota: 1152.27, porcentaje: 0.2352 },
    { limInf: 11336.58, limSup: 21643.3, cuota: 2126.95, porcentaje: 0.3 },
    { limInf: 21643.31, limSup: 28857.78, cuota: 5218.92, porcentaje: 0.32 },
    { limInf: 28857.79, limSup: 86573.34, cuota: 7527.59, porcentaje: 0.34 },
    { limInf: 86573.35, limSup: Infinity, cuota: 27150.83, porcentaje: 0.35 },
  ];

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
          <Button
            style={{ opacity: data.payFrequency === "" ? "0" : "1" }}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add incident
          </Button>{" "}
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
    </div>
  );
};

export default PayrollCalculation;
