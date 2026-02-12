import {
  findEmployeeByEmail,
  findEmployeeByPhone,
  findEmployeeByCurp,
  findEmployeeByRfc,
  createEmployee,
  getAllEmployees,
  deleteEmployeeById,
  findEmployeesByFilters,
  findEmployeeById,
  findEmployeeByBankAccount,
  updateEmployee,
} from "./repository";

export async function addEmployee(data) {
  const formatedData = {
    ...data,
    salary: data.salary,
    status:
      data.status === "Active" ? "1" : data.status === "Inactive" ? "2" : null,
  };

  if (await findEmployeeByRfc(formatedData.rfc)) {
    return { message: "Employee with given RFC already exists", status: 409 };
  }
  if (await findEmployeeByCurp(formatedData.curp)) {
    return { message: "Employee with given CURP already exists", status: 409 };
  }
  if (await findEmployeeByEmail(formatedData.email)) {
    return { message: "Employee with given email already exists", status: 409 };
  }
  if (await findEmployeeByPhone(formatedData.phone)) {
    return {
      message: "Employee with given phone number already exists",
      status: 409,
    };
  }

  await createEmployee({
    Name: formatedData.name.trim(),
    First_SurName: formatedData.firstSurname.trim(),
    Second_Surname: formatedData.secondSurname.trim(),
    Email: formatedData.email,
    Phone_Number: formatedData.phone,
    Address: formatedData.address,
    Id_State: Number(formatedData.State),
    Id_City: Number(formatedData.City),
    Id_Job: Number(formatedData.jobTitle),
    Id_Department: Number(formatedData.department),
    Id_Employee_type: Number(formatedData.employeeType),
    Start_Date: new Date(formatedData.startDate),
    Salary: parseFloat(formatedData.salary),
    Status: formatedData.status,
    Curp: formatedData.curp,
    RFC: formatedData.rfc,
    BankAccountNumber: "",
    Id_PayFrequency: 0,
  });

  return { message: "Employee added successfully", status: 201 };
}

export async function fetchEmployees() {
  const response = await getAllEmployees();
  if (response.length === 0) {
    return { message: "No employees found", status: 404 };
  }
  return { data: response, status: 201 };
}

export async function removeEmployee(id) {
  await deleteEmployeeById(id);
  return { message: "Employee deleted successfully", status: 200 };
}

export async function getFilteredEmployees({
  status,
  department,
  employeeType,
  jobPosition,
}) {
  let filters = {};
  if (department) filters.Id_Department = parseInt(department);
  if (employeeType) filters.Id_Employee_type = parseInt(employeeType);
  if (jobPosition) filters.Id_Job = parseInt(jobPosition);
  if (status) filters.Status = status;
  return findEmployeesByFilters(filters);
}

export async function getEmployee(idEmployee) {
  return findEmployeeById(idEmployee);
}

export async function updateEmployeeService(Id_Employee, UserData) {
  if (UserData.bankAccountNumber && UserData.bankAccountNumber.trim() !== "") {
    const existingBancAccountNumber = await findEmployeeByBankAccount(
      UserData.bankAccountNumber,
      Id_Employee,
    );
    if (existingBancAccountNumber) {
      return { message: "Bank account number already exists", status: 409 };
    }
  }
  await updateEmployee(Id_Employee, {
    Name: UserData.name.trim(),
    First_SurName: UserData.firstSurname.trim(),
    Second_Surname: UserData.secondSurname.trim(),
    Curp: UserData.curp,
    RFC: UserData.rfc,
    Email: UserData.email,
    Phone_Number: UserData.phone,
    Address: UserData.address,
    Id_State: Number(UserData.State),
    Id_City: Number(UserData.City),
    Id_Job: Number(UserData.jobTitle),
    Id_Department: Number(UserData.department),
    Id_Employee_type: Number(UserData.employeeType),
    Salary:
      typeof UserData.salary === "string"
        ? parseFloat(UserData.salary.replace(/[^0-9.,]/g, ""))
        : Number(UserData.salary),
    Status:
      UserData.employeeStatus === "Active"
        ? "1"
        : UserData.employeeStatus === "Inactive"
          ? "2"
          : UserData.employeeStatus,
    Id_PayFrequency: Number(UserData.payFrequency),
    BankAccountNumber: UserData.bankAccountNumber,
  });
  return { message: "Employee updated successfully", status: 200 };
}
