"use client";
import NavDesktop from "../../NavDesktop/NavDesktop";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import "./Reports.scss";
import axios from "axios";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface PayFrequency {
  Id_PayFrequency: number;
  Description: string;
}

interface GeneralReportItem {
  FullName: string;
  GrossSalary: number;
  Deductions_Sumatory: number;
  Incomes_Sumatory: number;
  Net_Pay: number;
}

interface SummaryISRReportItem {
  Id_Employee: number;
  Employee_Name: string;
  RFC: string;
  Id_Period: number;
  Id_PayFrequency: number;
  Base_Gravable_ISR: number;
  LowerLimit: number;
  FixedFree: number;
  Percentage: number;
  ISR_Retenido: number;
  Fecha_Pago: string;
  Total_Base_Gravable: number;
  Total_ISR_Retenido: number;
}

const Reports = () => {
  const { lastPayrollPeriod, payFrequencyDetails } = useUsersDetails();
  const [generalReport, setGeneralReport] = useState<GeneralReportItem[]>([]);
  const [summaryISRReport, setSummaryISRReport] = useState<
    SummaryISRReportItem[]
  >([]);

  // General Report

  const fetchGeneralReport = async () => {
    if (!lastPayrollPeriod) {
      toast.error("You have to calculate a payroll period first.");
      return null;
    }
    try {
      const response = await axios.get(
        `/api/Reports/GeneralReport?IdPayFrequency=${lastPayrollPeriod.Id_PayFrequency}`,
      );
      setGeneralReport(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error fetching report: ${error.response?.data?.message || error.message}`,
        );
      }
      return null;
    }
  };

  const handleGeneralReportPDF = async () => {
    const loadingToast = toast.loading("Generating PDF...");
    try {
      const data =
        generalReport.length > 0 ? generalReport : await fetchGeneralReport();

      if (!data || data.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("No data available for the report");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Payroll Summary Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Payment Frequency: ${payFrequencyDetails.find((freq: PayFrequency) => freq.Id_PayFrequency === lastPayrollPeriod?.Id_PayFrequency)?.Description || "N/A"}`,
        14,
        30,
      );
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

      const tableData = data.map((item: GeneralReportItem) => [
        item.FullName || "",
        `$${item.GrossSalary || 0}`,
        `$${item.Deductions_Sumatory || 0}`,
        `$${item.Incomes_Sumatory || 0}`,
        `$${item.Net_Pay || 0}`,
      ]);

      autoTable(doc, {
        head: [
          ["Employee", "Gross Salary", "Deductions", "Incomes", "Net Pay"],
        ],
        body: tableData,
        startY: 42,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [25, 118, 210] },
      });

      doc.save(`Payroll_Summary_${new Date().getTime()}.pdf`);
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error generating PDF");
    }
  };

  const handleGeneralReportExcel = async () => {
    const loadingToast = toast.loading("Generating Excel...");
    try {
      const data =
        generalReport.length > 0 ? generalReport : await fetchGeneralReport();

      if (!data || data.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("No data available for the report");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(data);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payroll Summary");

      XLSX.writeFile(wb, `Payroll_Summary_${new Date().getTime()}.xlsx`);
      toast.dismiss(loadingToast);
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error generating Excel");
    }
  };

  const Summary_ISR_By_Period = async () => {
    if (!lastPayrollPeriod) {
      toast.error("You have to calculate a payroll period first.");
      return null;
    }
    try {
      const response = await axios.get(
        `/api/Reports/Summary_ISR_By_Period?IdPayFrequency=${lastPayrollPeriod.Id_PayFrequency}`,
      );
      setSummaryISRReport(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error fetching report: ${error.response?.data?.message || error.message}`,
        );
      }
      return null;
    }
  };

  const handleSummaryISRReportPDF = async () => {
    const loadingToast = toast.loading("Generating PDF...");
    try {
      const data =
        summaryISRReport.length > 0
          ? summaryISRReport
          : await Summary_ISR_By_Period();
      if (!data || data.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("No data available for the report");
        return;
      }

      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(16);
      doc.text("Summary ISR Report", 14, 15);

      doc.setFontSize(9);
      doc.text(
        `Payment Frequency: ${payFrequencyDetails.find((freq: PayFrequency) => freq.Id_PayFrequency === lastPayrollPeriod?.Id_PayFrequency)?.Description || "N/A"}`,
        14,
        22,
      );
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 27);

      const tableData = data.map((item: SummaryISRReportItem) => [
        item.Id_Employee || "",
        item.Employee_Name || "",
        item.RFC || "",
        item.Id_Period || "",
        item.Id_PayFrequency || "",
        `$${Number(item.Base_Gravable_ISR || 0).toFixed(2)}`,
        `$${Number(item.LowerLimit || 0).toFixed(2)}`,
        `$${Number(item.FixedFree || 0).toFixed(2)}`,
        `${Number(item.Percentage || 0).toFixed(2)}%`,
        `$${Number(item.ISR_Retenido || 0).toFixed(2)}`,
        item.Fecha_Pago ? new Date(item.Fecha_Pago).toLocaleDateString() : "",
        `$${Number(item.Total_Base_Gravable || 0).toFixed(2)}`,
        `$${Number(item.Total_ISR_Retenido || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [
          [
            "Id Employee",
            "Employee Name",
            "RFC",
            "Id Period",
            "Id Pay Frequency",
            "Taxable Base ISR",
            "Lower Limit",
            "Fixed Free",
            "Percentage",
            "ISR Withheld",
            "Payment Date",
            "Total Taxable Base",
            "Total ISR Withheld",
          ],
        ],
        body: tableData,
        startY: 32,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          overflow: "linebreak",
          cellWidth: "wrap",
        },
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          fontSize: 7,
        },
        columnStyles: {
          0: { cellWidth: 13, halign: "center" },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 13, halign: "center" },
          4: { cellWidth: 13, halign: "center" },
          5: { cellWidth: 23, halign: "right" },
          6: { cellWidth: 20, halign: "right" },
          7: { cellWidth: 18, halign: "right" },
          8: { cellWidth: 15, halign: "center" },
          9: { cellWidth: 20, halign: "right" },
          10: { cellWidth: 20, halign: "center" },
          11: { cellWidth: 23, halign: "right" },
          12: { cellWidth: 23, halign: "right" },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 32, left: 28, right: 14 },
      });

      doc.save(`Summary_ISR_Report_${new Date().getTime()}.pdf`);
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error generating PDF");
    }
  };

  const handleSummaryISRReportExcel = async () => {
    const loadingToast = toast.loading("Generating Excel...");
    try {
      const data =
        summaryISRReport.length > 0
          ? summaryISRReport
          : await Summary_ISR_By_Period();

      if (!data || data.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("No data available for the report");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(data);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Summary ISR Report");

      XLSX.writeFile(wb, `Summary_ISR_Report_${new Date().getTime()}.xlsx`);
      toast.dismiss(loadingToast);
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error generating Excel");
    }
  };

  return (
    <div>
      <NavDesktop />
      <div className="reports-main-container">
        <h2 style={{ marginTop: "2rem" }}>View Reports</h2>
        <label htmlFor="">You can view all reports here.</label>
        <hr />

        <div className="reports-container">
          <Card className="report-card">
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#1976d2",
                }}
              >
                <AssessmentIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Payroll Summary
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Generate a comprehensive summary of all payroll calculations for
                a specific period, including totals and breakdowns.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
              <Button
                onClick={handleGeneralReportPDF}
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
              >
                PDF
              </Button>
              <Button
                onClick={handleGeneralReportExcel}
                size="small"
                variant="outlined"
                startIcon={<DescriptionIcon />}
              >
                Excel
              </Button>
            </CardActions>
          </Card>

          <Card className="report-card">
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#2e7d32",
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Summary ISR By Period
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Detailed report of income tax (ISR) withheld for employees
                during a specific payroll period.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
              <Button
                onClick={handleSummaryISRReportPDF}
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
              >
                PDF
              </Button>
              <Button
                onClick={handleSummaryISRReportExcel}
                size="small"
                variant="outlined"
                startIcon={<DescriptionIcon />}
              >
                Excel
              </Button>
            </CardActions>
          </Card>

          <Card className="report-card">
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#ed6c02",
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Tax Withholding (En proceso)
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Complete overview of tax withholdings, including federal and
                social security contributions for all employees.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
              >
                PDF
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DescriptionIcon />}
              >
                Excel
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
