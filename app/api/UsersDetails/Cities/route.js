import { prisma } from "@/lib/prisma";

export async function GET() {
  const cities = await prisma.City.findMany();

  return new Response(JSON.stringify(cities), { status: 200 });
}
