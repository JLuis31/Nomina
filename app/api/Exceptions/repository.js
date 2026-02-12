import { prisma } from "@/lib/prisma";

export async function findEmployeeException(employeeId, conceptId) {
  return prisma.Employee_Exceptions.findFirst({
    where: {
      Id_Employee: employeeId,
      Id_Concept: conceptId,
    },
  });
}

export async function deletePayrollDetail(employeeId, conceptId) {
  return prisma.Payroll_Detail.deleteMany({
    where: {
      Id_Employee: employeeId,
      Id_Concept: conceptId,
    },
  });
}

export async function createEmployeeException(data) {
  return prisma.Employee_Exceptions.create({ data });
}

export async function findEmployeeExceptionsByPayFrequency(payFrequencyId) {
  return prisma.Employee_Exceptions.findMany({
    where: { Id_PayFrequency: payFrequencyId },
  });
}

export async function deleteEmployeeExceptionById(idException) {
  return prisma.Employee_Exceptions.delete({
    where: { Id_Movement: idException },
  });
}
