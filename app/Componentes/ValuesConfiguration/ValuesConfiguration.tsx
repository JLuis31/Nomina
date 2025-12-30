"use client";

import "../ValuesConfiguration/ValuesConfiguration.scss";

import NavDesktop from "../NavDesktop/NavDesktop";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import TablesToConfigure from "./TablesToConfigure/TablesToConfigure";
import { AnimatePresence } from "framer-motion";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import DeduccionesTable from "../DataTables/Deductions_Incomes";

import { useSession } from "next-auth/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import GeneralTable from "../DataTables/GeneralTable";

const ValuesConfiguration = () => {
  const session = useSession();
  const Router = useRouter();

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
    deduccionesDetails,
    setDeduccionesDetails,
    statesDetails,
    setStatesDetails,
    cityDetails,
    setCityDetails,
  } = useUsersDetails();

  const [showItemAddition, setShowItemAddition] = useState(false);
  const [catalog, setCatalog] = useState({ value: 1 });
  const handleDelete = async ({ id, description }) => {
    try {
      const response = await axios.delete("/api/UsersDetails", {
        params: { idUser: id, description: description },
      });

      if (response.status === 200) {
        switch (response.data.department) {
          case "Departments":
            setDepartmentDetails(
              departmentDetails.filter((dep: any) => dep.Id_Department !== id)
            );
            break;
          case "Employee Types":
            console.log(employeeTypesDetails);
            setEmployeeTypesDetails(
              employeeTypesDetails.filter(
                (emp: any) => emp.Id_Employee_type !== id
              )
            );
            break;
          case "Job Positions":
            setJobPositionsDetails(
              jobPositionsDetails.filter((job: any) => job.Id_Job !== id)
            );
            break;
          case "Pay Frequency":
            setPayFrequencyDetails(
              payFrequencyDetails.filter(
                (pay: any) => pay.Id_PayFrequency !== id
              )
            );
            break;
          case "States":
            setStatesDetails(
              statesDetails.filter((state: any) => state.Id_State !== id)
            );
            break;
          case "Cities":
            setCityDetails(
              cityDetails.filter((city: any) => city.Id_City !== id)
            );
            break;
          case "Deductions":
            setDeduccionesDetails(
              deduccionesDetails.filter(
                (deduccion: any) => deduccion.Id_Concept !== id
              )
            );
            break;
        }

        toast.success("Item deleted successfully", { duration: 2000 });
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

  if (session.status === "loading") {
    return (
      <div className="loading-container">
        <ClipLoader size={100} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    Router.push("/api/auth/signin");
    return null;
  }

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
        <div className="buttons-container">
          <div>
            <h2>Values Configuration</h2>
            <label className="configuracionValoresLabel" htmlFor="">
              Catalogs Configuration
            </label>
          </div>
          <button onClick={() => handleEditTable()} className="edit">
            Add Item
          </button>{" "}
        </div>
        <hr />

        <div className="edicion-valores"> </div>
        <div className="table-container">
          <div className="selects">
            <div>
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
            </div>

            <div>
              <label className="currency-selector" htmlFor="selectCatalog">
                Select Catalog
              </label>
              <select
                onChange={(e) => setCatalog({ value: Number(e.target.value) })}
                name="selectCatalog"
                id="selectCatalog"
              >
                <option value={1}>Departments</option>
                <option value={2}>Employee Types</option>
                <option value={3}>Job Positions</option>
                <option value={4}>Payment Frequency</option>
                <option value={5}>Incomes / Deductions</option>
                <option value={6}>States</option>
                <option value={7}>Cities</option>
              </select>
            </div>
          </div>
          <div className="data-tables-container ">
            {catalog.value !== 5 && (
              <GeneralTable
                departmentDetails={departmentDetails}
                employeeTypesDetails={employeeTypesDetails}
                jobPositionsDetails={jobPositionsDetails}
                payFrequencyDetails={payFrequencyDetails}
                statesDetails={statesDetails}
                cityDetails={cityDetails}
                selectedCatalog={catalog}
                handleDelete={handleDelete}
              />
            )}

            {catalog.value === 5 && (
              <DeduccionesTable
                deduccionesDetails={deduccionesDetails}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesConfiguration;
