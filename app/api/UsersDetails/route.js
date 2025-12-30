import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idUser = searchParams.get("idUser");
  const description = searchParams.get("description");
  console.log("Delete Request Params:", { idUser, description });

  if (description === "Departments") {
    await prisma.Departments.delete({
      where: { Id_Department: Number(idUser) },
    });
  } else if (description === "Employee Types") {
    await prisma.Employee_Type.delete({
      where: { Id_Employee_type: Number(idUser) },
    });
  } else if (description === "Job Positions") {
    await prisma.Jobs.delete({
      where: { Id_Job: Number(idUser) },
    });
  } else if (description === "Pay Frequency") {
    await prisma.Pay_Frequency.delete({
      where: { Id_PayFrequency: Number(idUser) },
    });
  } else if (description === "Deductions") {
    await prisma.Concepts.delete({
      where: { Id_Concept: idUser },
    });
  } else if (description === "Cities") {
    await prisma.City.delete({
      where: { Id_City: Number(idUser) },
    });
  } else if (description === "States") {
    await prisma.State.delete({
      where: { Id_State: Number(idUser) },
    });
  } else {
    return new Response("Invalid type", { status: 400 });
  }

  return new Response(
    JSON.stringify({ message: "Deleted", department: description }),
    { status: 200 }
  );
}
