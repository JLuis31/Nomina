import { prisma } from "@/lib/prisma";

export async function GET() {
  const result = await prisma.$queryRaw`get_DashBoard_Information`;

  return new Response(JSON.stringify(result));
}
