import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const receivedData = await request.json();

  for (const key of Object.keys(receivedData.Exceptions)) {
    const ex = receivedData.Exceptions[key];

    const existingException = await prisma.Employee_Exceptions.findFirst({
      where: {
        Id_Employee: receivedData.selectedEmployee.Id_Employee,
        Id_Concept: ex.Id_Concept,
      },
    });

    if (existingException) {
      console.log(`Exception already exists for concept ${ex.Id_Concept}`);
      continue;
    }

    await prisma.Employee_Exceptions.create({
      data: {
        Id_Employee: receivedData.selectedEmployee.Id_Employee,
        Id_Concept: ex.Id_Concept,
        Id_PayFrequency: receivedData.selectedEmployee.Id_PayFrequency,
        Id_Concept_Type: ex.Id_Concept_Type,
        Per_Amount: parseFloat(ex.Per_Amount) || 0,
        Per_Hour: parseFloat(ex.Per_Hour) || 0,
      },
    });
  }

  return new Response(
    JSON.stringify({ message: "Exceptions saved successfully" }),
    {
      status: 200,
    }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  console.log("Pay Frequency ID:", searchParams.get("payFrequencyId"));

  const respone = await prisma.Employee_Exceptions.findMany({
    where: {
      Id_PayFrequency: Number(searchParams.get("payFrequencyId")),
    },
  });

  return new Response(JSON.stringify(respone), { status: 200 });
}
