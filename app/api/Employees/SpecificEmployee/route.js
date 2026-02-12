import { getEmployee, updateEmployeeService } from "../service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idEmployee = searchParams.get("idEmployee");
  const employee = await getEmployee(idEmployee);
  return new Response(JSON.stringify(employee), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req) {
  const { Id_Employee, UserData } = await req.json();
  const result = await updateEmployeeService(Id_Employee, UserData);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}
