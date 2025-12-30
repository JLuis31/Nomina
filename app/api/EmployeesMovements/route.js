import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  const [payFrequency, period] = data.Id_Period.split("|");

  const response = await prisma.Employees_Movements.create({
    data: {
      Id_Employee: data.Id_Employee,
      Id_Concept: Number(data.Id_Concept),
      Movement_Type: data.Movement_Type,
      Total_Amount: String(data.Total_Amount),
      Deduction: String(data.Balance),
      Id_PayFrequency: Number(payFrequency),
      Id_Period: Number(period),
      Last_Time_Update: new Date(),
      Increase_or_Rest: data.Acumulated_Deducted,
      Is_Processed: false,
    },
  });

  return new Response(JSON.stringify(response), { status: 201 });
}

export async function GET(request) {
  const currentYear = new Date().getFullYear();
  const { searchParams } = new URL(request.url);
  const idPaymentFrequency = Number(searchParams.get("idPaymentFrequency"));
  console.log("ID Payment Frequency:", idPaymentFrequency);

  const response = await prisma.Payroll.findMany({
    where: {
      Id_PayFrequency: idPaymentFrequency,
      Year: currentYear,
      Status: "Open",
    },
  });

  return new Response(JSON.stringify(response), { status: 200 });
}
