import { addValue, updateValue } from "./service";

export async function POST(request) {
  const data = await request.json();
  const result = await addValue(data);
  return new Response(JSON.stringify(result), { status: result.status });
}

export async function PUT(request) {
  const data = await request.json();
  const result = await updateValue(data);
  return new Response(JSON.stringify(result), { status: result.status });
}
