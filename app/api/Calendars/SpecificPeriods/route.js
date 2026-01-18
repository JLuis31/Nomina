import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payFrequencyId = Number(searchParams.get("payFrequencyId"));
  const Year = Number(searchParams.get("year"));

  const response = await prisma.Payroll.findMany({
    select: {
      Id_Period: true,
      Period_Start: true,
      Period_End: true,
    },
    where: {
      Id_PayFrequency: payFrequencyId,
      Year: Year,
    },
  });

  return new Response(JSON.stringify(response), { status: 200 });
}
