import { prisma } from "@/lib/prisma";

export async function GET() {
  const umaValues = await prisma.UMA_Values.findMany({
    orderBy: {
      UMA_Year: "desc",
    },
  });
  return new Response(JSON.stringify(umaValues), {
    status: 200,
  });
}
