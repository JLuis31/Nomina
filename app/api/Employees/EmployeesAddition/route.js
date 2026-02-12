import { addEmployee, fetchEmployees, removeEmployee } from "../service";

export async function POST(req) {
  const data = await req.json();
  const result = await addEmployee(data);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}

export async function GET() {
  const result = await fetchEmployees();
  if (result.status === 404) {
    return new Response(JSON.stringify({ message: result.message }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify(result.data), { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const idEmployee = searchParams.get("idEmployee");
  const result = await removeEmployee(idEmployee);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}
