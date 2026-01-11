"use client";
import { useState } from "react";
import "../UpdateCalendar/UpdateCalendar.scss";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";

const UpdateCalendar = (props) => {
  const [updateData, setUpdateData] = useState({
    Description: props.dataRow[0].Description,
    Year: props.dataRow[0].Year,
    Month: props.dataRow[0].Month,
    Status: props.dataRow[0].Status,
    Id_PayFrequency: props.dataRow[0].Id_PayFrequency,
    Id_Period: props.dataRow[0].Id_Period,
    Period_Start: props.dataRow[0].Period_Start,
    Period_End: props.dataRow[0].Period_End,
  });

  const UpdateCalendar = async () => {
    try {
      const response = await axios.put(`/api/Calendars`, {
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
          <EditCalendarIcon />
          <Typography variant="h6" component="span">
            Edit Calendar Period
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Editing Period:
            </Typography>
            <Chip
              icon={<CalendarMonthIcon />}
              label={`Period ${props.dataRow[0].Id_Period} - ${props.dataRow[0].Year}`}
              color="primary"
              size="small"
            />
          </Box>

          <Divider />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={updateData.Year}
                  label="Year"
                  onChange={(e) =>
                    setUpdateData({ ...updateData, Year: e.target.value })
                  }
                >
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={updateData.Month}
                  label="Month"
                  onChange={(e) =>
                    setUpdateData({ ...updateData, Month: e.target.value })
                  }
                >
                  <MenuItem value={1}>January</MenuItem>
                  <MenuItem value={2}>February</MenuItem>
                  <MenuItem value={3}>March</MenuItem>
                  <MenuItem value={4}>April</MenuItem>
                  <MenuItem value={5}>May</MenuItem>
                  <MenuItem value={6}>June</MenuItem>
                  <MenuItem value={7}>July</MenuItem>
                  <MenuItem value={8}>August</MenuItem>
                  <MenuItem value={9}>September</MenuItem>
                  <MenuItem value={10}>October</MenuItem>
                  <MenuItem value={11}>November</MenuItem>
                  <MenuItem value={12}>December</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={updateData.Status}
              label="Status"
              onChange={(e) =>
                setUpdateData({ ...updateData, Status: e.target.value })
              }
            >
              <MenuItem value="Open">
                <Chip
                  label="Open"
                  size="small"
                  sx={{
                    backgroundColor: "#e8f5e9",
                    color: "#2e7d32",
                    fontWeight: 550,
                  }}
                />
              </MenuItem>
              <MenuItem value="Closed">
                <Chip
                  label="Closed"
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

          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <EventIcon fontSize="small" /> Period Duration
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={
                    updateData.Period_Start
                      ? updateData.Period_Start.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      Period_Start: e.target.value,
                      Period_End: "",
                    })
                  }
                  inputProps={{
                    min:
                      updateData.Year !== 0
                        ? `${updateData.Year}-01-01`
                        : undefined,
                    max:
                      updateData.Year !== 0
                        ? `${updateData.Year}-12-31`
                        : undefined,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={
                    updateData.Period_End
                      ? updateData.Period_End.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setUpdateData({ ...updateData, Period_End: e.target.value })
                  }
                  inputProps={{
                    min: updateData.Period_Start
                      ? new Date(
                          new Date(updateData.Period_Start).getTime() +
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : undefined,
                  }}
                  InputLabelProps={{ shrink: true }}
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
          onClick={UpdateCalendar}
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

export default UpdateCalendar;
