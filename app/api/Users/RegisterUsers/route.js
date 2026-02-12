import { registerUser } from "../service";

export async function POST(req) {
  const body = await req.json();
  const result = await registerUser(body);
  return new Response(
    JSON.stringify(
      result.error ? { error: result.error } : { message: result.message },
    ),
    { status: result.status },
  );
}
