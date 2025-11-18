import { prisma } from "@/lib/prisma";

export async function GET() {
  const employeeTypes = await prisma.Employee_Type.findMany();
  return new Response(JSON.stringify(employeeTypes));
}
