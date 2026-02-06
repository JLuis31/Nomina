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
      continue;
    }

    await prisma.Payroll_Detail.deleteMany({
      where: {
        Id_Employee: receivedData.selectedEmployee.Id_Employee,
        Id_Concept: ex.Id_Concept,
      },
    });

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
    },
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const respone = await prisma.Employee_Exceptions.findMany({
    where: {
      Id_PayFrequency: Number(searchParams.get("payFrequencyId")),
    },
  });

  return new Response(JSON.stringify(respone), { status: 200 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idConcept = searchParams.get("idConcept");
  const idEmployee = searchParams.get("idEmployee");

  await prisma.Employee_Exceptions.delete({
    where: {
      Id_Movement: Number(searchParams.get("idException")),
    },
  });

  return new Response(
    JSON.stringify({
      message: `Exception ${idConcept} deleted successfully for employee ${idEmployee}`,
    }),
    {
      status: 200,
    },
  );
}
