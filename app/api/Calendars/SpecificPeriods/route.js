import { getPeriods } from "../service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payFrequencyId = Number(searchParams.get("payFrequencyId"));
  const year = Number(searchParams.get("year"));
  const response = await getPeriods(payFrequencyId, year);
  return new Response(JSON.stringify(response), { status: 200 });
}
