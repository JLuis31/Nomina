"use client";
import { useState, useEffect } from "react";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/Employees/Employees.scss";
import EmployeesTable from "../DataTables/Employees/Employees";
import EmployeeAdition from "./EmployeeAdition/EmployeeAdition";
import { AnimatePresence } from "framer-motion";
import UserActions from "./EmployeeUpdate/EmployeeUpdate";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  Divider,
  Collapse,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Employees = () => {
  const session = useSession();
  const Router = useRouter();

  const [showEmployeeAddition, setShowEmployeeAddition] = useState(false);
  const [showUserActions, setShowUserActions] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtro, setFiltro] = useState({
    Status: "",
    Department: "",
    EmployeeType: "",
    JobPosition: "",
    SearchText: "",
  });
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [informacionFiltrada, setInformacionFiltrada] = useState([]);
  const {
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    valorUSDToMXN,
  } = useUsersDetails();
  const valorMonedaLocalStorage = localStorage.getItem("valorMoneda");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEmployeeAddition(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (session.status === "loading") {
    return (
      <div className="loading-container">
        <ClipLoader size={100} color={"#123abc"} loading={true} />
      </div>
    );
  }
  if (session.status === "unauthenticated") {
    Router.push("/Login");
    return null;
  }

  const handleNewEmployee = () => {
    setShowEmployeeAddition(true);
  };

  const datoRecibido = (dato: boolean) => {
    setShowEmployeeAddition(dato);
  };

  const handleUserActions = (dato: boolean) => {
    setShowUserActions(dato);
  };

  const handleActualizarTabla = (dato: boolean) => {
    setRefreshTable(dato);
  };

  const handleSelectedEmployee = (dato: any) => {
    setSelectedEmployee(dato);
  };

  const handleUpdateEmployee = () => {
    setRefreshTable((prev) => !prev);
    setShowUserActions(false);
  };

  const handleFiltroInformacion = async () => {
    setFiltroActivo(true);
    try {
      const response = await axios.get("/api/Employees/EmployeesFilters", {
        params: {
          status: filtro.Status,
          department: filtro.Department,
          employeeType: filtro.EmployeeType,
          jobPosition: filtro.JobPosition,
        },
      });
      setInformacionFiltrada(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error fetching filtered employees: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleClearFilters = () => {
    setFiltro({
      Status: "",
      Department: "",
      EmployeeType: "",
      JobPosition: "",
      SearchText: "",
    });
    setFiltroActivo(false);
    setInformacionFiltrada([]);
  };

  const handleExportarPDF = async () => {
    try {
      const response = await axios.get("/api/Employees/EmployeesFilters", {
        params: {
          status: filtro.Status,
          department: filtro.Department,
          employeeType: filtro.EmployeeType,
          jobPosition: filtro.JobPosition,
        },
      });
      const empleados = response.data;

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 180);
      doc.text("Reporte de Empleados", 10, 10);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 255);
      doc.text("Nombre", 10, 20);
      doc.text("Email", 50, 20);
      doc.text("Salario", 150, 20);
      doc.text("Status", 180, 20);

      doc.setDrawColor(0, 0, 0);
      doc.line(10, 22, 200, 22);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      let y = 30;
      empleados.forEach((emp) => {
        doc.text(emp.Name || emp.name || "", 10, y);
        doc.text(emp.Email || "", 50, y);
        doc.text(
          String(
            valorMonedaLocalStorage === "USD"
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(emp.Salary)
              : valorMonedaLocalStorage === "MXN"
              ? new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(emp.Salary * valorUSDToMXN)
              : null
          ),
          155,
          y
        );
        let statusText = "";
        if (emp.Status === "1" || emp.status === "1") statusText = "Active";
        else if (emp.Status === "2" || emp.status === "2")
          statusText = "Inactive";
        doc.text(statusText, 180, y);
        y += 10;
      });

      doc.save("empleados.pdf");
    } catch (error) {
      toast.error("Error al obtener empleados sin filtro");
    }
  };

  return (
    <div>
      <NavDesktop />

      <div className="employees-container">
        <div className="employee-button">
          <div>
            {" "}
            <h2>Employee Management</h2>
            <label className="employeeManagmentLabel" htmlFor="">
              Manage employees effectively
            </label>
          </div>
          <div className="exportarPDF">
            <button
              onClick={handleExportarPDF}
              style={{
                backgroundColor: "#345d8a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2a4a6e";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#345d8a";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Export to PDF
            </button>
          </div>
        </div>

        <hr />
        <div className="buscador">
          <div className="filtro">
            <label className="labelfiltrarpor" htmlFor="">
              Filter by
            </label>
            <input
              type="text"
              placeholder="Filter by name, job title or status"
              value={filtro.SearchText}
              onChange={(e) =>
                setFiltro({ ...filtro, SearchText: e.target.value })
              }
            />
          </div>
          <div className="botonesfiltro">
            <button
              onClick={handleNewEmployee}
              className="addEmployee"
              style={{
                backgroundColor: "#345d8a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2a4a6e";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#345d8a";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Add Employee
            </button>
          </div>
        </div>

        <Paper
          elevation={2}
          sx={{
            mb: 3,
            mt: 2,
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon sx={{ color: "#345d8a" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#345d8a" }}
              >
                Advanced Filters
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: "#345d8a" }}>
              {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={showFilters}>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filtro.Status}
                      onChange={(e) =>
                        setFiltro({ ...filtro, Status: e.target.value })
                      }
                      label="Status"
                      startAdornment={
                        <CheckCircleIcon
                          sx={{ mr: 1, fontSize: 20, color: "action.active" }}
                        />
                      }
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="2">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={filtro.Department}
                      onChange={(e) =>
                        setFiltro({ ...filtro, Department: e.target.value })
                      }
                      label="Department"
                      startAdornment={
                        <BusinessIcon
                          sx={{ mr: 1, fontSize: 20, color: "action.active" }}
                        />
                      }
                    >
                      <MenuItem value="">All Departments</MenuItem>
                      {departmentDetails.map((department: any) => (
                        <MenuItem
                          key={department.Id_Department}
                          value={department.Id_Department}
                        >
                          {department.Description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Employee Type</InputLabel>
                    <Select
                      value={filtro.EmployeeType}
                      onChange={(e) =>
                        setFiltro({ ...filtro, EmployeeType: e.target.value })
                      }
                      label="Employee Type"
                      startAdornment={
                        <CategoryIcon
                          sx={{ mr: 1, fontSize: 20, color: "action.active" }}
                        />
                      }
                    >
                      <MenuItem value="">All Employee Types</MenuItem>
                      {employeeTypesDetails.map((employeeType: any) => (
                        <MenuItem
                          key={employeeType.Id_Employee_type}
                          value={employeeType.Id_Employee_type}
                        >
                          {employeeType.Description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Job Position</InputLabel>
                    <Select
                      value={filtro.JobPosition}
                      onChange={(e) =>
                        setFiltro({ ...filtro, JobPosition: e.target.value })
                      }
                      label="Job Position"
                      startAdornment={
                        <WorkIcon
                          sx={{ mr: 1, fontSize: 20, color: "action.active" }}
                        />
                      }
                    >
                      <MenuItem value="">All Jobs</MenuItem>
                      {jobPositionsDetails.map((jobPosition: any) => (
                        <MenuItem
                          key={jobPosition.Id_Job}
                          value={jobPosition.Id_Job}
                        >
                          {jobPosition.Description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Button
                      onClick={handleClearFilters}
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      sx={{
                        borderColor: "#d32f2f",
                        color: "#d32f2f",
                        "&:hover": {
                          borderColor: "#b71c1c",
                          backgroundColor: "rgba(211, 47, 47, 0.04)",
                        },
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      onClick={handleFiltroInformacion}
                      variant="contained"
                      startIcon={<FilterListIcon />}
                      sx={{
                        backgroundColor: "#345d8a",
                        "&:hover": { backgroundColor: "#2a4a6e" },
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Paper>
        <AnimatePresence>
          {showEmployeeAddition === true && (
            <div className="overlay">
              <EmployeeAdition
                cancelData={datoRecibido}
                actualizarTabla={handleActualizarTabla}
              />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showUserActions === true && (
            <div className="overlay">
              <UserActions
                cancelData={handleUserActions}
                selectedEmployee={selectedEmployee}
                onUpdate={handleUpdateEmployee}
              />
            </div>
          )}
        </AnimatePresence>
        <EmployeesTable
          onActions={handleUserActions}
          refreshTable={refreshTable}
          selectedEmployee={handleSelectedEmployee}
          onUpdate={handleUpdateEmployee}
          filtro={informacionFiltrada}
          filtroActivo={filtroActivo}
          filterText={filtro.SearchText}
        />
      </div>
    </div>
  );
};

export default Employees;
