import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const data = await req.json();
  const formatedData = {
    ...data,
    salary: data.salary,
    status:
      data.status === "Active"
        ? "1"
        : data.status === "In Process"
        ? "4"
        : null,
  };

  const existingEmployeeEmail = await prisma.Employees.findFirst({
    where: { Email: formatedData.email },
  });

  const existingEmployeePhone = await prisma.Employees.findFirst({
    where: { Phone_Number: formatedData.phone },
  });

  const existingCurp = await prisma.Employees.findFirst({
    where: { Curp: formatedData.curp },
  });

  const existingRfc = await prisma.Employees.findFirst({
    where: { RFC: formatedData.rfc },
  });

  if (existingRfc) {
    return new Response(
      JSON.stringify({
        message: "Employee with given RFC already exists",
      }),
      { status: 409 }
    );
  }
  if (existingCurp) {
    return new Response(
      JSON.stringify({
        message: "Employee with given CURP already exists",
      }),
      { status: 409 }
    );
  }

  if (existingEmployeeEmail) {
    return new Response(
      JSON.stringify({
        message: "Employee with given email already exists",
      }),
      { status: 409 }
    );
  }
  if (existingEmployeePhone) {
    return new Response(
      JSON.stringify({
        message: "Employee with given phone number already exists",
      }),
      { status: 409 }
    );
  }

  await prisma.Employees.create({
    data: {
      Name: formatedData.name,
      First_SurName: formatedData.firstSurname,
      Second_Surname: formatedData.secondSurname,
      Email: formatedData.email,
      Phone_Number: formatedData.phone,
      Address: formatedData.address,
      Id_State: Number(formatedData.State),
      Id_City: Number(formatedData.City),
      Id_Job: Number(formatedData.jobTitle),
      Id_Department: Number(formatedData.department),
      Id_Employee_type: Number(formatedData.employeeType),
      Start_Date: new Date(formatedData.startDate),
      Salary: formatedData.salary,
      Status: formatedData.status,
      Curp: formatedData.curp,
      RFC: formatedData.rfc,
      BankAccountNumber: "",
      Id_PayFrequency: 0,
    },
  });

  return new Response(
    JSON.stringify({ message: "Employee added successfully" }),
    { status: 201 }
  );
}

export async function GET() {
  const response = await prisma.Employees.findMany();
  if (response.length === 0) {
    return new Response(JSON.stringify({ message: "No employees found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify(response), { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const idEmployee = searchParams.get("idEmployee");

  console.log("Deleting employee with ID:", idEmployee);

  await prisma.Employees.delete({
    where: { Id_Employee: Number(idEmployee) },
  });

  return new Response(
    JSON.stringify({ message: "Employee deleted successfully" }),
    { status: 200 }
  );
}
