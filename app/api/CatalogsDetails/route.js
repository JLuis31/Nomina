import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idUser = searchParams.get("idUser");
  const description = searchParams.get("description");
  console.log("Delete Request Params:", { idUser, description });

  if (description === "Departments") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_Department: Number(idUser) },
    });

    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete department with associated employees",
        }),
        { status: 400 }
      );
    }

    await prisma.Departments.delete({
      where: { Id_Department: Number(idUser) },
    });
  } else if (description === "Employee Types") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_Employee_type: Number(idUser) },
    });
    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete employee type with associated employees",
        }),
        { status: 400 }
      );
    }
    await prisma.Employee_Type.delete({
      where: { Id_Employee_type: Number(idUser) },
    });
  } else if (description === "Job Positions") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_Job: Number(idUser) },
    });
    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete job position with associated employees",
        }),
        { status: 400 }
      );
    }
    await prisma.Jobs.delete({
      where: { Id_Job: Number(idUser) },
    });
  } else if (description === "Pay Frequency") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_PayFrequency: Number(idUser) },
    });

    const hasPayrolls = await prisma.Payrolls.findFirst({
      where: { Id_PayFrequency: Number(idUser) },
    });
    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete pay frequency with associated employees",
        }),
        { status: 400 }
      );
    }
    if (hasPayrolls) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete pay frequency with associated payrolls",
        }),
        { status: 400 }
      );
    }
    await prisma.Pay_Frequency.delete({
      where: { Id_PayFrequency: Number(idUser) },
    });
  } else if (description === "Deductions") {
    const hasPayrollDetails = await prisma.Employees_Movements.findFirst({
      where: { Id_Concept: idUser },
    });

    if (hasPayrollDetails) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete concept with associated employees movements",
        }),
        { status: 400 }
      );
    }

    await prisma.Concepts.delete({
      where: { Id_Concept: idUser },
    });
  } else if (description === "Cities") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_City: Number(idUser) },
    });

    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete city with associated employees",
        }),
        { status: 400 }
      );
    }

    await prisma.City.delete({
      where: { Id_City: Number(idUser) },
    });
  } else if (description === "States") {
    const hasEmployees = await prisma.Employees.findFirst({
      where: { Id_State: Number(idUser) },
    });

    if (hasEmployees) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete state with associated employees",
        }),
        { status: 400 }
      );
    }
    await prisma.State.delete({
      where: { Id_State: Number(idUser) },
    });
  } else if (description === "Default Concepts") {
    const hasEmployeesMovements = await prisma.Employees_Movements.findFirst({
      where: { Id_Concept: idUser },
    });

    if (hasEmployeesMovements) {
      return new Response(
        JSON.stringify({
          message:
            "Cannot delete default concept with associated employee movements",
        }),
        { status: 400 }
      );
    }

    await prisma.Default_Concepts.delete({
      where: { Id_Default_Concept: Number(idUser) },
    });

    return new Response(
      JSON.stringify({ message: "Deleted", department: description }),
      { status: 200 }
    );
  } else {
    return new Response("Invalid type", { status: 400 });
  }

  return new Response(
    JSON.stringify({ message: "Deleted", department: description }),
    { status: 200 }
  );
}
