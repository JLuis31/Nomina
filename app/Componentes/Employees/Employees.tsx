"use client";
import { useState } from "react";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/Employees/Employees.scss";
import EmployeesTable from "../DataTables/Employees";
import EmployeeAdition from "../EmployeeAdition/EmployeeAdition";
import { AnimatePresence } from "framer-motion";
import UserActions from "../UserActions/UserActions";

const Employees = () => {
  const [showEmployeeAddition, setShowEmployeeAddition] = useState(false);
  const [showUserActions, setShowUserActions] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  return (
    <div>
      <NavDesktop />

      <div className="employees-container">
        <div className="employee-button">
          <h2>Employee Management</h2>
          <button onClick={handleNewEmployee}>Add Employee</button>
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
        />
      </div>
    </div>
  );
};

export default Employees;
