"use client";
import { useState } from "react";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/Employees/Employees.scss";
import EmployeesTable from "../DataTables/Employees";
import EmployeeAdition from "../EmployeeAdition/EmployeeAdition";
import { AnimatePresence } from "framer-motion";
import UserActions from "../UserActions/UserActions";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

const Employees = () => {
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
  const { departmentDetails, employeeTypesDetails, jobPositionsDetails } =
    useUsersDetails();

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
    console.log(selectedEmployee);
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
        doc.text(String(emp.Salary || emp.salary || ""), 155, y);
        let statusText = "";
        if (emp.Status === "1" || emp.status === "1") statusText = "Active";
        else if (emp.Status === "2" || emp.status === "2")
          statusText = "Inactive";
        else if (emp.Status === "3" || emp.status === "3")
          statusText = "On Leave";
        else if (emp.Status === "4" || emp.status === "4")
          statusText = "In Process";
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
          <h2>Employee Management</h2>
          <div className="btns">
            {" "}
            <button className="exportarPDF" onClick={handleExportarPDF}>
              Export PDF
            </button>
            <button className="exportarExcel">Export Excel</button>
          </div>
        </div>

        <div className="filtros">
          <div>
            <select
              value={filtro.Status}
              onChange={(e) => setFiltro({ ...filtro, Status: e.target.value })}
              name="filtroDeStatus"
              id=""
            >
              <option value="" disabled>
                Filter by Status
              </option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
              <option value="3">On Leave</option>
              <option value="4">In Process</option>
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
              <option value="" disabled>
                Filter by Department
              </option>
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
              <option value="" disabled>
                Filter by Employee Type
              </option>
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
              <option value="" disabled>
                Filter by Job
              </option>
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
