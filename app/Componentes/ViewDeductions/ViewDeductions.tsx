"use client";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/ViewDeductions/ViewDeductions.scss";

const ViewDeductions = () => {
  return (
    <div>
      <NavDesktop />
      <div className="view-deductions-container">
        <h2>Add New Deduction or Income</h2>
        <p className="descr">Create and configure a new deduction or income</p>
        <hr />
      </div>
    </div>
  );
};

export default ViewDeductions;
