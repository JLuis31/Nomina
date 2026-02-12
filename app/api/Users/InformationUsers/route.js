import { getUserInformation } from "../service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idUser = searchParams.get("idUsuario");
  const user = await getUserInformation(idUser);
  return new Response(JSON.stringify(user), { status: 200 });
}
