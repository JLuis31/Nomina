"use client";

import "../ValuesConfiguration/ValuesConfiguration.scss";
import DepartmentsTable from "../DataTables/Departments";
import EmployeeTypeTable from "../DataTables/EmployeeType";
import NavDesktop from "../NavDesktop/NavDesktop";
import JobsTable from "../DataTables/Jobs";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import TablesToConfigure from "./TablesToConfigure/TablesToConfigure";
import { AnimatePresence } from "framer-motion";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import PayFrquency from "../DataTables/PayFrquency";

const ValuesConfiguration = () => {
  const {
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    setDepartmentDetails,
    setEmployeeTypesDetails,
    setJobPositionsDetails,
    setValorMoneda,
    payFrequencyDetails,
    setPayFrequencyDetails,
  } = useUsersDetails();
  const [showItemAddition, setShowItemAddition] = useState(false);
  const handleDelete = async ({ id, description }) => {
    console.log("Delete item with id:", id, "and description:", description);
    try {
      const response = await axios.delete("/api/UsersDetails", {
        params: { idUser: id, description: description },
      });

      if (response.status === 200) {
        const newDepartmentDetails = await axios.get(
          "/api/UsersDetails/Departments"
        );
        const newEmployeeTypesDetails = await axios.get(
          "/api/UsersDetails/EmployeeTypes"
        );
        const newJobPositionsDetails = await axios.get(
          "/api/UsersDetails/JobPositions"
        );
        const newPayFrequencyDetails = await axios.get(
          "/api/UsersDetails/PayFrequency"
        );
        setDepartmentDetails(newDepartmentDetails.data);
        setEmployeeTypesDetails(newEmployeeTypesDetails.data);
        setJobPositionsDetails(newJobPositionsDetails.data);
        setPayFrequencyDetails(newPayFrequencyDetails.data);

        toast.success("Item deleted successfully");
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

  const handleEditTable = async () => {
    setShowItemAddition(true);
  };

  const datoRecibidoCancel = (dato: boolean) => {
    setShowItemAddition(dato);
  };

  const configurarDivisa = (valor) => {
    setValorMoneda(valor);
    localStorage.setItem("valorMoneda", valor);
  };

  const valorMoedaLocalStorage = localStorage.getItem("valorMoneda") || "MXN";

  return (
    <div>
      <NavDesktop />
      <AnimatePresence>
        {showItemAddition === true && (
          <div className="overlay">
            <TablesToConfigure cancelData={datoRecibidoCancel} />
          </div>
        )}
      </AnimatePresence>
      <div className="configuration-Container">
        <h2>Configuacion de valores</h2>
        <div className="edicion-valores">
          {" "}
          <button onClick={() => handleEditTable()} className="edit">
            Edit
          </button>
        </div>
        <div className="table-container">
          <label className="currency-selector" htmlFor="SelectorDeDivisa">
            Select Currency
          </label>
          <select
            value={valorMoedaLocalStorage}
            onChange={(e) => configurarDivisa(e.target.value)}
            name="valorMoneda"
            id="SelectorDeDivisa"
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
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
          <PayFrquency
            payFrequencyDetails={payFrequencyDetails}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ValuesConfiguration;
