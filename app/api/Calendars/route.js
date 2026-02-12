import {
  fetchCalendars,
  updateCalendarService,
  createCalendarService,
  deleteCalendarService,
} from "./service";

export async function GET() {
  const response = await fetchCalendars();
  return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(request) {
  const data = await request.json();
  const result = await updateCalendarService(data);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}

export async function POST(request) {
  const data = await request.json();
  const result = await createCalendarService(data);
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id_Period = Number(searchParams.get("id_Period"));
  const Id_PayFrequency = Number(searchParams.get("Id_PayFrequency"));
  const Year = Number(searchParams.get("Year"));
  const result = await deleteCalendarService({
    Year,
    Id_PayFrequency,
    Id_Period: id_Period,
  });
  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
  });
}
