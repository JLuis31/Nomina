"use client";
import { useState } from "react";
import "../Update-Deduction-Income/Update-Deduction-Income.scss";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const UpdateDeductionIncome = (props) => {
  const { empleadosDetails } = useUsersDetails();

  const [updateData, setUpdateData] = useState({
    Id_Employee: props.dataRow[0].Id_Employee,
    Id: props.dataRow[0].Id_Movement,
    Name: props.dataRow[0].FullName,
    Total_Amount: props.dataRow[0].Total_Amount,
    Balance: props.dataRow[0].Deduction,
    Concept_Type: props.dataRow[0].Id_Concept_Type,
    Description: props.dataRow[0].Description,
  });

  const UpdateDeductionIncome = async () => {
    try {
      const response = await axios.put(`/api/DeductionsIncomes`, {
        dataFinal: updateData,
        dataInicial: props.dataRow[0],
      });

      if (response.status === 200) {
        toast.success(response.data.message, { duration: 2000 });
        props.setRefreshTable();
        props.modalOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Error updating calendar: " + error.response?.data.message,
          { duration: 2000 }
        );
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => props.modalOpen(false)}
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
          <EditIcon />
          <Typography variant="h6" component="span">
            Edit Amounts
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Movement Information
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="ID Movement"
                  value={updateData.Id}
                  disabled
                  size="small"
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", height: "100%" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mr: 1, color: "text.secondary" }}
                  >
                    Type:
                  </Typography>
                  <Chip
                    label={
                      updateData.Concept_Type === "D" ? "Deduction" : "Income"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        updateData.Concept_Type === "D" ? "#ffebee" : "#e8f5e9",
                      color:
                        updateData.Concept_Type === "D" ? "#c62828" : "#2e7d32",
                      fontWeight: 550,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={updateData.Id_Employee}
                  disabled
                  size="small"
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={updateData.Name}
                  disabled
                  size="small"
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Description"
              value={updateData.Description}
              disabled
              size="small"
              multiline
              rows={2}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Edit Amounts
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  type="number"
                  defaultValue={updateData.Total_Amount}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      Total_Amount: e.target.value,
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
                  label="Balance"
                  type="number"
                  defaultValue={updateData.Balance}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      Balance: e.target.value,
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
          Close
        </Button>
        <Button
          onClick={UpdateDeductionIncome}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: "#345d8a",
            "&:hover": { backgroundColor: "#2a4a6e" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDeductionIncome;
