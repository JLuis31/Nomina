import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payFrequencyId = Number(searchParams.get("lastPayFrequency"));

  const maxPeriod = await prisma.Payroll.findFirst({
    where: {
      payFrequencyId: Number(payFrequencyId),
      status: "Open",
    },
    orderBy: {
      id_period: "desc",
    },
    select: {
      id_period: true,
    },
  });

  const existingOpenPeriod = await prisma.Payroll.findFirst({
    where: {
      payFrequencyId: Number(payFrequencyId),
      status: "Open",
      id_period: maxPeriod?.id_period,
    },
  });

  if (!existingOpenPeriod) {
    return new Response(
      JSON.stringify({ error: "No open period found to close." }),
      { status: 404 },
    );
  }

  const result =
    await prisma.$queryRaw`Closing_Period @frequencyPayment = ${Number(payFrequencyId)}`;

  return new Response(JSON.stringify(result), { status: 200 });
}
