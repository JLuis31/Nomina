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

  const handleNewEmployee = () => {
    setShowEmployeeAddition(true);
  };

  const datoRecibido = (dato: boolean) => {
    setShowEmployeeAddition(dato);
  };

  const handleUserActions = (dato: boolean) => {
    console.log("Dato recibido en Employees:", dato);
    setShowUserActions(dato);
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
              <EmployeeAdition cancelData={datoRecibido} />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showUserActions === true && (
            <div className="overlay">
              <UserActions cancelData={handleUserActions} />
            </div>
          )}
        </AnimatePresence>
        <EmployeesTable onActions={handleUserActions} />
      </div>
    </div>
  );
};

export default Employees;
