"use client";
import "./EmployeeAdition.scss";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const EmployeeAdition = ({
  cancelData,
  actualizarTabla,
}: {
  cancelData: (dato: boolean) => void;
  actualizarTabla: (dato: boolean) => void;
}) => {
  const {
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    statesDetails,
    cityDetails,
    reloadEmpleadosDetails,
  } = useUsersDetails();

  const [personalInformation, setPersonalInformation] = useState({
    name: "",
    firstSurname: "",
    secondSurname: "",
    email: "",
    phone: "",
    address: "",
    curp: "",
    rfc: "",
    State: "1",
    City: "1",
  });
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "1",
    department: "1",
    employeeType: "1",
    startDate: new Date().toISOString().slice(0, 10),
    salary: "",
    status: "In Process",
  });
  const modalVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0, 0, 0.58, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.42, 0, 1, 1] as [number, number, number, number],
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting employee data:", {
      personalInformation,
      jobDetails,
    });
    if (
      personalInformation.name === "" ||
      personalInformation.firstSurname === "" ||
      personalInformation.email === "" ||
      personalInformation.phone === "" ||
      jobDetails.startDate === "" ||
      jobDetails.salary === "" ||
      !personalInformation.email.includes("@") ||
      !personalInformation.email.includes(".com") ||
      personalInformation.curp === "" ||
      personalInformation.rfc === ""
    ) {
      toast.error(
        "Please fill in all required personal or job details fields."
      );
      return;
    }
    const combinedData = { ...personalInformation, ...jobDetails };

    try {
      const response = await axios.post(
        "/api/Employees/EmployeesAddition",
        combinedData
      );
      if (response.status === 201) {
        toast.success("Employee added successfully!");
        reloadEmpleadosDetails();

        setJobDetails({
          jobTitle: "Developer",
          department: "Human Resources",
          employeeType: "Full-time",
          startDate: new Date().toISOString().slice(0, 10),
          salary: "",
          status: "Active",
        });
        setPersonalInformation({
          ...personalInformation,
          name: "",
          firstSurname: "",
          secondSurname: "",
          email: "",
          phone: "",
          address: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        toast.error(`${data.message || "Ocurrió un error"}`);
      } else {
        toast.error("Failed to add employee. Please try again.");
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => cancelData(false)}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonAddIcon />
          <Typography variant="h6" component="span">
            Add New Employee
          </Typography>
        </Box>
        <IconButton
          onClick={() => cancelData(false)}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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
                  placeholder="Enter name"
                  value={personalInformation.name}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
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
                      placeholder="Enter first surname"
                      value={personalInformation.firstSurname}
                      onChange={(e) =>
                        setPersonalInformation({
                          ...personalInformation,
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
                      placeholder="Enter second surname (optional)"
                      value={personalInformation.secondSurname}
                      onChange={(e) =>
                        setPersonalInformation({
                          ...personalInformation,
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
                  placeholder="example@email.com"
                  value={personalInformation.email}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      email: e.target.value.trim(),
                    })
                  }
                  inputProps={{ maxLength: 100 }}
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
                  placeholder="10 digits"
                  value={personalInformation.phone}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      phone: e.target.value.trim(),
                    })
                  }
                  inputProps={{ maxLength: 10 }}
                  helperText={`${personalInformation.phone.length}/10 digits`}
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
                      placeholder="18 characters"
                      value={personalInformation.curp}
                      onChange={(e) =>
                        setPersonalInformation({
                          ...personalInformation,
                          curp: e.target.value.trim(),
                        })
                      }
                      inputProps={{
                        maxLength: 18,
                        minLength: 18,
                        style: { textTransform: "uppercase" },
                      }}
                      helperText={`${personalInformation.curp.length}/18 characters`}
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      label="RFC"
                      placeholder="13 characters"
                      value={personalInformation.rfc}
                      onChange={(e) =>
                        setPersonalInformation({
                          ...personalInformation,
                          rfc: e.target.value.trim(),
                        })
                      }
                      inputProps={{
                        maxLength: 13,
                        minLength: 13,
                        style: { textTransform: "uppercase" },
                      }}
                      helperText={`${personalInformation.rfc.length}/13 characters`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={personalInformation.State}
                        label="State"
                        onChange={(e) =>
                          setPersonalInformation({
                            ...personalInformation,
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
                        value={personalInformation.City}
                        label="City"
                        onChange={(e) =>
                          setPersonalInformation({
                            ...personalInformation,
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
                <WorkIcon /> Job Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={jobDetails.department}
                        label="Department"
                        onChange={(e) =>
                          setJobDetails({
                            ...jobDetails,
                            department: e.target.value,
                          })
                        }
                      >
                        {departmentDetails.map((position) => (
                          <MenuItem
                            key={position.Id_Department}
                            value={position.Id_Department}
                          >
                            {position.Description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <FormControl fullWidth required>
                      <InputLabel>Job Title</InputLabel>
                      <Select
                        value={jobDetails.jobTitle}
                        label="Job Title"
                        onChange={(e) =>
                          setJobDetails({
                            ...jobDetails,
                            jobTitle: e.target.value,
                          })
                        }
                      >
                        {jobPositionsDetails.map((dept) => (
                          <MenuItem key={dept.Id_Job} value={dept.Id_Job}>
                            {dept.Description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    value={jobDetails.employeeType}
                    label="Employee Type"
                    onChange={(e) =>
                      setJobDetails({
                        ...jobDetails,
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

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Salary per Hour"
                      placeholder="0.00"
                      value={jobDetails.salary}
                      onChange={(e) =>
                        setJobDetails({
                          ...jobDetails,
                          salary: e.target.value.trim(),
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
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label="Start Date"
                      value={jobDetails.startDate}
                      onChange={(e) =>
                        setJobDetails({
                          ...jobDetails,
                          startDate: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Box>

                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={jobDetails.status}
                    label="Status"
                    onChange={(e) =>
                      setJobDetails({ ...jobDetails, status: e.target.value })
                    }
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        size="small"
                        sx={{
                          backgroundColor:
                            value === "Active" ? "#e8f5e9" : "#fff3e0",
                          color: value === "Active" ? "#2e7d32" : "#ef6c00",
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
                    <MenuItem value="In Process">
                      <Chip
                        label="In Process"
                        size="small"
                        sx={{
                          backgroundColor: "#fff3e0",
                          color: "#ef6c00",
                          fontWeight: 550,
                        }}
                      />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => cancelData(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => actualizarTabla(true)}
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              backgroundColor: "#345d8a",
              "&:hover": { backgroundColor: "#2a4a6e" },
            }}
          >
            Add Employee
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeAdition;
