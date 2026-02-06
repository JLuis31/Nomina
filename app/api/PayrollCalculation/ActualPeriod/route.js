import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const IdPaymentFrequency = searchParams.get("IdPaymentFrequency");

  const period = await prisma.Payroll.findFirst({
    where: {
      Id_PayFrequency: Number(IdPaymentFrequency),
      Status: "Open",
    },
    orderBy: {
      Period_Start: "asc",
    },
    take: 1,
  });

  if (!period || period.length === 0 || period === null) {
    return new Response(
      JSON.stringify({ error: "No open payroll period found." }),
      { status: 404 },
    );
  }

  return new Response(JSON.stringify(period), { status: 200 });
}
