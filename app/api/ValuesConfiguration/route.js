import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

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
        data: { Description: data.Name.trim() },
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
        data: { Description: data.Name.trim() },
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
        data: { Description: data.Name.trim() },
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
        data: { Description: data.Name.trim() },
      });
      break;
    }
    case "5": {
      const existingDeduccionesId = await prisma.Concepts.findFirst({
        where: { Id_Concept: data.Id_Concept },
      });

      if (existingDeduccionesId) {
        return new Response(
          JSON.stringify({ message: "Deductions already exists" }),
          { status: 400 }
        );
      }

      addedData = await prisma.Concepts.create({
        data: {
          Description: data.Name.trim(),
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
        data: { State: data.Name.trim() },
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
        data: { City: data.Name.trim() },
      });
      break;
    }

    case "9": {
      const existingUmaValueByYear = await prisma.UMA_Values.findFirst({
        where: { UMA_Year: data.UMA_Year },
      });

      if (existingUmaValueByYear) {
        return new Response(
          JSON.stringify({
            message: `UMA Value for year ${data.UMA_Year} already exists`,
          }),
          { status: 400 }
        );
      }

      addedData = await prisma.UMA_Values.create({
        data: {
          UMA_Year: data.UMA_Year,
          UMA_Values: parseFloat(data.UMA_Value),
        },
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
      message: "Item added successfully",
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
        data: { Description: data.data.description.trim() },
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
        data: { Description: data.data.description.trim() },
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
        data: { Description: data.data.description.trim() },
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
        data: { Description: data.data.description.trim() },
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
        data: { State: data.data.description.trim() },
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
        data: { City: data.data.description.trim() },
      });
      break;
    }
    case "Deductions": {
      const ExistingConcept = await prisma.Concepts.findFirst({
        where: {
          Id_Concept: data.data.Id_Concept,
          NOT: { Id_Concept: data.data.concept_Selected.Id_Concept },
        },
      });

      if (ExistingConcept) {
        return new Response(
          JSON.stringify({ message: "Concept id already exists." }),
          { status: 400 }
        );
      }

      if (data.data.is_Default_Concept === 1) {
        await prisma.Default_Concepts.create({
          data: {
            Id_Concept: data.data.Id_Concept,
            Description: data.data.description.trim(),
            Id_PayFrequency: Number(data.data.payment_Frequency) || 0,
            Id_Concept_Type: data.data.concept_Type,
            Per_Hour: 0,
            Per_Amount: 0,
          },
        });
      }

      if (data.data.is_Default_Concept === 2) {
        await prisma.Default_Concepts.deleteMany({
          where: {
            Id_Concept: String(data.data.concept_Selected.Id_Concept),
            Id_PayFrequency: Number(data.data.payment_Frequency) || 0,
          },
        });
      }

      await prisma.Employees_Movements.updateMany({
        where: {
          Id_Concept: String(data.data.concept_Selected.Id_Concept),
        },
        data: { Id_Concept: String(data.data.Id_Concept) },
      });

      updatedData = await prisma.Concepts.update({
        where: { Id_Concept: data.data.concept_Selected.Id_Concept },
        data: {
          Id_Concept: String(data.data.Id_Concept),
          Description: data.data.description.trim(),
          Id_Concept_Type: data.data.concept_Type,
          Income_Tax: data.data.income_Tax === 1 ? true : false,
          Social_Sec: data.data.social_Security === 1 ? true : false,
          Is_Default_Concept:
            data.data.is_Default_Concept === 2
              ? false
              : Boolean(data.data.is_Default_Concept),
        },
      });

      await prisma.Default_Concepts.updateMany({
        where: {
          Id_Concept: String(data.data.concept_Selected.Id_Concept),
        },
        data: {
          Id_Concept: String(data.data.Id_Concept),
          Description: data.data.description.trim(),
          Id_Concept_Type: data.data.concept_Type,
        },
      });

      break;
    }
    case "UMA Values": {
      const current = await prisma.UMA_Values.findUnique({
        where: { Id_UMA: data.data.concept_Selected.Id_UMA },
      });
      if (
        current?.UMA_Year === data.data.UMA_Year &&
        current?.UMA_Values === parseFloat(data.data.UMA_Values) &&
        current?.Is_Active === (data.data.UMA_Status === "1" ? true : false)
      ) {
        return new Response(
          JSON.stringify({ message: "UMA Year already exists." }),
          { status: 400 }
        );
      }

      await prisma.UMA_Values.updateMany({
        where: {
          NOT: { Id_UMA: data.data.concept_Selected.Id_UMA },
        },
        data: {
          Is_Active: false,
        },
      });

      updatedData = await prisma.UMA_Values.update({
        where: { Id_UMA: data.data.concept_Selected.Id_UMA },
        data: {
          UMA_Year: data.data.UMA_Year,
          UMA_Values: parseFloat(data.data.UMA_Values),
          Is_Active: data.data.UMA_Status === "1" ? true : false,
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
