import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  console.log("Received department:", data);

  switch (data.department) {
    case "1":
      const existingDepartment = await prisma.Departments.findFirst({
        where: { Description: data.Name },
      });

      if (existingDepartment) {
        return new Response(
          JSON.stringify({ message: "Department already exists" }),
          { status: 400 }
        );
      }

      await prisma.Departments.create({
        data: { Description: data.Name },
      });
      break;
    case "2":
      const existingEmployeeType = await prisma.Employee_Type.findFirst({
        where: { Description: data.Name },
      });

      if (existingEmployeeType) {
        return new Response(
          JSON.stringify({ message: "Employee type already exists" }),
          { status: 400 }
        );
      }

      await prisma.Employee_Type.create({
        data: { Description: data.Name },
      });
      break;
    case "3":
      const existingJob = await prisma.Jobs.findFirst({
        where: { Description: data.Name },
      });

      if (existingJob) {
        return new Response(JSON.stringify({ message: "Job already exists" }), {
          status: 400,
        });
      }

      await prisma.Jobs.create({
        data: { Description: data.Name },
      });
      break;
    case "4":
      const existingPayFrequency = await prisma.Pay_Frequency.findFirst({
        where: { Description: data.Name },
      });
      if (existingPayFrequency) {
        return new Response(
          JSON.stringify({ message: "Pay frequency already exists" }),
          { status: 400 }
        );
      }
      await prisma.Pay_Frequency.create({
        data: { Description: data.Name },
      });
      break;
    case "5":
      const existingDeducciones = await prisma.Deducciones.findFirst({
        where: { Description: data.Name },
      });
      if (existingDeducciones) {
        return new Response(
          JSON.stringify({ message: "Deductions already exists" }),
          { status: 400 }
        );
      }
      await prisma.Deducciones.create({
        data: { Description: data.Name, Value: data.Value },
      });
      break;
    case "6":
      const existingStates = await prisma.State.findFirst({
        where: { State: data.Name },
      });
      if (existingStates) {
        return new Response(
          JSON.stringify({ message: "State already exists" }),
          { status: 400 }
        );
      }
      await prisma.State.create({
        data: { State: data.Name },
      });
      break;
    case "7":
      const existingCities = await prisma.City.findFirst({
        where: { City: data.Name },
      });
      if (existingCities) {
        return new Response(
          JSON.stringify({ message: "City already exists" }),
          { status: 400 }
        );
      }

      await prisma.City.create({
        data: { City: data.Name },
      });
      break;
    default:
      return new Response(
        "Invalid department",
        { message: "Invalid department" },
        { status: 400 }
      );
  }

  return new Response(
    JSON.stringify({ message: "Data processed successfully" }),
    { status: 200 }
  );
}
