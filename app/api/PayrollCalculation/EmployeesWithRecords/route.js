import { prisma } from "@/lib/prisma";

export async function GET() {
  const employeesWithRecords = await prisma.Payment_Records.findMany();

  return new Response(JSON.stringify(employeesWithRecords), { status: 200 });
}
