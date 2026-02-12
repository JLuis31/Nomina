import { prisma } from "@/lib/prisma";

export async function findEmployeeByEmail(email) {
  return prisma.Employees.findFirst({ where: { Email: email } });
}

export async function findEmployeeByPhone(phone) {
  return prisma.Employees.findFirst({ where: { Phone_Number: phone } });
}

export async function findEmployeeByCurp(curp) {
  return prisma.Employees.findFirst({ where: { Curp: curp } });
}

export async function findEmployeeByRfc(rfc) {
  return prisma.Employees.findFirst({ where: { RFC: rfc } });
}

export async function createEmployee(data) {
  return prisma.Employees.create({ data });
}

export async function getAllEmployees() {
  return prisma.Employees.findMany();
}

export async function deleteEmployeeById(id) {
  return prisma.Employees.delete({ where: { Id_Employee: Number(id) } });
}

export async function findEmployeesByFilters(filters) {
  return prisma.employees.findMany({ where: { ...filters } });
}

export async function findEmployeeById(id) {
  return prisma.Employees.findFirst({ where: { Id_Employee: Number(id) } });
}

export async function findEmployeeByBankAccount(bankAccountNumber, excludeId) {
  return prisma.Employees.findFirst({
    where: {
      BankAccountNumber: bankAccountNumber,
      NOT: { Id_Employee: Number(excludeId) },
    },
  });
}

export async function updateEmployee(id, data) {
  return prisma.Employees.update({
    where: { Id_Employee: Number(id) },
    data,
  });
}
