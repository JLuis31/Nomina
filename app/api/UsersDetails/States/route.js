import { prisma } from "@/lib/prisma";

export async function GET() {
  const states = await prisma.State.findMany();

  return new Response(JSON.stringify(states), { status: 200 });
}
