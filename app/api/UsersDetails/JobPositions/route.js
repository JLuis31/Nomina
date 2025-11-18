import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobPositions = await prisma.Jobs.findMany();
  return new Response(JSON.stringify(jobPositions));
}
