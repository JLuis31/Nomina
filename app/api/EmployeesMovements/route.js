import { addEmployeeMovement, getOpenPayrolls } from "./service";

export async function POST(request) {
  const data = await request.json();
  const response = await addEmployeeMovement(data);
  return new Response(JSON.stringify(response), { status: 201 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idPaymentFrequency = Number(searchParams.get("idPaymentFrequency"));
  const response = await getOpenPayrolls(idPaymentFrequency);
  return new Response(JSON.stringify(response), { status: 200 });
}
