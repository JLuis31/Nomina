import { prisma } from "@/lib/prisma";

export async function GET() {
  const defaultConcepts = await prisma.Default_Concepts.findMany();
  return new Response(JSON.stringify(defaultConcepts), { status: 200 });
}

export async function PUT(request) {
  const { defaultConcepts } = await request.json();

  for (const key in defaultConcepts) {
    const item = defaultConcepts[key];
    const splitKey = key.split("-");
    console.log("Split Key:", splitKey[0]);
    console.log("Item to update:", JSON.stringify(item), "Key:", key);

    const data = {};
    if (item.Per_Amount !== "" && item.Per_Amount !== undefined)
      data.Per_Amount = String(item.Per_Amount);
    if (item.Per_Hour !== "" && item.Per_Hour !== undefined)
      data.Per_Hour = String(item.Per_Hour);

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
