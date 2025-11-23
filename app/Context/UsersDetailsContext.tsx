"use client";
import { createContext, useContext, useState, useEffect, use } from "react";
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
  const [valorMoneda, setValorMoneda] = useState();
  const [valorUSDToMXN, setValorUSDToMXN] = useState(0);

  useEffect(() => {
    const valorDelDolar = async () => {
      const response = await axios.get("https://open.er-api.com/v6/latest/USD");
      const valorUSDToMXN = response.data.rates.MXN;
      console.log("Valor actual del USD a MXN:", valorUSDToMXN);
      setValorUSDToMXN(valorUSDToMXN);
    };

    const departmentsDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/Departments");
        const data = await response.json();
        setDepartmentDetails(data);
      } catch (error) {
        console.error("Error fetching Departments Details:", error);
      }
    };

    const employeeTypesDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/EmployeeTypes");
        const data = await response.json();
        setEmployeeTypesDetails(data);
      } catch (error) {
        console.error("Error fetching Employee Types Details:", error);
      }
    };

    const jobPositionsDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/JobPositions");
        const data = await response.json();
        setJobPositionsDetails(data);
      } catch (error) {
        console.error("Error fetching Job Positions Details:", error);
      }
    };
    departmentsDetails();
    employeeTypesDetails();
    jobPositionsDetails();
    valorDelDolar();
  }, []);
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
      }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
