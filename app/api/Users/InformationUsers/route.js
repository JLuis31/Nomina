import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idUser = searchParams.get("idUsuario");

  const user = await prisma.Users.findFirst({
    where: { Id_User: parseInt(idUser) },
    select: {
      Name: true,
      Id_Department: true,
    },
  });
  return new Response(JSON.stringify(user), { status: 200 });
}
