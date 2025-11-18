import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idUser = searchParams.get("idUser");
  const description = searchParams.get("description");

  console.log("Received user ID:", idUser);
  console.log("Received description:", description);

  if (description === "Departments") {
    await prisma.Departments.delete({
      where: { Id_Department: Number(idUser) },
    });
  } else if (description === "Employee_Type") {
    await prisma.Employee_Type.delete({
      where: { Id_Employee_Type: Number(idUser) },
    });
  } else if (description === "Jobs") {
    await prisma.Jobs.delete({
      where: { Id_Job: Number(idUser) },
    });
  } else {
    return new Response("Invalid type", { status: 400 });
  }

  return new Response("Deleted", { status: 200 });
}
