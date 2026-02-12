import { prisma } from "@/lib/prisma";

export async function createEmployeeMovement(data) {
  return prisma.Employees_Movements.create({ data });
}

export async function findOpenPayrolls(idPaymentFrequency, year) {
  return prisma.Payroll.findMany({
    where: {
      Id_PayFrequency: idPaymentFrequency,
      Year: year,
      Status: "Open",
    },
  });
}

export async function getAllEmployeeMovements() {
  return prisma.$queryRaw`EXEC get_All_Employee_Movements`;
}

export async function deleteEmployeeMovement(Id_Movement) {
  return prisma.Employees_Movements.delete({
    where: { Id_Movement },
  });
}
