"use client";

import "../ItemsAddition/ItemsAddition.scss";
import { useState } from "react";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import DescriptionIcon from "@mui/icons-material/Description";

const ItemsAddition = (props) => {
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

  const {
    setDepartmentDetails,
    setEmployeeTypesDetails,
    setJobPositionsDetails,
    setPayFrequencyDetails,
    setDeduccionesDetails,
    setStatesDetails,
    setCityDetails,
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    payFrequencyDetails,
    deduccionesDetails,
    statesDetails,
    cityDetails,
    defaultConceptsDetails,
    setDefaultConceptsDetails,
  } = useUsersDetails();

  const [selectedOption, setSelectedOption] = useState({
    ConceptType: "I",
    department: String(props.catalog.value) || "1",
    Id_Concept: "",
    Name: "",
    IncomeTax: "0",
    SocialSec: "0",
    Id_PayFrequency: "",
  });

  const handleAddItem = async () => {
    if (
      selectedOption.department === "5" ||
      selectedOption.department === "8"
    ) {
      if (selectedOption.Name === "" || selectedOption.Id_Concept === "") {
        toast.error("Description or Id Concept cannot be empty");
        return;
      }
    }

    if (selectedOption.department === "5") {
      if (selectedOption.ConceptType === "") {
        toast.error("Concept Type cannot be empty");
        return;
      }
    }

    if (selectedOption.department === "8") {
      if (
        selectedOption.ConceptType === "" ||
        selectedOption.Id_PayFrequency === ""
      ) {
        toast.error("Concept Type or Payment Frequency cannot be empty");
        return;
      }
    }

    if (
      selectedOption.department !== "5" &&
      selectedOption.department !== "8"
    ) {
      if (selectedOption.Name === "") {
        toast.error("Description cannot be empty");
        return;
      }
    }

    try {
      const response = await axios.post(
        "/api/ValuesConfiguration",
        selectedOption
      );

      if (response.status === 200) {
        toast.success("Item added successfully");

        switch (response.data.department) {
          case "1":
            setDepartmentDetails([
              ...departmentDetails,
              response.data.addedData,
            ]);
            break;
          case "2":
            setEmployeeTypesDetails([
              ...employeeTypesDetails,
              response.data.addedData,
            ]);
            break;
          case "3":
            setJobPositionsDetails([
              ...jobPositionsDetails,
              response.data.addedData,
            ]);
            break;
          case "4":
            setPayFrequencyDetails([
              ...payFrequencyDetails,
              response.data.addedData,
            ]);
            break;
          case "5":
            setDeduccionesDetails([
              ...deduccionesDetails,
              response.data.addedData,
            ]);
            break;
          case "6":
            setStatesDetails([...statesDetails, response.data.addedData]);
            break;
          case "7":
            setCityDetails([...cityDetails, response.data.addedData]);
            break;
          case "6":
            setStatesDetails([...statesDetails, response.data.addedData]);
            break;
          case "7":
            setCityDetails([...cityDetails, response.data.addedData]);
            break;
          case "8":
            setDefaultConceptsDetails([
              ...defaultConceptsDetails,
              response.data.addedData,
            ]);
            break;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error adding item: " + error.response?.data.message);
        return;
      }
    }
  };


  const getItemTypeIcon = () => {
    switch (selectedOption.department) {
      case "1":
        return <BusinessIcon />;
      case "2":
        return <CategoryIcon />;
      case "3":
        return <WorkIcon />;
      case "4":
        return <CalendarMonthIcon />;
      case "5":
        return <AttachMoneyIcon />;
      case "6":
        return <LocationOnIcon />;
      case "7":
        return <LocationCityIcon />;
      case "8":
        return <DescriptionIcon />;
      default:
        return <AddCircleOutlineIcon />;
    }
  };

  const getItemTypeName = () => {
    const types = {
      "1": "Department",
      "2": "Employee Type",
      "3": "Job Position",
      "4": "Payment Frequency",
      "5": "Income / Deduction",
      "6": "State",
      "7": "City",
    };
    return types[selectedOption.department] || "Item";
  };

  return (
    <Dialog
      open={true}
      onClose={() => props.cancelData(false)}
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
          <AddCircleOutlineIcon />
          <Typography variant="h6" component="span">
            Add New Item
          </Typography>
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

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel id="item-type-label">Item Type</InputLabel>
            <Select
              labelId="item-type-label"
              value={selectedOption.department}
              label="Item Type"
              onChange={(e) =>
                setSelectedOption({
                  ...selectedOption,
                  department: e.target.value,
                  Id_Concept: "",
                  Name: "",
                  Id_PayFrequency: "",
                })
              }
            >
              <MenuItem value="1">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" /> Department
                </Box>
              </MenuItem>
              <MenuItem value="2">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CategoryIcon fontSize="small" /> Employee Type
                </Box>
              </MenuItem>
              <MenuItem value="3">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WorkIcon fontSize="small" /> Job Position
                </Box>
              </MenuItem>
              <MenuItem value="4">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonthIcon fontSize="small" /> Payment Frequency
                </Box>
              </MenuItem>
              <MenuItem value="5">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon fontSize="small" /> Payment Concepts
                </Box>
              </MenuItem>
              <MenuItem value="6">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon fontSize="small" /> State
                </Box>
              </MenuItem>
              <MenuItem value="7">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationCityIcon fontSize="small" /> City
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Creating:
            </Typography>
            <Chip
              icon={getItemTypeIcon()}
              label={getItemTypeName()}
              color="primary"
              size="small"
            />
          </Box>

          <Divider />

          {selectedOption.department === "5" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Tooltip title="Enter a unique identifier for the concept" arrow>
                <TextField
                  fullWidth
                  required
                  label="ID Concept"
                  value={selectedOption.Id_Concept}
                  onChange={(e) =>
                    setSelectedOption({
                      ...selectedOption,
                      Id_Concept: e.target.value.trim(),
                    })
                  }
                  inputProps={{ maxLength: 10 }}
                  helperText={`${selectedOption.Id_Concept.length}/10 characters`}
                />
              </Tooltip>

              <FormControl fullWidth required>
                <InputLabel>Concept Type</InputLabel>
                <Select
                  value={selectedOption.ConceptType}
                  label="Concept Type"
                  onChange={(e) =>
                    setSelectedOption({
                      ...selectedOption,
                      ConceptType: e.target.value,
                    })
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
            </Box>
          )}

          <TextField
            fullWidth
            required
            label="Description"
            value={selectedOption.Name}
            onChange={(e) =>
              setSelectedOption({
                ...selectedOption,
                Name: e.target.value,
              })
            }
            inputProps={{ maxLength: 50 }}
            helperText={`${selectedOption.Name.length}/50 characters`}
            multiline
            rows={2}
          />

          {selectedOption.department === "5" &&
            selectedOption.ConceptType !== "D" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Income Tax</InputLabel>
                  <Select
                    value={selectedOption.IncomeTax}
                    label="Income Tax"
                    onChange={(e) =>
                      setSelectedOption({
                        ...selectedOption,
                        IncomeTax: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Social Security</InputLabel>
                  <Select
                    value={selectedOption.SocialSec}
                    label="Social Security"
                    onChange={(e) =>
                      setSelectedOption({
                        ...selectedOption,
                        SocialSec: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
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
          onClick={handleAddItem}
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "#345d8a",
            "&:hover": { backgroundColor: "#2a4a6e" },
          }}
        >
          Add new item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemsAddition;
