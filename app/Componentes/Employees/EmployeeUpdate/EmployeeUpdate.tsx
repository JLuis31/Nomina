"use client";
import { useState, useEffect } from "react";
import "./EmployeeUpdate.scss";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const UserActions = (props) => {
  const [userActions, setSecondUserActions] = useState({
    employeeID: props.selectedEmployee?.Id_Employee || "",
    name: props.selectedEmployee?.Name || "",
    firstSurname: props.selectedEmployee?.First_SurName || "",
    secondSurname: props.selectedEmployee?.Second_SurName || "",
    curp: props.selectedEmployee?.Curp || "",
    rfc: props.selectedEmployee?.RFC || "",
    email: props.selectedEmployee?.Email || "",
    phone: props.selectedEmployee?.Phone_Number || "",
    address: props.selectedEmployee?.Address || "",
    State: props.selectedEmployee?.Id_State || "",
    City: props.selectedEmployee?.Id_City || "",
    jobTitle: props.selectedEmployee?.Id_Job || "",
    department: props.selectedEmployee?.Id_Department || "",
    employeeType: props.selectedEmployee?.Id_Employee_type || "",
    employeeStatus: props.selectedEmployee?.Status || "",
    salary: props.selectedEmployee?.Salary || "",
    payFrequency:
      props.selectedEmployee?.Id_PayFrequency === 0
        ? 1
        : props.selectedEmployee?.Id_PayFrequency || "",
    bankAccountNumber: props.selectedEmployee?.BankAccountNumber || "",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        props.cancelData(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const {
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    payFrequencyDetails,
    reloadEmpleadosDetails,
    statesDetails,
    cityDetails,
  } = useUsersDetails();

  const getDepartmentDescription = (id: number) => {
    const department = departmentDetails.find((d) => d.Id_Department === id);
    return department ? department.Description : "Unknown";
  };

  const getJobPositionDescription = (id: number) => {
    const jobPosition = jobPositionsDetails.find((j) => j.Id_Job === id);
    return jobPosition ? jobPosition.Description : "Unknown";
  };

  const handlePut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/Employees/SpecificEmployee", {
        Id_Employee: props.selectedEmployee?.Id_Employee,
        UserData: userActions,
      });
      if (response.status === 200) {
        props.onUpdate();
        toast.success("Employee updated successfully!", { duration: 2000 });
        reloadEmpleadosDetails();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error updating employee: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => props.cancelData(false)}
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
          <EditIcon />
          <Box>
            <Typography variant="h6" component="span">
              Edit Employee: {props.selectedEmployee?.Name}
            </Typography>
            <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
              {getJobPositionDescription(props.selectedEmployee.Id_Job)} •{" "}
              {getDepartmentDescription(props.selectedEmployee.Id_Department)}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => props.cancelData(false)}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handlePut}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <PersonIcon /> Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  defaultValue={props.selectedEmployee.Name}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      name: e.target.value,
                    })
                  }
                  inputProps={{ maxLength: 50 }}
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      label="First Surname"
                      defaultValue={props.selectedEmployee.First_SurName}
                      onChange={(e) =>
                        setSecondUserActions({
                          ...userActions,
                          firstSurname: e.target.value,
                        })
                      }
                      inputProps={{ maxLength: 50 }}
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      label="Second Surname"
                      defaultValue={props.selectedEmployee.Second_Surname}
                      onChange={(e) =>
                        setSecondUserActions({
                          ...userActions,
                          secondSurname: e.target.value,
                        })
                      }
                      inputProps={{ maxLength: 50 }}
                    />
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  defaultValue={props.selectedEmployee.Email}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      email: e.target.value.trim(),
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  required
                  type="tel"
                  label="Phone Number"
                  defaultValue={props.selectedEmployee.Phone_Number}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      phone: e.target.value.trim(),
                    })
                  }
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      label="CURP"
                      defaultValue={props.selectedEmployee.Curp}
                      onChange={(e) =>
                        setSecondUserActions({
                          ...userActions,
                          curp: e.target.value.trim(),
                        })
                      }
                      inputProps={{
                        maxLength: 18,
                        minLength: 18,
                        style: { textTransform: "uppercase" },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      label="RFC"
                      defaultValue={props.selectedEmployee.RFC}
                      onChange={(e) =>
                        setSecondUserActions({
                          ...userActions,
                          rfc: e.target.value.trim(),
                        })
                      }
                      inputProps={{
                        maxLength: 13,
                        minLength: 13,
                        style: { textTransform: "uppercase" },
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>State</InputLabel>
                      <Select
                        defaultValue={props.selectedEmployee.Id_State}
                        label="State"
                        onChange={(e) =>
                          setSecondUserActions({
                            ...userActions,
                            State: e.target.value,
                          })
                        }
                      >
                        {statesDetails.map((state) => (
                          <MenuItem key={state.Id_State} value={state.Id_State}>
                            {state.State}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>City</InputLabel>
                      <Select
                        defaultValue={props.selectedEmployee.Id_City}
                        label="City"
                        onChange={(e) =>
                          setSecondUserActions({
                            ...userActions,
                            City: e.target.value,
                          })
                        }
                      >
                        {cityDetails.map((city) => (
                          <MenuItem key={city.Id_City} value={city.Id_City}>
                            {city.City}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <WorkIcon /> Job Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  defaultValue={props.selectedEmployee.Id_Employee}
                  disabled
                  helperText="This field cannot be edited"
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>Department</InputLabel>
                      <Select
                        defaultValue={props.selectedEmployee.Id_Department}
                        label="Department"
                        onChange={(e) =>
                          setSecondUserActions({
                            ...userActions,
                            department: e.target.value,
                          })
                        }
                      >
                        {departmentDetails.map((dept) => (
                          <MenuItem
                            key={dept.Id_Department}
                            value={dept.Id_Department}
                          >
                            {dept.Description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>Job Title</InputLabel>
                      <Select
                        defaultValue={props.selectedEmployee.Id_Job}
                        label="Job Title"
                        onChange={(e) =>
                          setSecondUserActions({
                            ...userActions,
                            jobTitle: e.target.value,
                          })
                        }
                      >
                        {jobPositionsDetails.map((position) => (
                          <MenuItem
                            key={position.Id_Job}
                            value={position.Id_Job}
                          >
                            {position.Description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    defaultValue={props.selectedEmployee.Id_Employee_type}
                    label="Employee Type"
                    onChange={(e) =>
                      setSecondUserActions({
                        ...userActions,
                        employeeType: e.target.value,
                      })
                    }
                  >
                    {employeeTypesDetails.map((type) => (
                      <MenuItem
                        key={type.Id_Employee_type}
                        value={type.Id_Employee_type}
                      >
                        {type.Description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    defaultValue={
                      props.selectedEmployee.Status === "1"
                        ? "Active"
                        : "Inactive"
                    }
                    label="Status"
                    onChange={(e) =>
                      setSecondUserActions({
                        ...userActions,
                        employeeStatus: e.target.value,
                      })
                    }
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        size="small"
                        sx={{
                          backgroundColor:
                            value === "Active" ? "#e8f5e9" : "#ffebee",
                          color: value === "Active" ? "#2e7d32" : "#c62828",
                          fontWeight: 550,
                        }}
                      />
                    )}
                  >
                    <MenuItem value="Active">
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          backgroundColor: "#e8f5e9",
                          color: "#2e7d32",
                          fontWeight: 550,
                        }}
                      />
                    </MenuItem>
                    <MenuItem value="Inactive">
                      <Chip
                        label="Inactive"
                        size="small"
                        sx={{
                          backgroundColor: "#ffebee",
                          color: "#c62828",
                          fontWeight: 550,
                        }}
                      />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <PaymentIcon /> Payroll Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Salary per Hour"
                      defaultValue={props.selectedEmployee.Salary}
                      onChange={(e) =>
                        setSecondUserActions({
                          ...userActions,
                          salary: e.target.value,
                        })
                      }
                      inputProps={{ min: 0, step: "0.01" }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: "action.active" }}>$</Box>
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>Payment Frequency</InputLabel>
                      <Select
                        defaultValue={props.selectedEmployee.Id_PayFrequency}
                        label="Payment Frequency"
                        onChange={(e) =>
                          setSecondUserActions({
                            ...userActions,
                            payFrequency: e.target.value,
                          })
                        }
                      >
                        {payFrequencyDetails.map((payFreq) => (
                          <MenuItem
                            key={payFreq.Id_PayFrequency}
                            value={payFreq.Id_PayFrequency}
                          >
                            {payFreq.Description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Bank Account Number"
                  value={userActions.bankAccountNumber}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      bankAccountNumber: e.target.value.trim(),
                    })
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => props.cancelData(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: "#345d8a",
              "&:hover": { backgroundColor: "#2a4a6e" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserActions;
