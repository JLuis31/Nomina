"use client";
import { useState, useEffect } from "react";
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
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import DescriptionIcon from "@mui/icons-material/Description";

const UpdateTable = (props) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        props.isOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const {
    setStatesDetails,
    setCityDetails,
    setPayFrequencyDetails,
    setDepartmentDetails,
    setEmployeeTypesDetails,
    setJobPositionsDetails,
    setDeduccionesDetails,
    departmentDetails,
    payFrequencyDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    deduccionesDetails,
    cityDetails,
    statesDetails,
    defaultConceptsDetails,
    setDefaultConceptsDetails,
  } = useUsersDetails();

  const [data, setData] = useState({
    description:
      props.selectedDeduction.Description ||
      props.selectedDeduction.State ||
      props.selectedDeduction.City,
    concept_Type: props.selectedDeduction.Id_Concept_Type,
    income_Tax: props.selectedDeduction.Income_Tax ? 1 : 2,
    social_Security: props.selectedDeduction.Social_Security ? 1 : 2,
    concept_Selected: props.selectedDeduction,
    Id_Concept: props.selectedDeduction.Id_Concept,
    is_Default_Concept: defaultConceptsDetails.some(
      (dc) => dc.Id_Concept === props.selectedDeduction.Id_Concept
    )
      ? 1
      : 2,
  });

  const hasExistingDefaults =
    defaultConceptsDetails.filter(
      (dc) => dc.Id_Concept === props.selectedDeduction.Id_Concept
    ).length > 0;

  const getDepartmentIcon = () => {
    switch (props.selectedDeduction.Department) {
      case "Departments":
        return <BusinessIcon />;
      case "Employee Types":
        return <CategoryIcon />;
      case "Job Positions":
        return <WorkIcon />;
      case "Pay Frequency":
        return <CalendarMonthIcon />;
      case "Deductions":
        return <AttachMoneyIcon />;
      case "States":
        return <LocationOnIcon />;
      case "Cities":
        return <LocationCityIcon />;
      default:
        return <EditIcon />;
    }
  };

  const handleSubmit = async () => {
    if (
      data.description === "" ||
      data.description === null ||
      data.description === undefined
    ) {
      toast.error("Description cannot be empty.", { duration: 2000 });
      return;
    }

    // Validar que no se pueda cambiar a "No" si hay defaults existentes
    if (data.is_Default_Concept === 2 && hasExistingDefaults) {
      toast.error(
        "Cannot change to 'No' because there are existing default concepts for this concept. Please remove them first from the Default Concepts table.",
        { duration: 4000 }
      );
      return;
    }

    try {
      const response = await axios.put(`/api/ValuesConfiguration`, { data });
      if (response.status === 200) {
        toast.success(response.data.message, { duration: 2000 });
        props.isOpen(false);

        switch (response.data.department) {
          case "States":
            setStatesDetails(
              statesDetails.map((state) =>
                state.Id_State === response.data.updatedData.Id_State
                  ? response.data.updatedData
                  : state
              )
            );

            break;
          case "Cities":
            setCityDetails(
              cityDetails.map((city) =>
                city.Id_City === response.data.updatedData.Id_City
                  ? response.data.updatedData
                  : city
              )
            );
            break;
          case "Pay Frequency":
            setPayFrequencyDetails(
              payFrequencyDetails.map((pay) =>
                pay.Id_PayFrequency ===
                response.data.updatedData.Id_PayFrequency
                  ? response.data.updatedData
                  : pay
              )
            );
            break;
          case "Departments":
            setDepartmentDetails(
              departmentDetails.map((dep) =>
                dep.Id_Department === response.data.updatedData.Id_Department
                  ? response.data.updatedData
                  : dep
              )
            );
            break;
          case "Employee Types":
            setEmployeeTypesDetails(
              employeeTypesDetails.map((type) =>
                type.Id_Employee_type ===
                response.data.updatedData.Id_Employee_type
                  ? response.data.updatedData
                  : type
              )
            );

            break;
          case "Job Positions":
            setJobPositionsDetails(
              jobPositionsDetails.map((position) =>
                position.Id_Job === response.data.updatedData.Id_Job
                  ? response.data.updatedData
                  : position
              )
            );
            break;
          case "Deductions":
            setDeduccionesDetails(
              deduccionesDetails.map((deduction) =>
                deduction.Id_Concept === props.selectedDeduction.Id_Concept
                  ? response.data.updatedData
                  : deduction
              )
            );
        }
      }

      if (response.status === 204) {
        toast.error(response.data.message, { duration: 2000 });
      }
      const responseDefaultConcepts = await axios.get(
        "/api/CatalogsDetails/DefaultConcepts"
      );
      const dataDefaultConcepts = responseDefaultConcepts.data;

      setDefaultConceptsDetails(dataDefaultConcepts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error updating record: " + error.response?.data.message, {
          duration: 2000,
        });
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => props.isOpen(false)}
      maxWidth="sm"
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
          {getDepartmentIcon()}
          <Typography variant="h6" component="span">
            Edit{" "}
            {props.selectedDeduction.Department === "Deductions"
              ? "Concepts"
              : props.selectedDeduction.Department}
          </Typography>
        </Box>
        <IconButton
          onClick={() => props.isOpen(false)}
          sx={{ color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Editing:
            </Typography>
            <Chip
              icon={getDepartmentIcon()}
              label={
                props.selectedDeduction.Department === "Deductions"
                  ? "Concept"
                  : props.selectedDeduction.Department
              }
              color="primary"
              size="small"
            />
          </Box>

          <Divider />

          {props.selectedDeduction.Department !== "Deductions" && (
            <TextField
              fullWidth
              required
              label={
                props.selectedDeduction.Department === "States"
                  ? "State Name"
                  : props.selectedDeduction.Department === "Cities"
                  ? "City Name"
                  : "Description"
              }
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              inputProps={{ maxLength: 100 }}
              helperText={`${data.description?.length || 0}/100 characters`}
            />
          )}

          {props.selectedDeduction.Department === "Deductions" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Tooltip title="Unique identifier for the concept" arrow>
                <TextField
                  fullWidth
                  label="ID Concept"
                  value={data.Id_Concept}
                  onChange={(e) =>
                    setData({ ...data, Id_Concept: e.target.value })
                  }
                  inputProps={{ maxLength: 10 }}
                  helperText={`${data.Id_Concept?.length || 0}/10 characters`}
                />
              </Tooltip>

              <TextField
                fullWidth
                required
                label="Description"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                multiline
                rows={2}
                inputProps={{ maxLength: 50 }}
                helperText={`${data.description?.length || 0} characters`}
              />

              <FormControl fullWidth>
                <InputLabel>Concept Type</InputLabel>
                <Select
                  value={data.concept_Type}
                  label="Concept Type"
                  onChange={(e) =>
                    setData({ ...data, concept_Type: e.target.value })
                  }
                >
                  <MenuItem value="I">
                    <Chip
                      label="Income"
                      size="small"
                      sx={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        fontWeight: 550,
                      }}
                    />
                  </MenuItem>
                  <MenuItem value="D">
                    <Chip
                      label="Deduction"
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

              {data.concept_Type !== "D" && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Income Tax</InputLabel>
                    <Select
                      value={data.income_Tax === 1 ? "Yes" : "No"}
                      label="Income Tax"
                      onChange={(e) =>
                        setData({
                          ...data,
                          income_Tax: e.target.value === "Yes" ? 1 : 2,
                        })
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Social Security</InputLabel>
                    <Select
                      value={data.social_Security === 1 ? "Yes" : "No"}
                      label="Social Security"
                      onChange={(e) =>
                        setData({
                          ...data,
                          social_Security: e.target.value === "Yes" ? 1 : 2,
                        })
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              <FormControl fullWidth>
                <InputLabel>Is Default Concept</InputLabel>
                <Select
                  disabled={data.concept_Type === "D"}
                  value={data.is_Default_Concept === 1 ? "Yes" : "No"}
                  label="Is Default Concept"
                  onChange={(e) => {
                    const newValue = e.target.value === "Yes" ? 1 : 2;
                    if (newValue === 2 && hasExistingDefaults) {
                      toast.error(
                        "Cannot change to 'No' because there are existing default concepts. Remove them first from the Default Concepts catalog.",
                        { duration: 4000 }
                      );
                      return;
                    }
                    setData({
                      ...data,
                      is_Default_Concept: newValue,
                    });
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
                {hasExistingDefaults && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, ml: 1 }}
                  >
                    Note: This concept has{" "}
                    {
                      defaultConceptsDetails.filter(
                        (dc) =>
                          dc.Id_Concept === props.selectedDeduction.Id_Concept
                      ).length
                    }{" "}
                    default configuration(s) in the Default Concepts catalog.
                  </Typography>
                )}
              </FormControl>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={() => props.isOpen(false)}
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTable;
