import { prisma } from "@/lib/prisma";

export async function GET() {
  const empleados = await prisma.Employees.findMany();

  return new Response(JSON.stringify(empleados), { status: 200 });
}
