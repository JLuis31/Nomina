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
  console.log("Received data for update:", Id_Employee, UserData);

  await prisma.Employees.update({
    where: { Id_Employee: Number(Id_Employee) },
    data: {
      Name: UserData.name,
      First_SurName: UserData.firstSurname,
      Second_Surname: UserData.secondSurname,
      Email: UserData.email,
      Phone_Number: UserData.phone,
      Address: UserData.address,
      Id_Job:
        UserData.jobTitle === "Developer"
          ? 1
          : UserData.jobTitle === "Designer"
          ? 2
          : UserData.jobTitle === "Manager"
          ? 3
          : UserData.jobTitle,
      Id_Department:
        UserData.department === "Human Resources"
          ? 1
          : UserData.department === "Finance"
          ? 2
          : UserData.department === "IT"
          ? 3
          : UserData.department,
      Id_Employee_type:
        UserData.employeeType === "Full-Time"
          ? 1
          : UserData.employeeType === "Part-Time"
          ? 2
          : 3,
      Salary: UserData.salary.replace(/[^0-9.,]/g, ""),
      Status:
        UserData.employeeStatus === "Active"
          ? "1"
          : UserData.employeeStatus === "Inactive"
          ? "2"
          : UserData.employeeStatus === "On Leave"
          ? "3"
          : UserData.employeeStatus === "In Process"
          ? "4"
          : UserData.employeeStatus,
    },
  });

  return new Response(
    JSON.stringify({ message: "Employee updated successfully" }),
    { status: 200 }
  );
}
