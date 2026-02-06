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
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const getExceptionsByPayFrequency = async (payFrequencyId: number) => {
      try {
        const response = await axios.get(
          `/api/Exceptions?payFrequencyId=${payFrequencyId}`
        );
        if (response.status === 200) {
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

  const filteredExceptions = exceptions.filter((exception) =>
    String(exception.Id_Employee).includes(filterText)
  );

  const confirmDelete = async (exception: any) => {

    try {
      const response = await axios.delete(
        `api/Exceptions/?idException=${exception.Id_Movement}&idEmployee=${exception.Id_Employee}&idConcept=${exception.Id_Concept}`
      );
      if (response.status === 200) {
        toast.success(
          response.data.message || "Exception deleted successfully"
        );
        setExceptions((prevExceptions) =>
          prevExceptions.filter(
            (ex) => ex.Id_Movement !== exception.Id_Movement
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Error deleting exception");
      }
    }
  };

  return (
    <div>
      <div className="buscador">
        <div className="filtro">
          <label
            style={{ marginTop: "-2rem" }}
            className="labelfiltrarpor"
            htmlFor=""
          >
            Filter by
          </label>
          <input
            type="text"
            placeholder="Filter by employee ID"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>
      <Box sx={{ py: 2 }}>
        <Typography variant="h6" gutterBottom>
          Exceptions for Payment Frequency:{" "}
          {payFrequencyDetails.find(
            (pf) => Number(pf.Id_PayFrequency) === Number(payFrequencyId)
          )?.Description || "Unknown"}
        </Typography>

        {filteredExceptions.length === 0 ? (
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
                  <TableCell
                    sx={{
                      backgroundColor: "#345d8a",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    align="center"
                  >
                    Actions{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExceptions.map((exception: any, index: number) => (
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
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          disabled={exception.Status === "Closed"}
                          className={
                            exception.Status === "Closed"
                              ? "disabled-button"
                              : ""
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(exception);
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
};

export default ViewExceptions;
