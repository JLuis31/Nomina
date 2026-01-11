import { prisma } from "@/lib/prisma";

export async function GET() {
  const payFrequencies = await prisma.Pay_Frequency.findMany();
  return new Response(JSON.stringify(payFrequencies));
}
