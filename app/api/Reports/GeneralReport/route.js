import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payrollId = searchParams.get("IdPayFrequency");

  const result =
    await prisma.$queryRaw`EXEC General_Report_By_Period @frequencyPayment = ${Number(payrollId)}`;

  return new Response(JSON.stringify(result), { status: 200 });
}
