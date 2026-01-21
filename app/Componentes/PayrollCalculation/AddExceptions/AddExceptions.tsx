"use client";
import { useState, useEffect } from "react";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Input,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import toast from "react-hot-toast";
import ViewExceptions from "../ViewExceptions/ViewExceptions";

interface ExceptionsProps {
  isOpen: boolean;
  onClose: () => void;
  payFrequencyId: string;
}

const Exceptions = ({ isOpen, onClose, payFrequencyId }: ExceptionsProps) => {
  const { empleadosDetails, defaultConceptsDetails, payFrequencyDetails } =
    useUsersDetails();

  const [nombreInput, setNombreInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [idInput, setIdInput] = useState("");
  const [idSuggestions, setIdSuggestions] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState(0);
  const [existingExceptions, setExistingExceptions] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchExistingExceptions = async () => {
      if (!selectedEmployee || !selectedEmployee.Id_Employee) {
        setExistingExceptions([]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/Exceptions?payFrequencyId=${payFrequencyId}`
        );
        if (response.status === 200) {
          const employeeExceptions = response.data.filter(
            (ex: any) => ex.Id_Employee === selectedEmployee.Id_Employee
          );
          setExistingExceptions(employeeExceptions);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data.error || "Error fetching existing exceptions"
          );
        }
      }
    };

    fetchExistingExceptions();
  }, [selectedEmployee, payFrequencyId]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreInput(value);
    setIdInput("");

    if (value === "") {
      setSelectedEmployee(null);
    }

    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) => {
        const fullName =
          `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });

      const filteredByPayFrequency = filtered.filter((empleado: any) =>
        payFrequencyId
          ? empleado.Id_PayFrequency === Number(payFrequencyId)
          : true
      );
      setSuggestions(filteredByPayFrequency);
    } else {
      setSuggestions([]);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdInput(value);
    setNombreInput("");

    if (value === "") {
      setSelectedEmployee(null);
    }

    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) =>
        String(empleado.Id_Employee).includes(value)
      );
      const filteredByPayFrequency = filtered.filter((empleado: any) =>
        payFrequencyId
          ? empleado.Id_PayFrequency === Number(payFrequencyId)
          : true
      );
      setIdSuggestions(filteredByPayFrequency);
    } else {
      setIdSuggestions([]);
    }
  };

  const handleSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setNombreInput(fullName);
    setIdInput(String(empleado.Id_Employee));
    setSelectedEmployee(empleado);
    setSuggestions([]);
    setIdSuggestions([]);
  };

  const filteredConcepts = defaultConceptsDetails.filter((concept: any) => {
    if (concept.Id_PayFrequency !== Number(payFrequencyId)) {
      return false;
    }

    const hasException = existingExceptions.some(
      (ex: any) => ex.Id_Concept === concept.Id_Concept
    );

    return !hasException;
  });

  const handleSave = async () => {
    if (selectedEmployee.length === 0) {
      toast.error("Please select an employee before saving exceptions.");
      return;
    }

    const modifiedExceptions = Object.keys(exceptions).reduce((acc, key) => {
      const exception = exceptions[key];
      const originalConcept = filteredConcepts.find(
        (c: any) => c.Id_Concept === key
      );

      const hasPerHourChange =
        exception.Per_Hour !== undefined &&
        exception.Per_Hour !== "" &&
        parseFloat(exception.Per_Hour) !== originalConcept?.Per_Hour;

      const hasPerAmountChange =
        exception.Per_Amount !== undefined &&
        exception.Per_Amount !== "" &&
        parseFloat(exception.Per_Amount) !== originalConcept?.Per_Amount;

      if (hasPerHourChange || hasPerAmountChange) {
        acc[key] = exception;
      }

      return acc;
    }, {});

    if (Object.keys(modifiedExceptions).length === 0) {
      toast.error("No changes detected. Please modify at least one concept.");
      return;
    }

    const data = {
      Exceptions: modifiedExceptions,
      selectedEmployee,
    };

    try {
      const response = await axios.post("/api/Exceptions", data);

      if (response.status === 200) {
        toast.success(
          response.data.message || "Exceptions saved successfully."
        );
        setExceptions({});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while saving exceptions."
        );
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
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
          pb: 0,
          backgroundColor: "#345d8a",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAddIcon />
          <Typography variant="h6" component="span">
            Payroll Exceptions
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          backgroundColor: "#345d8a",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "white !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
            },
          }}
        >
          <Tab label="Add Exceptions" />
          <Tab label="View Exceptions" />
        </Tabs>
      </Box>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {activeTab === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Search Employee by Name"
                value={nombreInput}
                onChange={handleNombreChange}
                placeholder="Type employee name..."
              />
              {suggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: 200,
                    overflow: "auto",
                    mt: 0.5,
                  }}
                >
                  {suggestions.map((empleado: any) => (
                    <Box
                      key={empleado.Id_Employee}
                      sx={{
                        p: 1.5,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() => handleSuggestionClick(empleado)}
                    >
                      <Typography variant="body2">
                        {empleado.Id_Employee} -{" "}
                        {`${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Search Employee by ID"
                value={idInput}
                onChange={handleIdChange}
                placeholder="Type employee ID..."
              />
              {idSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: 200,
                    overflow: "auto",
                    mt: 0.5,
                  }}
                >
                  {idSuggestions.map((empleado: any) => (
                    <Box
                      key={empleado.Id_Employee}
                      sx={{
                        p: 1.5,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() => handleSuggestionClick(empleado)}
                    >
                      <Typography variant="body2">
                        {empleado.Id_Employee} -{" "}
                        {`${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

            <Divider />

            {selectedEmployee && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" color="primary">
                  Selected Employee:
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {selectedEmployee.Id_Employee}
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedEmployee.Name}{" "}
                  {selectedEmployee.First_SurName}{" "}
                  {selectedEmployee.Second_Surname}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment Frequency:</strong>{" "}
                  {
                    payFrequencyDetails.find(
                      (pf: any) =>
                        pf.Id_PayFrequency === selectedEmployee.Id_PayFrequency
                    )?.Description
                  }
                </Typography>
              </Box>
            )}

            {selectedEmployee && filteredConcepts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Concept Exceptions
                </Typography>
                <TableContainer component={Paper}>
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
                      {filteredConcepts.map((concept: any) => (
                        <TableRow key={concept.Id_Default_Concept}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {concept.Description}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {concept.Id_Concept}
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
                                  concept.Id_Concept_Type === "I"
                                    ? "#e8f5e9"
                                    : "#ffebee",
                                color:
                                  concept.Id_Concept_Type === "I"
                                    ? "#2e7d32"
                                    : "#c62828",
                                fontWeight: 550,
                              }}
                            >
                              {concept.Id_Concept_Type === "I"
                                ? "Income"
                                : "Deduction"}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Input
                              disabled={(() => {
                                const perAmount =
                                  exceptions[concept.Id_Concept]?.Per_Amount !==
                                  undefined
                                    ? exceptions[concept.Id_Concept]?.Per_Amount
                                    : concept.Per_Amount;
                                return (
                                  perAmount !== undefined &&
                                  perAmount !== "" &&
                                  perAmount !== 0 &&
                                  perAmount !== "0"
                                );
                              })()}
                              value={
                                exceptions[concept.Id_Concept]?.Per_Hour !==
                                undefined
                                  ? String(
                                      exceptions[concept.Id_Concept]
                                        ?.Per_Hour ?? ""
                                    )
                                  : String(concept.Per_Hour ?? "")
                              }
                              onChange={(e) =>
                                setExceptions({
                                  ...exceptions,
                                  [concept.Id_Concept]: {
                                    ...(exceptions[concept.Id_Concept] || {}),
                                    Id_Employee: selectedEmployee.Id_Employee,
                                    Id_Concept: concept.Id_Concept,
                                    Id_Concept_Type: concept.Id_Concept_Type,
                                    Per_Hour: e.target.value,
                                  },
                                })
                              }
                              type="number"
                              disableUnderline
                              sx={{
                                textAlign: "center",
                                borderRadius: 1,
                                background: "#f5f5f5",
                                fontWeight: "bold",
                                width: 100,
                                px: 1,
                                cursor: (() => {
                                  const perAmount =
                                    exceptions[concept.Id_Concept]
                                      ?.Per_Amount !== undefined
                                      ? exceptions[concept.Id_Concept]
                                          ?.Per_Amount
                                      : concept.Per_Amount;
                                  return perAmount !== undefined &&
                                    perAmount !== "" &&
                                    perAmount !== 0 &&
                                    perAmount !== "0"
                                    ? "not-allowed"
                                    : "text";
                                })(),
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Input
                              disabled={(() => {
                                const perHour =
                                  exceptions[concept.Id_Concept]?.Per_Hour !==
                                  undefined
                                    ? exceptions[concept.Id_Concept]?.Per_Hour
                                    : concept.Per_Hour;
                                return (
                                  perHour !== undefined &&
                                  perHour !== "" &&
                                  perHour !== 0 &&
                                  perHour !== "0"
                                );
                              })()}
                              value={
                                exceptions[concept.Id_Concept]?.Per_Amount !==
                                undefined
                                  ? String(
                                      exceptions[concept.Id_Concept]
                                        ?.Per_Amount ?? ""
                                    )
                                  : String(concept.Per_Amount ?? "")
                              }
                              onChange={(e) =>
                                setExceptions({
                                  ...exceptions,
                                  [concept.Id_Concept]: {
                                    ...(exceptions[concept.Id_Concept] || {}),
                                    Id_Employee: selectedEmployee.Id_Employee,
                                    Id_Concept: concept.Id_Concept,
                                    Id_Concept_Type: concept.Id_Concept_Type,
                                    Per_Amount: e.target.value,
                                  },
                                })
                              }
                              type="number"
                              disableUnderline
                              sx={{
                                textAlign: "center",
                                borderRadius: 1,
                                background: "#f5f5f5",
                                fontWeight: "bold",
                                width: 100,
                                px: 1,
                                cursor: (() => {
                                  const perHour =
                                    exceptions[concept.Id_Concept]?.Per_Hour !==
                                    undefined
                                      ? exceptions[concept.Id_Concept]?.Per_Hour
                                      : concept.Per_Hour;
                                  return perHour !== undefined &&
                                    perHour !== "" &&
                                    perHour !== 0 &&
                                    perHour !== "0"
                                    ? "not-allowed"
                                    : "text";
                                })(),
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {selectedEmployee && filteredConcepts.length === 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography color="text.secondary">
                  No default concepts available for this payment frequency.
                </Typography>
              </Box>
            )}

            {!selectedEmployee && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography color="text.secondary">
                  Please select an employee to add exceptions.
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <ViewExceptions payFrequencyId={payFrequencyId} />
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {activeTab === 0 && (
          <>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!selectedEmployee || filteredConcepts.length === 0}
              sx={{
                backgroundColor: "#345d8a",
                "&:hover": { backgroundColor: "#2a4a6e" },
              }}
            >
              Save Exceptions
            </Button>
          </>
        )}
        {activeTab === 1 && (
          <Button onClick={onClose} variant="outlined" color="inherit">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Exceptions;
