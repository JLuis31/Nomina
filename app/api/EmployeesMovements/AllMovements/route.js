import { prisma } from "@/lib/prisma";

export async function GET() {
  const result = await prisma.$queryRaw`EXEC get_All_Employee_Movements`;

  return new Response(JSON.stringify(result), { status: 200 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const Id_Movement = Number(searchParams.get("Id_Movement"));
  await prisma.Employees_Movements.delete({
    where: {
      Id_Movement: Id_Movement,
    },
  });
  return new Response(
    JSON.stringify({ message: "Employee movement deleted successfully" }),
    { status: 200 }
  );
}
