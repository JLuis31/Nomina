"use client";

import NavDesktop from "../../NavDesktop/NavDesktop";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { Alert, AlertTitle, Box, Paper, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import "./ClosePeriod.scss";
import axios from "axios";
import toast from "react-hot-toast";

const ClosePeriod = () => {
  const { lastPayrollPeriod } = useUsersDetails();

  const HandleClosingPeriod = async () => {
    if (!lastPayrollPeriod) {
      toast.error("No payroll period found to close.");
      return;
    }
    try {
      const response = await axios.get(
        `/api/PayrollCalculation/ClosePeriod?lastPayFrequency=${lastPayrollPeriod.Id_PayFrequency}`,
      );

      if (response.status === 200) {
        toast.success("Payroll period closed successfully.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error closing period: ${error.response?.data?.error || error.message}`,
        );
      }
    }
  };

  return (
    <div>
      <NavDesktop />
      <div className="close-period-container">
        <h2 style={{ marginTop: "2rem" }}>Close Payroll Period</h2>
        <label htmlFor="">You can close the payroll period here.</label>
        <hr />

        <Alert severity="warning" sx={{ mt: 3, mb: 3 }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>
            Warning: This action is permanent
          </AlertTitle>
          Once you close this payroll period, you will{" "}
          <strong>not be able to</strong>:
          <ul style={{ marginTop: "0.5rem", marginBottom: 0 }}>
            <li>Generate new reports for this period</li>
            <li>Modify employee movements or deductions</li>
            <li>Recalculate payroll for this period</li>
            <li>Make any changes to the period data</li>
          </ul>
        </Alert>

        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>
            ⚠️ Important Notice
          </AlertTitle>
          Closing the period is an <strong>irreversible action</strong>. All
          data will be locked and no modifications will be allowed.
        </Alert>

        <Box
          sx={{
            backgroundColor: "#fff7e6",
            borderLeft: "5px solid #ff4d4f",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            borderRadius: "5px",
            mb: 3,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <WarningAmberIcon sx={{ color: "#ff4d4f", fontSize: 30 }} />
            <h3 style={{ margin: 0, color: "#ff4d4f" }}>
              Before You Close This Period
            </h3>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Please review all information carefully. Once closed, you won't be
            able to generate reports, modify movements, or make any changes to
            this period's data. This action cannot be undone.
          </p>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            mb: 3,
            backgroundColor: "#e6f7ff",
            borderTop: "4px solid #1890ff",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
          >
            <InfoIcon
              sx={{ color: "#1890ff", fontSize: 32, marginTop: "0.2rem" }}
            />
            <div>
              <h3
                style={{ margin: 0, marginBottom: "0.5rem", color: "#1890ff" }}
              >
                Period Closure Information
              </h3>
              <p style={{ margin: 0, marginBottom: "0.8rem" }}>
                After closing this period, the following restrictions will
                apply:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                <li>No report generation</li>
                <li>No data modifications</li>
                <li>No recalculations allowed</li>
              </ul>
            </div>
          </div>
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            mb: 3,
          }}
        >
          <Button
            onClick={HandleClosingPeriod}
            variant="contained"
            color="error"
            size="large"
            startIcon={<LockIcon />}
            sx={{
              minWidth: "200px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#ff4d4f",
              "&:hover": {
                backgroundColor: "#d43f3f",
              },
            }}
          >
            Close Period
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default ClosePeriod;
