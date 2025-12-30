"use client";
import { useState } from "react";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/Employees/Employees.scss";
import EmployeesTable from "../DataTables/Employees";
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

const Employees = () => {
  const session = useSession();
  const Router = useRouter();

  const [showEmployeeAddition, setShowEmployeeAddition] = useState(false);
  const [showUserActions, setShowUserActions] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filtro, setFiltro] = useState({
    Status: "",
    Department: "",
    EmployeeType: "",
    JobPosition: "",
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
        </div>
        <div className="exportarPDF">
          <button onClick={handleExportarPDF}>Export to PDF</button>
        </div>
        <hr />

        <div className="filtros">
          <div>
            <select
              value={filtro.Status}
              onChange={(e) => setFiltro({ ...filtro, Status: e.target.value })}
              name="filtroDeStatus"
              id=""
            >
              <option value="">All Statuses</option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </select>
          </div>
          <div>
            <select
              onChange={(e) =>
                setFiltro({ ...filtro, Department: e.target.value })
              }
              name="filtroDeDepartamento"
              id=""
              value={filtro.Department}
            >
              {" "}
              <option value="">All Departments</option>
              {departmentDetails.map((department: any) => (
                <option
                  key={department.Id_Department}
                  value={department.Id_Department}
                >
                  {department.Description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              onChange={(e) =>
                setFiltro({ ...filtro, EmployeeType: e.target.value })
              }
              name="filtroDeTipoDeEmpleado"
              id="EmployeeType"
              value={filtro.EmployeeType}
            >
              {" "}
              <option value="">All Employee Types</option>
              {employeeTypesDetails.map((employeeType: any) => (
                <option
                  key={employeeType.Id_Employee_type}
                  value={employeeType.Id_Employee_type}
                >
                  {employeeType.Description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              onChange={(e) =>
                setFiltro({ ...filtro, JobPosition: e.target.value })
              }
              name="filtroDePuesto"
              id=""
              value={filtro.JobPosition}
            >
              <option value="">All Jobs</option>
              {jobPositionsDetails.map((jobPosition: any) => (
                <option key={jobPosition.Id_Job} value={jobPosition.Id_Job}>
                  {jobPosition.Description}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleFiltroInformacion}>Filtrar informacion</button>
        </div>
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
          onAddEmployee={handleNewEmployee}
        />
      </div>
    </div>
  );
};

export default Employees;
