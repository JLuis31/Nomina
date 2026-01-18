import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idEmployee = searchParams.get("idEmployee");

  const employee = await prisma.Employees.findFirst({
    where: { Id_Employee: Number(idEmployee) },
  });

  return new Response(JSON.stringify(employee), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req) {
  const { Id_Employee, UserData } = await req.json();

  if (UserData.bankAccountNumber && UserData.bankAccountNumber.trim() !== "") {
    const existingBancAccountNumber = await prisma.Employees.findFirst({
      where: {
        BankAccountNumber: UserData.bankAccountNumber,
        NOT: { Id_Employee: Number(Id_Employee) },
      },
    });

    if (existingBancAccountNumber) {
      return new Response(
        JSON.stringify({ message: "Bank account number already exists" }),
        { status: 409 }
      );
    }
  }

  await prisma.Employees.update({
    where: { Id_Employee: Number(Id_Employee) },
    data: {
      Name: UserData.name.trim(),
      First_SurName: UserData.firstSurname.trim(),
      Second_Surname: UserData.secondSurname.trim(),
      Curp: UserData.curp,
      RFC: UserData.rfc,
      Email: UserData.email,
      Phone_Number: UserData.phone,
      Address: UserData.address,
      Id_State: Number(UserData.State),
      Id_City: Number(UserData.City),
      Id_Job: Number(UserData.jobTitle),
      Id_Department: Number(UserData.department),
      Id_Employee_type: Number(UserData.employeeType),
      Salary: parseFloat(UserData.salary.replace(/[^0-9.,]/g, "")),
      Status:
        UserData.employeeStatus === "Active"
          ? "1"
          : UserData.employeeStatus === "Inactive"
          ? "2"
          : UserData.employeeStatus,
      Id_PayFrequency: Number(UserData.payFrequency),
      BankAccountNumber: UserData.bankAccountNumber,
    },
  });

  return new Response(
    JSON.stringify({ message: "Employee updated successfully" }),
    { status: 200 }
  );
}
