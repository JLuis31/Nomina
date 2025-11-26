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
  const [payFrequencyDetails, setPayFrequencyDetails] = useState([]);
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
    departmentsDetails();
    employeeTypesDetails();
    jobPositionsDetails();
    valorDelDolar();
    paymentFrquency();
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
        payFrequencyDetails,
        setPayFrequencyDetails,
      }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
