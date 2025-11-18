"use client";

import "../ValuesConfiguration/ValuesConfiguration.scss";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import DepartmentsTable from "../DataTables/Departments";
import EmployeeTypeTable from "../DataTables/EmployeeType";
import NavDesktop from "../NavDesktop/NavDesktop";
import JobsTable from "../DataTables/Jobs";
import axios from "axios";
import toast from "react-hot-toast";
import { use, useState } from "react";

const ValuesConfiguration = () => {
  const { departmentDetails, employeeTypesDetails, jobPositionsDetails } =
    useUsersDetails();
  const [selectedTable, setSelectedTable] = useState("Department");

  const handleDelete = async ({ id, description }) => {
    console.log("Delete item with id:", id, "and description:", description);
    try {
      const response = await axios.delete("/api/UsersDetails", {
        params: { idUser: id, description: description },
      });

      if (response.status === 200) {
        window.location.reload();
        setTimeout(() => {
          toast.success("Item deleted successfully");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error deleting item: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleEditTable = () => {
    console.log("Edit table:", selectedTable);
  };

  return (
    <div>
      <NavDesktop />
      <div className="configuration-Container">
        <h2>Configuacion de valores</h2>
        <div className="edicion-valores">
          {" "}
          <select
            onChange={(e) => setSelectedTable(e.target.value)}
            name="edit"
            id=""
          >
            <option value="Department">Department</option>
            <option value="Employee Type">Employee Type</option>
            <option value="Job Positions">Job Positions</option>
          </select>
          <button onClick={handleEditTable} className="edit">
            Edit
          </button>
        </div>
        <div className="table-container">
          <DepartmentsTable
            departmentDetails={departmentDetails}
            handleDelete={handleDelete}
          />
          <EmployeeTypeTable
            employeeTypesDetails={employeeTypesDetails}
            handleDelete={handleDelete}
          />
          <JobsTable
            jobPositionsDetails={jobPositionsDetails}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ValuesConfiguration;
