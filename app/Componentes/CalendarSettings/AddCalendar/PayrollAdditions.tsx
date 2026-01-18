"use client";

import { useState, useEffect } from "react";
import "./PayrollAdditions.scss";
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";

const PayrollAdditions = (props) => {
  const { payFrequencyDetails } = useUsersDetails();

  const [data, setData] = useState({
    Id_PayFrequency: payFrequencyDetails[0]?.Id_PayFrequency,
    Year: 0,
    Id_Period: props.calendarDetails.length === 0 ? "1" : "",
    Month: 1,
    Period_Start: "",
    Period_End: "",
  });

  const [specificPeriods, setSpecificPeriods] = useState([]);

  useEffect(() => {
    if (data.Year !== 0 && data.Id_PayFrequency) {
      const nextPeriod =
        specificPeriods.length > 0
          ? Math.max(...specificPeriods.map((p) => Number(p.Id_Period))) + 1
          : 1;
      setData((prev) => ({ ...prev, Id_Period: String(nextPeriod) }));
    }
  }, [specificPeriods, data.Year, data.Id_PayFrequency]);

  const fetchPeriods = async () => {
    try {
      const response = await axios.get("/api/Calendars/SpecificPeriods", {
        params: {
          year: data.Year,
          payFrequencyId: data.Id_PayFrequency,
        },
      });
      if (response.status === 200) {
        setSpecificPeriods(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleSubmit = async () => {

    if (data.Year === 0 || data.Period_Start === "" || data.Period_End === "") {
      toast.error("Please fill in all required fields.", { duration: 2000 });
      return;
    }

    try {
      const response = await axios.post("/api/Calendars", data);

      if (response.status === 200) {
        toast.success("Payroll Addition created successfully!");
        await fetchPeriods();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    if (data.Year !== 0 && data.Id_PayFrequency) {
      fetchPeriods();
    }
  }, [data.Year, data.Id_PayFrequency]);

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
          <AddCircleOutlineIcon />
          <Typography variant="h6" component="span">
            Add Payroll Period
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
              Creating new payroll period
            </Typography>
            <Chip
              icon={<CalendarMonthIcon />}
              label="New Period"
              color="primary"
              size="small"
            />
          </Box>

          <Divider />

          <FormControl fullWidth>
            <InputLabel>Payment Frequency</InputLabel>
            <Select
              value={data.Id_PayFrequency}
              label="Payment Frequency"
              onChange={(e) =>
                setData({ ...data, Id_PayFrequency: e.target.value })
              }
            >
              {payFrequencyDetails.map((item) => (
                <MenuItem
                  key={item.Id_PayFrequency}
                  value={item.Id_PayFrequency}
                >
                  {item.Description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
              <FormControl fullWidth required>
                <InputLabel>Year</InputLabel>
                <Select
                  value={data.Year}
                  label="Year"
                  onChange={(e) =>
                    setData({ ...data, Year: Number(e.target.value) })
                  }
                >
                  <MenuItem value={0} disabled>
                    Select a year
                  </MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
              <Tooltip title="Auto-generated based on year and frequency" arrow>
                <TextField
                  fullWidth
                  label="Period"
                  value={data.Id_Period}
                  disabled
                  helperText="Auto-calculated"
                />
              </Tooltip>
            </Box>
          </Box>

          <FormControl fullWidth required>
            <InputLabel>Month</InputLabel>
            <Select
              value={data.Month}
              label="Month"
              onChange={(e) =>
                setData({ ...data, Month: Number(e.target.value) })
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

          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
                  required
                  label="Start Date"
                  type="date"
                  value={data.Period_Start}
                  onChange={(e) =>
                    setData({
                      ...data,
                      Period_Start: e.target.value,
                      Period_End: "",
                    })
                  }
                  inputProps={{
                    min: data.Year !== 0 ? `${data.Year}-01-01` : undefined,
                    max: data.Year !== 0 ? `${data.Year}-12-31` : undefined,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  required
                  label="End Date"
                  type="date"
                  value={data.Period_End}
                  onChange={(e) =>
                    setData({ ...data, Period_End: e.target.value })
                  }
                  inputProps={{
                    min: data.Period_Start
                      ? new Date(
                          new Date(data.Period_Start).getTime() +
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : data.Year !== 0
                      ? `${data.Year}-01-01`
                      : undefined,
                    max: data.Year !== 0 ? `${data.Year}-12-31` : undefined,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>

          {specificPeriods.length > 0 && (
            <Box
              sx={{
                p: 1.5,
                backgroundColor: "#e3f2fd",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="primary">
                <strong>{specificPeriods.length}</strong> existing period(s) for
                this year and frequency
              </Typography>
            </Box>
          )}
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
          onClick={() => {
            handleSubmit();
            props.refreshTable();
          }}
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "#345d8a",
            "&:hover": { backgroundColor: "#2a4a6e" },
          }}
        >
          Add Period
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollAdditions;
