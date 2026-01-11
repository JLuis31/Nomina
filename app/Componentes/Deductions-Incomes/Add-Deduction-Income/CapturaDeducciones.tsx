"use client";
import NavDesktop from "../../NavDesktop/NavDesktop";
import "./CapturaDeducciones.scss";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

const CapturaDeducciones = (props) => {
  const session = useSession();
  const Router = useRouter();
  console.log("Session Status:", session);

  const {
    deduccionesDetails,
    empleadosDetails,
    valorUSDToMXN,
    departmentDetails,
    jobPositionsDetails,
    payFrequencyDetails,
  } = useUsersDetails();

  const [dataDeducion, setDataDeduccion] = useState({
    Movement_Type: "",
    Id_Concept: "",
    Id_Employee: "",
    Name: "",
    Id_Department: "",
    Id_JobPosition: "",
    Id_PayFrequency: "",
    Total_Amount: 0,
    Balance: 0,
    Created_By: session.data?.user?.email || "",
    Acumulated_Deducted: "",
    Id_Period: "",
  });

  const [nombreInput, setNombreInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [idInput, setIdInput] = useState("");
  const [idSuggestions, setIdSuggestions] = useState<any[]>([]);

  const [pagoPorPeriodo, setPagoPorPeriodo] = useState(false);
  const [paymentFrquencyByEmployee, setPaymentFrquencyByEmployee] = useState(
    []
  );

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreInput(value);
    setIdInput("");
    if (value === "") {
      setDataDeduccion({
        ...dataDeducion,
        Name: "",
        Id_Employee: "",
        Id_JobPosition: "",
        Id_Department: "",
        Id_PayFrequency: "",
      });
    } else {
      setDataDeduccion({ ...dataDeducion, Nombre: value });
    }
    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) => {
        const fullName =
          `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const idhandleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdInput(value);
    setNombreInput("");
    if (value === "") {
      setDataDeduccion({
        ...dataDeducion,
        Name: "",
        Id_Employee: "",
        Id_JobPosition: "",
        Id_Department: "",
        Id_PayFrequency: "",
      });
    } else {
      setDataDeduccion({
        ...dataDeducion,
        Id_Employee: value,
      });
    }
    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) =>
        String(empleado.Id_Employee).includes(value)
      );
      setIdSuggestions(filtered);
    } else {
      setIdSuggestions([]);
    }
  };

  const handleSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setNombreInput(fullName);
    setIdInput(String(empleado.Id_Employee));

    setDataDeduccion({
      ...dataDeducion,
      Id_Employee: empleado.Id_Employee,
      Name: fullName,
      Id_Department: empleado.Id_Department,
      Id_JobPosition: empleado.Id_Job,
      Id_PayFrequency: empleado.Id_PayFrequency,
    });
    setSuggestions([]);
    idPaymentFrequencyChange(String(empleado.Id_PayFrequency));
  };

  const handleIdSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setIdInput(String(empleado.Id_Employee));
    setNombreInput(fullName);
    setDataDeduccion({
      ...dataDeducion,
      Id_Employee: empleado.Id_Employee,
      Name: fullName,
      Id_Department: empleado.Id_Department,
      Id_JobPosition: empleado.Id_Job,
      Id_PayFrequency: empleado.Id_PayFrequency,
    });
    setIdSuggestions([]);
    idPaymentFrequencyChange(String(empleado.Id_PayFrequency));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      dataDeducion.Total_Amount === undefined ||
      dataDeducion.Total_Amount === 0
    ) {
      toast.error("Amount is required and must be greater than zero.");
      return;
    }

    if (dataDeducion.Acumulated_Deducted !== "N") {
      if (dataDeducion.Balance === undefined || dataDeducion.Balance === 0) {
        toast.error("Balance is required and must be greater than zero.");
        return;
      }
      if (dataDeducion.Total_Amount > dataDeducion.Balance) {
        toast.error("Amount cannot be greater than Balance.");
        return;
      }
    }

    if (dataDeducion.Id_Period === "" || dataDeducion.Id_Period === undefined) {
      toast.error("Period is required.");
      return;
    }
    if (
      dataDeducion.Id_Employee === "" ||
      dataDeducion.Id_Employee === undefined ||
      dataDeducion.Name === "" ||
      dataDeducion.Name === undefined
    ) {
      toast.error("Employee ID and Name are required.");
      return;
    }

    if (
      dataDeducion.Acumulated_Deducted === "" ||
      dataDeducion.Acumulated_Deducted === undefined
    ) {
      toast.error("Please select Accumulated or Deducted option.");
      return;
    }

    if (
      dataDeducion.Id_Concept === "" ||
      dataDeducion.Id_Concept === undefined
    ) {
      toast.error("Please select a Concept.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/EmployeesMovements",
        dataDeducion
      );

      if (response.status === 201) {
        if (dataDeducion.Movement_Type === "D") {
          toast.success(
            `Deduction added successfully to employee: ${dataDeducion.Name}`
          );
        } else {
          toast.success(
            `Income added successfully to employee: ${dataDeducion.Name}`
          );
        }
        props.setRefreshTable();
        props.modalOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.message);
      }
    }
  };

  useEffect(() => {
    if (!pagoPorPeriodo) {
      setDataDeduccion((prev) => ({
        ...prev,
        Numero_Periodos: "",
        Pago_Por_Periodo: 0,
      }));
    }
  }, [pagoPorPeriodo]);

  const idPaymentFrequencyChange = async (idInput: string) => {
    try {
      const response = await axios.get("/api/EmployeesMovements", {
        params: { idPaymentFrequency: idInput },
      });
      console.log("Payment Frequency Response:", response.data);

      setPaymentFrquencyByEmployee(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (session.status === "loading") {
    return (
      <Dialog open={true} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <ClipLoader size={100} color={"#123abc"} loading={true} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (session.status === "unauthenticated") {
    Router.push("/api/auth/signin");
    return null;
  }

  const employeeOptions = empleadosDetails.map((empleado: any) => ({
    label: `${empleado.Id_Employee} - ${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`,
    id: empleado.Id_Employee,
    ...empleado,
  }));

  return (
    <Dialog
      open={true}
      onClose={() => props.modalOpen(false)}
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
          pb: 1,
          backgroundColor: "#345d8a",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AddIcon />
          <Typography variant="h6" component="span">
            Add Deduction or Income
          </Typography>
        </Box>
        <IconButton
          onClick={() => props.modalOpen(false)}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Employee Information
            </Typography>

            <Autocomplete
              options={employeeOptions}
              getOptionLabel={(option) => option.label}
              value={
                employeeOptions.find(
                  (emp) => emp.id === dataDeducion.Id_Employee
                ) || null
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  handleSuggestionClick(newValue);
                } else {
                  setNombreInput("");
                  setIdInput("");
                  setDataDeduccion({
                    ...dataDeducion,
                    Name: "",
                    Id_Employee: "",
                    Id_JobPosition: "",
                    Id_Department: "",
                    Id_PayFrequency: "",
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Employee by ID or Name"
                  required
                  placeholder="Type to search..."
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
                </li>
              )}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Job Position"
                  value={
                    jobPositionsDetails.find(
                      (jobPosition: any) =>
                        String(jobPosition.Id_Job) ===
                        String(dataDeducion.Id_JobPosition)
                    )?.Description || ""
                  }
                  disabled
                  size="small"
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Department"
                  value={
                    departmentDetails.find(
                      (department: any) =>
                        String(department.Id_Department) ===
                        String(dataDeducion.Id_Department)
                    )?.Description || ""
                  }
                  disabled
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Movement Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Concept</InputLabel>
                <Select
                  value={dataDeducion.Id_Concept}
                  label="Concept"
                  onChange={(e) => {
                    const selectedConcept = deduccionesDetails.find(
                      (deduccion: any) =>
                        String(deduccion.Id_Concept).trim() ===
                        e.target.value.trim()
                    );
                    setDataDeduccion({
                      ...dataDeducion,
                      Id_Concept: e.target.value,
                      Movement_Type: selectedConcept?.Id_Concept_Type || "",
                      Acumulated_Deducted: "",
                    });
                  }}
                >
                  {deduccionesDetails.map((deduccion: any) => (
                    <MenuItem
                      key={deduccion.Id_Concept}
                      value={deduccion.Id_Concept}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2">
                          {deduccion.Id_Concept} - {deduccion.Description}
                        </Typography>
                        <Chip
                          label={
                            deduccion.Id_Concept_Type === "I"
                              ? "Income"
                              : "Deduction"
                          }
                          size="small"
                          sx={{
                            ml: "auto",
                            backgroundColor:
                              deduccion.Id_Concept_Type === "I"
                                ? "#e8f5e9"
                                : "#ffebee",
                            color:
                              deduccion.Id_Concept_Type === "I"
                                ? "#2e7d32"
                                : "#c62828",
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    required
                    inputProps={{ min: 1, max: dataDeducion.Balance }}
                    onChange={(e) => {
                      setDataDeduccion({
                        ...dataDeducion,
                        Total_Amount: Number(e.target.value),
                      });
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: "action.active" }}>$</Box>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                  <FormControl fullWidth required>
                    <InputLabel>Accumulated or Deducted</InputLabel>
                    <Select
                      value={dataDeducion.Acumulated_Deducted}
                      label="Accumulated or Deducted"
                      onChange={(e) =>
                        setDataDeduccion({
                          ...dataDeducion,
                          Acumulated_Deducted: e.target.value,
                          Balance:
                            e.target.value === "N" ? 0 : dataDeducion.Balance,
                        })
                      }
                    >
                      <MenuItem
                        value="I"
                        disabled={
                          deduccionesDetails.find(
                            (deduccion: any) =>
                              String(deduccion.Id_Concept) ===
                              String(dataDeducion.Id_Concept)
                          )?.Id_Concept_Type === "D"
                        }
                      >
                        Accumulate
                      </MenuItem>
                      <MenuItem
                        value="R"
                        disabled={
                          deduccionesDetails.find(
                            (deduccion: any) =>
                              String(deduccion.Id_Concept) ===
                              String(dataDeducion.Id_Concept)
                          )?.Id_Concept_Type === "I"
                        }
                      >
                        Deduct
                      </MenuItem>
                      <MenuItem value="N">Nothing</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                  <TextField
                    fullWidth
                    label="Balance"
                    type="number"
                    disabled={dataDeducion.Acumulated_Deducted === "N"}
                    value={
                      dataDeducion.Acumulated_Deducted === "N"
                        ? ""
                        : dataDeducion.Balance || ""
                    }
                    required={dataDeducion.Acumulated_Deducted !== "N"}
                    inputProps={{ min: 1 }}
                    onChange={(e) =>
                      setDataDeduccion({
                        ...dataDeducion,
                        Balance: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: "action.active" }}>$</Box>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                  <FormControl fullWidth required>
                    <InputLabel>Period</InputLabel>
                    <Select
                      value={dataDeducion.Id_Period}
                      label="Period"
                      onChange={(e) => {
                        setDataDeduccion({
                          ...dataDeducion,
                          Id_Period: e.target.value,
                        });
                      }}
                    >
                      {(paymentFrquencyByEmployee || []).map((period: any) => {
                        const start = period.Period_Start.split("T")[0];
                        const end = period.Period_End.split("T")[0];
                        return (
                          <MenuItem
                            key={period.Id_Period}
                            value={`${period.Id_PayFrequency}|${period.Id_Period}`}
                          >
                            {`🗓️ ${start} → ${end} (Period ${period.Id_Period})`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={() => props.modalOpen(false)}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: "#345d8a",
            "&:hover": { backgroundColor: "#2a4a6e" },
          }}
        >
          {dataDeducion.Movement_Type === "D" ? "Add Deduction" : "Add Income"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CapturaDeducciones;
