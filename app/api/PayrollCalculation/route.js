import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payFrequency = searchParams.get("payFrequency");

  const existOpenPeriod = await prisma.Payroll.findFirst({
    where: {
      Id_PayFrequency: Number(payFrequency),
      Status: "Open",
    },
  });

  if (!existOpenPeriod) {
    return new Response(
      JSON.stringify({ message: "No open period found to calculate payroll." }),
      {
        status: 400,
      },
    );
  }

  const result =
    await prisma.$queryRaw`EXEC Calculate_Payroll @frequencyPayment = ${Number(payFrequency)}`;

  return new Response(JSON.stringify(result), { status: 200 });
}
