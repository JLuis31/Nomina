import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  const [payFrequency, period] = data.Id_Period.split("|");

  const response = await prisma.Employees_Movements.create({
    data: {
      Id_Employee: data.Id_Employee,
      Id_Concept: data.Id_Concept,
      Id_Concept_Type: data.Movement_Type,
      Total_Amount: parseFloat(data.Total_Amount),
      Balance: parseFloat(data.Balance),
      Id_PayFrequency: Number(payFrequency),
      Id_Period: Number(period),
      Last_Time_Update: new Date(),
      Created_By: data.Created_By,
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

  const response = await prisma.Payroll.findMany({
    where: {
      Id_PayFrequency: idPaymentFrequency,
      Year: currentYear,
      Status: "Open",
    },
  });

  return new Response(JSON.stringify(response), { status: 200 });
}
