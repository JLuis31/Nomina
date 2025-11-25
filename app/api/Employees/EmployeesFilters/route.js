import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const employeeType = searchParams.get("employeeType");
  const jobPosition = searchParams.get("jobPosition");
  let filters = {};
  if (department) {
    filters = { ...filters, Id_Department: parseInt(department) };
  }
  if (employeeType) {
    filters = { ...filters, Id_Employee_type: parseInt(employeeType) };
  }
  if (jobPosition) {
    filters = { ...filters, Id_Job: parseInt(jobPosition) };
  }
  if (status) {
    filters = { ...filters, Status: status };
  }

  console.log("Filters applied:", filters);
  const employees = await prisma.employees.findMany({
    where: {
      ...filters,
    },
  });
  return new Response(JSON.stringify(employees));
}
