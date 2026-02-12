import { saveExceptions, getExceptions, removeException } from "./service";

export async function POST(request) {
  const receivedData = await request.json();
  const result = await saveExceptions(receivedData);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payFrequencyId = Number(searchParams.get("payFrequencyId"));
  const response = await getExceptions(payFrequencyId);
  return new Response(JSON.stringify(response), { status: 200 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idConcept = searchParams.get("idConcept");
  const idEmployee = searchParams.get("idEmployee");
  const idException = Number(searchParams.get("idException"));
  const result = await removeException(idException, idConcept, idEmployee);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}
