import { prisma } from "@/lib/prisma";

export async function getAllCalendars() {
  return prisma.Payroll.findMany();
}

export async function findOverlappingPeriod(where) {
  return prisma.Payroll.findFirst({ where });
}

export async function findCalendarByPK(pk) {
  return prisma.Payroll.findUnique({
    where: { Year_Id_PayFrequency_Id_Period: pk },
  });
}

export async function updateCalendar(pk, data) {
  return prisma.Payroll.update({
    where: { Year_Id_PayFrequency_Id_Period: pk },
    data,
  });
}

export async function createCalendar(data) {
  return prisma.Payroll.create({ data });
}

export async function deleteCalendar(pk) {
  return prisma.Payroll.delete({
    where: { Year_Id_PayFrequency_Id_Period: pk },
  });
}

export async function findPeriodsByPayFrequencyAndYear(payFrequencyId, year) {
  return prisma.Payroll.findMany({
    select: {
      Id_Period: true,
      Period_Start: true,
      Period_End: true,
    },
    where: {
      Id_PayFrequency: payFrequencyId,
      Year: year,
    },
  });
}
