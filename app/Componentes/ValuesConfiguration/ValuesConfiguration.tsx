"use client";

import "../ValuesConfiguration/ValuesConfiguration.scss";

import NavDesktop from "../NavDesktop/NavDesktop";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import DeduccionesTable from "../DataTables/Deductions_Incomes/Deductions_Incomes";
import { useSession } from "next-auth/react";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import GeneralTable from "../DataTables/GeneralTable/GeneralTable";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import ItemsAddition from "./ItemsAddition/ItemsAddition";
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
    defaultConceptsDetails,
    setDefaultConceptsDetails,
  } = useUsersDetails();

  const [showItemAddition, setShowItemAddition] = useState(false);
  const [catalog, setCatalog] = useState({ value: 1 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowItemAddition(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = async ({ id, description }) => {
    try {
      const response = await axios.delete("/api/CatalogsDetails", {
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
          case "Default Concepts":
            setDefaultConceptsDetails(
              defaultConceptsDetails.filter(
                (concept: any) => concept.Id_Default_Concept !== id
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
            <ItemsAddition cancelData={datoRecibidoCancel} catalog={catalog} />
          </div>
        )}
      </AnimatePresence>
      <div className="configuration-Container">
        <div className="btn-header-container">
          {" "}
          <div className="valuesConfigurationHeader">
            <div>
              <h2>Values Configuration</h2>
              <label className="configuracionValoresLabel" htmlFor="">
                Catalogs Configuration
              </label>
            </div>
          </div>
        </div>
        <hr />

        <div className="edicion-valores"> </div>
        <div className="table-container">
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Currency</InputLabel>
              <Select
                value={valorMoedaLocalStorage}
                onChange={(e) => configurarDivisa(e.target.value)}
                label="Select Currency"
              >
                <MenuItem value="MXN">MXN</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Select Catalog</InputLabel>
              <Select
                value={catalog.value}
                onChange={(e) => setCatalog({ value: Number(e.target.value) })}
                label="Select Catalog"
              >
                <MenuItem value={1}>Departments</MenuItem>
                <MenuItem value={2}>Employee Types</MenuItem>
                <MenuItem value={3}>Job Positions</MenuItem>
                <MenuItem value={4}>Payment Frequency</MenuItem>
                <MenuItem value={5}>Payment Concepts</MenuItem>
                <MenuItem value={6}>States</MenuItem>
                <MenuItem value={7}>Cities</MenuItem>
                <MenuItem value={8}>Default Concepts</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <div className="data-tables-container ">
            {catalog.value !== 5 && (
              <GeneralTable
                departmentDetails={departmentDetails}
                employeeTypesDetails={employeeTypesDetails}
                jobPositionsDetails={jobPositionsDetails}
                payFrequencyDetails={payFrequencyDetails}
                statesDetails={statesDetails}
                cityDetails={cityDetails}
                defaultConceptsDetails={defaultConceptsDetails}
                selectedCatalog={catalog}
                handleDelete={handleDelete}
                onAddItem={handleEditTable}
              />
            )}

            {catalog.value === 5 && (
              <DeduccionesTable
                deduccionesDetails={deduccionesDetails}
                handleDelete={handleDelete}
                onAddItem={handleEditTable}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesConfiguration;
