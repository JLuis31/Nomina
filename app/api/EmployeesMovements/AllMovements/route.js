import { fetchAllMovements, removeEmployeeMovement } from "../service";

export async function GET() {
  const result = await fetchAllMovements();
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const Id_Movement = Number(searchParams.get("Id_Movement"));
  const result = await removeEmployeeMovement(Id_Movement);
  return new Response(JSON.stringify(result), { status: 200 });
}
