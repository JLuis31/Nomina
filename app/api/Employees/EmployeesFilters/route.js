import { getFilteredEmployees } from "../service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const employeeType = searchParams.get("employeeType");
  const jobPosition = searchParams.get("jobPosition");
  const employees = await getFilteredEmployees({
    status,
    department,
    employeeType,
    jobPosition,
  });
  return new Response(JSON.stringify(employees));
}
