import { prisma } from "@/lib/prisma";

export async function GET() {
  const response = await prisma.Payroll.findMany();

  return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(request) {
  const data = await request.json();
  console.log("Data received for update:", data);

  const overlapping = await prisma.Payroll.findFirst({
    where: {
      Year: Number(data.dataFinal.Year),
      Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
      OR: [
        {
          Period_Start: { lte: new Date(data.dataFinal.Period_End) },
          Period_End: { gte: new Date(data.dataFinal.Period_Start) },
        },
      ],
      NOT: {
        Year: Number(data.dataInicial.Year),
        Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
        Id_Period: Number(data.dataInicial.Id_Period),
      },
    },
  });

  if (overlapping) {
    return new Response(
      JSON.stringify({
        message: "The specified period overlaps with an existing period.",
      }),
      { status: 400 }
    );
  }

  const existe = await prisma.Payroll.findUnique({
    where: {
      Year_Id_PayFrequency_Id_Period: {
        Year: Number(data.dataInicial.Year),
        Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
        Id_Period: Number(data.dataInicial.Id_Period),
      },
    },
  });

  if (!existe) {
    return new Response(JSON.stringify({ message: "No record found" }), {
      status: 404,
    });
  }

  await prisma.Payroll.update({
    where: {
      Year_Id_PayFrequency_Id_Period: {
        Year: Number(data.dataInicial.Year),
        Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
        Id_Period: Number(data.dataInicial.Id_Period),
      },
    },
    data: {
      Year: Number(data.dataFinal.Year),
      Month: Number(data.dataFinal.Month),
      Status: data.dataFinal.Status,
    },
  });

  return new Response(
    JSON.stringify({ message: "Calendar updated successfully" }),
    { status: 200 }
  );
}

export async function POST(request) {
  const data = await request.json();

  const overlapping = await prisma.Payroll.findFirst({
    where: {
      Year: data.Year,
      Id_PayFrequency: Number(data.Id_PayFrequency),
      OR: [
        {
          Period_Start: { lte: new Date(data.Period_End) },
          Period_End: { gte: new Date(data.Period_Start) },
        },
      ],
    },
  });

  if (overlapping) {
    return new Response(
      JSON.stringify({
        message: "The specified period overlaps with an existing period.",
      }),
      { status: 400 }
    );
  }

  await prisma.Payroll.create({
    data: {
      Id_PayFrequency: Number(data.Id_PayFrequency),
      Id_Period: Number(data.Id_Period),
      Month: data.Month,
      Year: data.Year,
      Period_Start: new Date(data.Period_Start),
      Period_End: new Date(data.Period_End),
    },
  });

  return new Response(
    JSON.stringify({ message: "Calendar created successfully" }),
    { status: 200 }
  );
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id_Period = Number(searchParams.get("id_Period"));
  const Id_PayFrequency = Number(searchParams.get("Id_PayFrequency"));

  const Year = Number(searchParams.get("Year"));

  await prisma.Payroll.delete({
    where: {
      Year_Id_PayFrequency_Id_Period: {
        Year: Year,
        Id_PayFrequency: Id_PayFrequency,
        Id_Period: id_Period,
      },
    },
  });

  return new Response(
    JSON.stringify({
      message: `Period ${id_Period} from year ${Year} deleted successfully`,
    }),
    { status: 200 }
  );
}
