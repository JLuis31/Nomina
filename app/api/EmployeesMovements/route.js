import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  console.log("Received data:", data);

  const response = await prisma.Employees_Movements.create({
    data: {
      Id_Employee: data.Id_Employee,
      Id_Concept: Number(data.Id_Concept),
      Movement_Type: data.Movement_Type,
      Total_Amount: String(data.Total_Amount),
      Deduction: String(data.Balance),
      Initial_Period: new Date(data.Initial_Period).toISOString(),
      Last_Time_Update: new Date(data.Initial_Period).toISOString(),
      Increase_or_Rest: data.Acumulated_Deducted,
      Is_Processed: false,
    },
  });

  return new Response(JSON.stringify(response), { status: 201 });
}
