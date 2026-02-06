import { prisma } from "@/lib/prisma";

export async function GET() {
  const defaultConcepts = await prisma.Default_Concepts.findMany();
  return new Response(JSON.stringify(defaultConcepts), { status: 200 });
}

export async function POST(request) {
  
    const {
      Id_Concept,
      Id_Concept_Type,
      Description,
      Id_PayFrequency,
      Per_Hour,
      Per_Amount,
    } = await request.json();

    const existing = await prisma.Default_Concepts.findFirst({
      where: {
        Id_Concept: String(Id_Concept),
        Id_PayFrequency: Number(Id_PayFrequency),
      },
    });

    if (existing) {
      return new Response(
        JSON.stringify({
          error: "This concept-frequency combination already exists",
        }),
        { status: 400 }
      );
    }

    const newDefaultConcept = await prisma.Default_Concepts.create({
      data: {
        Id_Concept: String(Id_Concept),
        Id_Concept_Type: String(Id_Concept_Type),
        Description: String(Description),
        Id_PayFrequency: Number(Id_PayFrequency),
        Per_Hour: Per_Hour ? parseFloat(Per_Hour) : 0,
        Per_Amount: Per_Amount ? parseFloat(Per_Amount) : 0,
      },
    });

    return new Response(JSON.stringify(newDefaultConcept), { status: 201 });
  
  }


export async function PUT(request) {
  const { defaultConcepts } = await request.json();

  for (const key in defaultConcepts) {
    const item = defaultConcepts[key];
    const splitKey = key.split("-");

    const data = {};
    if (item.Per_Amount !== "" && item.Per_Amount !== undefined)
      data.Per_Amount = parseFloat(item.Per_Amount);
    if (item.Per_Hour !== "" && item.Per_Hour !== undefined)
      data.Per_Hour = parseFloat(item.Per_Hour);

    await prisma.Default_Concepts.updateMany({
      where: {
        Id_Concept: String(splitKey[0]),
        Id_PayFrequency: Number(splitKey[1]),
      },
      data: data,
    });
  }

  return new Response(
    JSON.stringify({ message: "Default Concepts updated successfully" }),
    { status: 200 }
  );
}
