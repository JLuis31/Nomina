import { prisma } from "@/lib/prisma";

export async function GET() {
  const departments = await prisma.Departments.findMany();

  console.log(departments);
  return new Response(JSON.stringify(departments), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
