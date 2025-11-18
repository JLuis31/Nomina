import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const data = await req.json();
  const formatedData = {
    ...data,
    jobTitle:
      data.jobTitle === "Developer" ? 1 : data.jobTitle === "Designer" ? 2 : 3,
    department:
      data.department === "Human Resources"
        ? 1
        : data.department === "Finance"
        ? 2
        : 3,
    employeeType:
      data.employeeType === "Full-Time"
        ? 1
        : data.employeeType === "Part-Time"
        ? 2
        : 3,
    salary: new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(data.salary)),
    status:
      data.status === "Active" ? "1" : data.status === "InProcess" ? "4" : null,
  };

  const existingEmployeeEmail = await prisma.Employees.findFirst({
    where: { Email: formatedData.email },
  });

  const existingEmployeePhone = await prisma.Employees.findFirst({
    where: { Phone_Number: formatedData.phone },
  });

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
  console.log(data);
  console.log(formatedData);
  await prisma.Employees.create({
    data: {
      Name: formatedData.name,
      First_SurName: formatedData.firstSurname,
      Second_Surname: formatedData.secondSurname,
      Email: formatedData.email,
      Phone_Number: formatedData.phone,
      Address: formatedData.address,
      Id_Job: formatedData.jobTitle,
      Id_Department: formatedData.department,
      Id_Employee_type: formatedData.employeeType,
      Start_Date: new Date(formatedData.startDate),
      Salary: formatedData.salary,
      Status: formatedData.status,
    },
  });

  return new Response(
    JSON.stringify({ message: "Employee added successfully" }),
    { status: 201 }
  );
}

export async function GET(req) {
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
