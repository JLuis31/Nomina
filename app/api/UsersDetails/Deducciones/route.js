import { prisma } from "@/lib/prisma";

export async function GET() {
  const deducciones = await prisma.Deducciones.findMany();

  return new Response(JSON.stringify(deducciones), { status: 200 });
}
