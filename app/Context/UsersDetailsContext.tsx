"use client";
import { createContext, useContext, useState, useEffect, use } from "react";

const UsersDetailsContext = createContext({} as any);

export const UsersDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [departmentDetails, setDepartmentDetails] = useState({});
  const [employeeTypesDetails, setEmployeeTypesDetails] = useState({});
  const [jobPositionsDetails, setJobPositionsDetails] = useState({});

  useEffect(() => {
    const departmentsDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/Departments");
        console.log("Response:", response);
        const data = await response.json();
        setDepartmentDetails(data);
      } catch (error) {
        console.error("Error fetching Departments Details:", error);
      }
    };

    const employeeTypesDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/EmployeeTypes");
        console.log("Response:", response);
        const data = await response.json();
        setEmployeeTypesDetails(data);
      } catch (error) {
        console.error("Error fetching Employee Types Details:", error);
      }
    };

    const jobPositionsDetails = async () => {
      try {
        const response = await fetch("/api/UsersDetails/JobPositions");
        console.log("Response:", response);
        const data = await response.json();
        setJobPositionsDetails(data);
      } catch (error) {
        console.error("Error fetching Job Positions Details:", error);
      }
    };
    departmentsDetails();
    employeeTypesDetails();
    jobPositionsDetails();
  }, []);
  return (
    <UsersDetailsContext.Provider
      value={{ departmentDetails, employeeTypesDetails, jobPositionsDetails }}
    >
      {children}
    </UsersDetailsContext.Provider>
  );
};

export const useUsersDetails = () => useContext(UsersDetailsContext);
