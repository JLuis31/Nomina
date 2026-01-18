import { prisma } from "@/lib/prisma";

export async function GET() {
  const totalEmployees = await prisma.Employees.count();
  const totalCost = await prisma.Employees.findMany({
    select: { Salary: true },
    where: {
      Status: "1",
    },
  });

  return new Response(
    JSON.stringify({
      totalEmployees: totalEmployees,
      totalCost: totalCost,
    })
  );
}
