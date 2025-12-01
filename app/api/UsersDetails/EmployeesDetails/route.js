import { prisma } from "@/lib/prisma";

export async function GET() {
  const empleados = await prisma.Employees.findMany();
  console.log("Empleados data:", empleados);

  return new Response(JSON.stringify(empleados), { status: 200 });
}
