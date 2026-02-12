"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const UsersDetailsContext = createContext({} as any);
import { useSession } from "next-auth/react";

export const UsersDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useSession();
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
  const [umaValues, setUMAValues] = useState([]);
  const [valorUSDToMXN, setValorUSDToMXN] = useState(0);
  const [lastPayrollPeriod, setLastPayrollPeriod] = useState();

  useEffect(() => {
    if (!data?.user) return;
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
        toast.error("Error fetching Pay Frequency Details: " + error);
      }
    };

    const departmentsDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Departments");
        const data = response.data;
        setDepartmentDetails(data);
      } catch (error) {
        toast.error("Error fetching Departments Details: " + error);
      }
    };

    const employeeTypesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/EmployeeTypes");
        const data = response.data;
        setEmployeeTypesDetails(data);
      } catch (error) {
        toast.error("Error fetching Employee Types Details: " + error);
      }
    };

    const jobPositionsDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/JobPositions");
        const data = response.data;
        setJobPositionsDetails(data);
      } catch (error) {
        toast.error("Error fetching Job Positions Details: " + error);
      }
    };

    const deduccionesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Deducciones");
        const data = response.data;
        setDeduccionesDetails(data);
      } catch (error) {
        toast.error("Error fetching Deducciones Details: " + error);
      }
    };

    const empleadosDetails = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/EmployeesDetails",
        );
        const data = response.data;
        setEmpleadosDetails(data);
      } catch (error) {
        toast.error("Error fetching Empleados Details: " + error);
      }
    };

    const statesDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/States");
        const data = response.data;
        setStatesDetails(data);
      } catch (error) {
        toast.error("Error fetching States Details: " + error);
      }
    };

    const cityDetails = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/Cities");
        const data = response.data;
        setCityDetails(data);
      } catch (error) {
        toast.error("Error fetching City Details: " + error);
      }
    };

    const DefaultConceptsDetails = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts",
        );
        const data = response.data;
        setDefaultConceptsDetails(data);
      } catch (error) {
        toast.error("Error fetching Default Concepts Details: " + error);
      }
    };

    const UMAValues = async () => {
      try {
        const response = await axios.get("/api/CatalogsDetails/UMA_Values");
        const data = response.data;

        setUMAValues(data);
      } catch (error) {
        toast.error("Error fetching UMA Values: " + error);
      }
    };

    const getLastPayrollPeriod = async () => {
      try {
        const response = await axios.get(
          "/api/PayrollCalculation/LastPayrollCalculated",
        );
        setLastPayrollPeriod(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            "Error fetching Last Payroll Period: " + error.response?.data,
          );
        }
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
    UMAValues();
    getLastPayrollPeriod();
  }, [data?.user]);

  const reloadEmpleadosDetails = async () => {
    if (!data?.user) return;
    try {
      const response = await axios.get("/api/CatalogsDetails/EmployeesDetails");
      setEmpleadosDetails(response.data);
    } catch (error) {
      toast.error("Error fetching Empleados Details: " + error);
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
        umaValues,
        setUMAValues,
        lastPayrollPeriod,
      }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
