import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface ViewExceptionsProps {
  payFrequencyId: string;
}

const ViewExceptions = ({ payFrequencyId }: ViewExceptionsProps) => {
  const { payFrequencyDetails, empleadosDetails, defaultConceptsDetails } =
    useUsersDetails();
  const [exceptions, setExceptions] = useState<any[]>([]);

  useEffect(() => {
    const getExceptionsByPayFrequency = async (payFrequencyId: number) => {
      try {
        const response = await axios.get(
          `/api/Exceptions?payFrequencyId=${payFrequencyId}`
        );
        if (response.status === 200) {
          console.log("Fetched Exceptions:", response.data);
          setExceptions(response.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data.error || "Error fetching exceptions"
          );
        }
      }
    };
    getExceptionsByPayFrequency(Number(payFrequencyId));
  }, [payFrequencyId]);

  const getEmployeeName = (idEmployee: number) => {
    const employee = empleadosDetails.find(
      (emp: any) => emp.Id_Employee === idEmployee
    );
    if (employee) {
      return `${employee.Name} ${employee.First_SurName} ${employee.Second_Surname}`;
    }
    return "Unknown";
  };

  const getConceptDescription = (idConcept: string) => {
    const concept = defaultConceptsDetails.find(
      (c: any) => c.Id_Concept === idConcept
    );
    return concept?.Description || "Unknown";
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exceptions for Payment Frequency:{" "}
        {payFrequencyDetails.find(
          (pf) => Number(pf.Id_PayFrequency) === Number(payFrequencyId)
        )?.Description || "Unknown"}
      </Typography>

      {exceptions.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography color="text.secondary">
            No exceptions found for this payment frequency.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Employee ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Employee Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Concept
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  align="center"
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  align="center"
                >
                  Per Hour
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#345d8a",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  align="center"
                >
                  Per Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exceptions.map((exception: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{exception.Id_Employee}</TableCell>
                  <TableCell>
                    {getEmployeeName(exception.Id_Employee)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {getConceptDescription(exception.Id_Concept)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {exception.Id_Concept}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          exception.Id_Concept_Type === "I"
                            ? "#e8f5e9"
                            : "#ffebee",
                        color:
                          exception.Id_Concept_Type === "I"
                            ? "#2e7d32"
                            : "#c62828",
                        fontWeight: 550,
                      }}
                    >
                      {exception.Id_Concept_Type === "I"
                        ? "Income"
                        : "Deduction"}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{exception.Per_Hour}</TableCell>
                  <TableCell align="center">{exception.Per_Amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewExceptions;
