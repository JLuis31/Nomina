import { prisma } from "@/lib/prisma";

export async function GET() {
  const result = await prisma.Payment_Records.findFirst({
    orderBy: {
      Date: "desc",
    },
    select: {
      Id_PayFrequency: true,
    },
  });
  return new Response(JSON.stringify(result), { status: 200 });
}
