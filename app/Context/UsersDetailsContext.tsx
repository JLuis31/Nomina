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
        const response = await axios.get("/api/UsersDetails/PayFrequency");
        const data = response.data;
        setPayFrequencyDetails(data);
      } catch (error) {
        console.error("Error fetching Pay Frequency Details:", error);
      }
    };

    const departmentsDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/Departments");
        const data = response.data;
        setDepartmentDetails(data);
      } catch (error) {
        console.error("Error fetching Departments Details:", error);
      }
    };

    const employeeTypesDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/EmployeeTypes");
        const data = response.data;
        setEmployeeTypesDetails(data);
      } catch (error) {
        console.error("Error fetching Employee Types Details:", error);
      }
    };

    const jobPositionsDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/JobPositions");
        const data = response.data;
        setJobPositionsDetails(data);
      } catch (error) {
        console.error("Error fetching Job Positions Details:", error);
      }
    };

    const deduccionesDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/Deducciones");
        const data = response.data;
        setDeduccionesDetails(data);
      } catch (error) {
        console.error("Error fetching Deducciones Details:", error);
      }
    };

    const empleadosDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/EmployeesDetails");
        const data = response.data;
        console.log("Fetched Empleados Details:", data);
        setEmpleadosDetails(data);
      } catch (error) {
        console.error("Error fetching Empleados Details:", error);
      }
    };

    const statesDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/States");
        console.log("Fetched States Details:", response.data);
        const data = response.data;
        setStatesDetails(data);
      } catch (error) {
        console.error("Error fetching States Details:", error);
      }
    };
    const cityDetails = async () => {
      try {
        const response = await axios.get("/api/UsersDetails/Cities");
        console.log("Fetched City Details:", response.data);
        const data = response.data;
        setCityDetails(data);
      } catch (error) {
        console.error("Error fetching City Details:", error);
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
  }, []);

  const reloadEmpleadosDetails = async () => {
    try {
      const response = await axios.get("/api/UsersDetails/EmployeesDetails");
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
      }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
