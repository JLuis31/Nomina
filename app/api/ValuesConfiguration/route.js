import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  console.log("Received data:", data);

  let addedData = null;
  switch (data.department) {
    case "1": {
      const existingDepartment = await prisma.Departments.findFirst({
        where: { Description: data.Name },
      });
      if (existingDepartment) {
        return new Response(
          JSON.stringify({ message: "Department already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.Departments.create({
        data: { Description: data.Name },
      });
      break;
    }
    case "2": {
      const existingEmployeeType = await prisma.Employee_Type.findFirst({
        where: { Description: data.Name },
      });
      if (existingEmployeeType) {
        return new Response(
          JSON.stringify({ message: "Employee type already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.Employee_Type.create({
        data: { Description: data.Name },
      });
      break;
    }
    case "3": {
      const existingJob = await prisma.Jobs.findFirst({
        where: { Description: data.Name },
      });
      if (existingJob) {
        return new Response(JSON.stringify({ message: "Job already exists" }), {
          status: 400,
        });
      }
      addedData = await prisma.Jobs.create({
        data: { Description: data.Name },
      });
      break;
    }
    case "4": {
      const existingPayFrequency = await prisma.Pay_Frequency.findFirst({
        where: { Description: data.Name },
      });
      if (existingPayFrequency) {
        return new Response(
          JSON.stringify({ message: "Pay frequency already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.Pay_Frequency.create({
        data: { Description: data.Name },
      });
      break;
    }
    case "5": {
      const existingDeducciones = await prisma.Concepts.findFirst({
        where: { Description: data.Name },
      });
      const existingDeduccionesId = await prisma.Concepts.findFirst({
        where: { Id_Concept: data.Id_Concept },
      });
      if (existingDeducciones || existingDeduccionesId) {
        return new Response(
          JSON.stringify({ message: "Deductions already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.Concepts.create({
        data: {
          Description: data.Name,
          Id_Concept_Type: data.ConceptType,
          Id_Concept: data.Id_Concept,
          Income_Tax: data.IncomeTax === "1",
          Social_Sec: data.SocialSec === "1",
        },
      });
      break;
    }
    case "6": {
      const existingStates = await prisma.State.findFirst({
        where: { State: data.Name },
      });
      if (existingStates) {
        return new Response(
          JSON.stringify({ message: "State already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.State.create({
        data: { State: data.Name },
      });
      break;
    }
    case "7": {
      const existingCities = await prisma.City.findFirst({
        where: { City: data.Name },
      });
      if (existingCities) {
        return new Response(
          JSON.stringify({ message: "City already exists" }),
          { status: 400 }
        );
      }
      addedData = await prisma.City.create({
        data: { City: data.Name },
      });
      break;
    }
    default:
      return new Response(
        "Invalid department",
        { message: "Invalid department" },
        { status: 400 }
      );
  }

  return new Response(
    JSON.stringify({
      message: "Data processed successfully",
      department: data.department,
      addedData,
    }),
    { status: 200 }
  );
}

export async function PUT(request) {
  const data = await request.json();
  const department = data.data?.concept_Selected?.Department;
  let updatedData = null;

  switch (department) {
    case "Departments": {
      const current = await prisma.Departments.findUnique({
        where: { Id_Department: data.data.concept_Selected.Id_Department },
      });
      if (current?.Description === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.Departments.update({
        where: { Id_Department: data.data.concept_Selected.Id_Department },
        data: { Description: data.data.description },
      });
      break;
    }
    case "Employee Types": {
      const current = await prisma.Employee_Type.findUnique({
        where: {
          Id_Employee_type: data.data.concept_Selected.Id_Employee_type,
        },
      });
      if (current?.Description === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.Employee_Type.update({
        where: {
          Id_Employee_type: data.data.concept_Selected.Id_Employee_type,
        },
        data: { Description: data.data.description },
      });
      break;
    }
    case "Job Positions": {
      const current = await prisma.Jobs.findUnique({
        where: { Id_Job: data.data.concept_Selected.Id_Job },
      });
      if (current?.Description === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.Jobs.update({
        where: { Id_Job: data.data.concept_Selected.Id_Job },
        data: { Description: data.data.description },
      });
      break;
    }
    case "Pay Frequency": {
      const current = await prisma.Pay_Frequency.findUnique({
        where: { Id_PayFrequency: data.data.concept_Selected.Id_PayFrequency },
      });
      if (current?.Description === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.Pay_Frequency.update({
        where: { Id_PayFrequency: data.data.concept_Selected.Id_PayFrequency },
        data: { Description: data.data.description },
      });
      break;
    }
    case "States": {
      const current = await prisma.State.findUnique({
        where: { Id_State: data.data.concept_Selected.Id_State },
      });
      if (current?.State === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.State.update({
        where: { Id_State: data.data.concept_Selected.Id_State },
        data: { State: data.data.description },
      });
      break;
    }
    case "Cities": {
      const current = await prisma.City.findUnique({
        where: { Id_City: data.data.concept_Selected.Id_City },
      });
      if (current?.City === data.data.description) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }
      updatedData = await prisma.City.update({
        where: { Id_City: data.data.concept_Selected.Id_City },
        data: { City: data.data.description },
      });
      break;
    }
    case "Deductions": {
      const current = await prisma.Concepts.findUnique({
        where: { Id_Concept: data.data.concept_Selected.Id_Concept },
      });
      const noChange =
        current?.Id_Concept === data.data.id &&
        current?.Description === data.data.description &&
        current?.Id_Concept_Type === data.data.concept_Type &&
        current?.Income_Tax === (data.data.income_Tax === 1) &&
        current?.Social_Sec === (data.data.social_Security === 1);

      if (noChange) {
        return new Response(
          JSON.stringify({ message: "No changes detected." }),
          { status: 200 }
        );
      }

      const ExistingConcept = await prisma.Concepts.findFirst({
        where: {
          Description: data.data.description,
          Id_Concept: { not: data.data.concept_Selected.Id_Concept },
        },
      });
      if (ExistingConcept) {
        return new Response(
          JSON.stringify({ message: "Concept description already exists." }),
          { status: 208 }
        );
      }

      await prisma.Employees_Movements.updateMany({
        where: {
          Id_Concept: Number(data.data.concept_Selected.Id_Concept),
        },
        data: { Id_Concept: Number(data.data.id) },
      });

      updatedData = await prisma.Concepts.update({
        where: { Id_Concept: data.data.concept_Selected.Id_Concept },
        data: {
          Id_Concept: data.data.id,
          Description: data.data.description,
          Id_Concept_Type: data.data.concept_Type,
          Income_Tax: data.data.income_Tax === 1 ? true : false,
          Social_Sec: data.data.social_Security === 1 ? true : false,
        },
      });
      break;
    }
    default:
      return new Response(JSON.stringify({ message: "Invalid department" }), {
        status: 400,
      });
  }

  return new Response(
    JSON.stringify({
      message: `Record ${department} updated successfully`,
      department: department,
      updatedData,
    }),
    { status: 200 }
  );
}
