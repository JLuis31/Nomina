"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface ConceptsByEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData: any;
}

const ConceptsByEmployee = ({
  isOpen,
  onClose,
  employeeData,
}: ConceptsByEmployeeProps) => {
  const { payFrequencyDetails, empleadosDetails, departmentDetails } =
    useUsersDetails();

  const [deductionsIncomesByUser, setDeductionsIncomesByUser] = useState([]);
  const [expandIncomes, setExpandIncomes] = useState(false);
  const [expandDeductions, setExpandDeductions] = useState(false);

  useEffect(() => {
    const DeductionsIncomesByEmployee = async () => {
      try {
        const response = await axios.get(
          "/api/PayrollCalculation/DeductionsIncomesByEmployee",
          {
            params: { employeeId: employeeData?.Id_Employee },
          },
        );

        if (response.status === 200) {
          setDeductionsIncomesByUser(response.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            `Error: ${error.response?.data?.message || error.message}`,
          );
        }
      }
    };

    DeductionsIncomesByEmployee();
  }, [employeeData]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          backgroundColor: "#345d8a",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReceiptIcon />
          <Typography variant="h6" component="span">
            Payroll Concepts - Employee {employeeData?.Id_Employee}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon /> Employee Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {employeeData?.Id_Employee || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {`${
                    empleadosDetails.filter(
                      (emp) =>
                        Number(emp.Id_Employee) ===
                        Number(employeeData?.Id_Employee),
                    )[0]?.Name
                  } ${
                    empleadosDetails.filter(
                      (emp) =>
                        Number(emp.Id_Employee) ===
                        Number(employeeData?.Id_Employee),
                    )[0]?.First_SurName
                  } ${
                    empleadosDetails.filter(
                      (emp) =>
                        Number(emp.Id_Employee) ===
                        Number(employeeData?.Id_Employee),
                    )[0]?.Second_Surname
                  }`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {departmentDetails?.find(
                    (dept) =>
                      dept.Id_Department ===
                      empleadosDetails.find(
                        (emp) =>
                          Number(emp.Id_Employee) ===
                          Number(employeeData?.Id_Employee),
                      )?.Id_Department,
                  )?.Description || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Pay Frequency
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {payFrequencyDetails.filter(
                    (pf) =>
                      Number(pf.Id_PayFrequency) ===
                      Number(employeeData?.Id_PayFrequency),
                  )[0].Description || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Period
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {employeeData?.Id_Period || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Salary Hour
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {`$${
                    empleadosDetails.find(
                      (emp) =>
                        Number(emp.Id_Employee) ===
                        Number(employeeData?.Id_Employee),
                    )?.Salary || "N/A"
                  }`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Gross Salary
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  ${employeeData?.GrossSalary?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Net Pay
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="success.main"
                >
                  ${employeeData?.Net_Pay?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <ReceiptIcon /> Payroll Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Concept</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Amount</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Gross Salary</TableCell>
                    <TableCell align="right">
                      ${employeeData?.GrossSalary?.toFixed(2) || "0.00"}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{
                      backgroundColor: "#e8f5e9",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#c8e6c9" },
                    }}
                    onClick={() => setExpandIncomes(!expandIncomes)}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {expandIncomes ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                        <strong>+ Incomes</strong>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        ${employeeData?.Incomes_Sumatory?.toFixed(2) || "0.00"}
                      </strong>
                    </TableCell>
                  </TableRow>

                  {expandIncomes &&
                    deductionsIncomesByUser
                      .filter((item: any) => item.Id_Concept_Type === "I")
                      .map((income: any, index: number) => (
                        <TableRow
                          key={`income-${index}`}
                          sx={{ backgroundColor: "#f1f8f4" }}
                        >
                          <TableCell sx={{ pl: 6, fontSize: "0.9rem" }}>
                            {`${income.Id_Concept} - ${income.Description}` ||
                              "N/A"}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.9rem" }}>
                            ${Number(income.Amount)?.toFixed(2) || "0.00"}
                          </TableCell>
                        </TableRow>
                      ))}

                  <TableRow
                    sx={{
                      backgroundColor: "#ffebee",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#ffcdd2" },
                    }}
                    onClick={() => setExpandDeductions(!expandDeductions)}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {expandDeductions ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                        <strong>- Deductions</strong>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        $
                        {employeeData?.Deductions_Sumatory?.toFixed(2) ||
                          "0.00"}
                      </strong>
                    </TableCell>
                  </TableRow>

                  {expandDeductions &&
                    deductionsIncomesByUser
                      .filter((item: any) => item.Id_Concept_Type === "D")
                      .map((deduction: any, index: number) => (
                        <TableRow
                          key={`deduction-${index}`}
                          sx={{ backgroundColor: "#fff5f5" }}
                        >
                          <TableCell sx={{ pl: 6, fontSize: "0.9rem" }}>
                            {`${deduction.Id_Concept} - ${deduction.Description}` ||
                              "N/A"}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.9rem" }}>
                            ${Number(deduction.Amount)?.toFixed(2) || "0.00"}
                          </TableCell>
                        </TableRow>
                      ))}

                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Income Tax</TableCell>
                    <TableCell align="right">
                      $
                      {employeeData?.Federal_Tax_Withheld?.toFixed(2) || "0.00"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Social Security Tax</TableCell>
                    <TableCell align="right">
                      $
                      {employeeData?.Social_Security_Withholding?.toFixed(2) ||
                        "0.00"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Total Tax Deductions</TableCell>
                    <TableCell align="right">
                      $
                      {employeeData?.Total_Tax_Deductions?.toFixed(2) || "0.00"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      backgroundColor: "#e3f2fd",
                      "& td": { borderTop: "2px solid #1976d2" },
                    }}
                  >
                    <TableCell>
                      <strong>Net Pay</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong style={{ color: "#2e7d32", fontSize: "1.1rem" }}>
                        ${employeeData?.Net_Pay?.toFixed(2) || "0.00"}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConceptsByEmployee;
