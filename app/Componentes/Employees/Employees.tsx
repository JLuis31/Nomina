"use client";
import { useState } from "react";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/Employees/Employees.scss";

const Employees = () => {
  return (
    <div>
      <NavDesktop></NavDesktop>
      <div className="employees-container"></div>
    </div>
  );
};

export default Employees;
