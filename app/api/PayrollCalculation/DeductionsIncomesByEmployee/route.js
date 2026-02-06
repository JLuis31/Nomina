import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");

  const result =
    await prisma.$queryRaw`EXEC get_Deductions_Incomes_By_Employee @employeeId = ${employeeId}`;

  return new Response(JSON.stringify(result), { status: 200 });
}
