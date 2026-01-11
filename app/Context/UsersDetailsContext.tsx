"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const UsersDetailsContext = createContext({} as any);

export const UsersDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [employeeTypesDetails, setEmployeeTypesDetails] = useState([]);
  const [jobPositionsDetails, setJobPositionsDetails] = useState([]);
  const [payFrequencyDetails, setPayFrequencyDetails] = useState([]);
  const [deduccionesDetails, setDeduccionesDetails] = useState([]);
  const [empleadosDetails, setEmpleadosDetails] = useState([]);
  const [statesDetails, setStatesDetails] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [defaultConceptsDetails, setDefaultConceptsDetails] = useState([]);
  const [valorMoneda, setValorMoneda] = useState();
  const [valorUSDToMXN, setValorUSDToMXN] = useState(0);

  useEffect(() => {
    const valorDelDolar = async () => {
      const response = await axios.get("https://open.er-api.com/v6/latest/USD");
      const valorUSDToMXN = response.data.rates.MXN;
      setValorUSDToMXN(valorUSDToMXN);
    };
    const paymentFrquency = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/PayFrequency");
        const data = response.data;
        setPayFrequencyDetails(data);
      } catch (error) {
        console.error("Error fetching Pay Frequency Details:", error);
      }
    };

    const departmentsDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Departments");
        const data = response.data;
        setDepartmentDetails(data);
      } catch (error) {
        console.error("Error fetching Departments Details:", error);
      }
    };

    const employeeTypesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/EmployeeTypes");
        const data = response.data;
        setEmployeeTypesDetails(data);
      } catch (error) {
        console.error("Error fetching Employee Types Details:", error);
      }
    };

    const jobPositionsDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/JobPositions");
        const data = response.data;
        setJobPositionsDetails(data);
      } catch (error) {
        console.error("Error fetching Job Positions Details:", error);
      }
    };

    const deduccionesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Deducciones");
        const data = response.data;
        setDeduccionesDetails(data);
      } catch (error) {
        console.error("Error fetching Deducciones Details:", error);
      }
    };

    const empleadosDetails = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/EmployeesDetails"
        );
        const data = response.data;
        setEmpleadosDetails(data);
      } catch (error) {
        console.error("Error fetching Empleados Details:", error);
      }
    };

    const statesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/States");
        const data = response.data;
        setStatesDetails(data);
      } catch (error) {
        console.error("Error fetching States Details:", error);
      }
    };
    const cityDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Cities");
        const data = response.data;
        setCityDetails(data);
      } catch (error) {
        console.error("Error fetching City Details:", error);
      }
    };

    const DefaultConceptsDetails = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts"
        );
        const data = response.data;
        setDefaultConceptsDetails(data);
      } catch (error) {
        console.error("Error fetching Default Concepts Details:", error);
      }
    };

    departmentsDetails();
    employeeTypesDetails();
    jobPositionsDetails();
    valorDelDolar();
    paymentFrquency();
    deduccionesDetails();
    empleadosDetails();
    statesDetails();
    cityDetails();
    DefaultConceptsDetails();
  }, []);

  const reloadEmpleadosDetails = async () => {
    try {
      const response = await axios.get("/api/CatalogsDetails/EmployeesDetails");
      setEmpleadosDetails(response.data);
    } catch (error) {
      console.error("Error fetching Empleados Details:", error);
    }
  };
  return (
    <UsersDetailsContext.Provider
      value={{
        departmentDetails,
        setDepartmentDetails,
        employeeTypesDetails,
        setEmployeeTypesDetails,
        jobPositionsDetails,
        setJobPositionsDetails,
        valorMoneda,
        setValorMoneda,
        valorUSDToMXN,
        payFrequencyDetails,
        setPayFrequencyDetails,
        deduccionesDetails,
        setDeduccionesDetails,
        empleadosDetails,
        setEmpleadosDetails,
        reloadEmpleadosDetails,
        statesDetails,
        cityDetails,
        setStatesDetails,
        setCityDetails,
        defaultConceptsDetails,
        setDefaultConceptsDetails,
      }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
