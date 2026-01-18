import { prisma } from "@/lib/prisma";

export async function PUT(request) {
  const { data } = await request.json();
  const frquencyToUpdate = data.values[0].Id_PayFrequency;
  const splitKey = data.combinedKeys.split("-")[0];
  const splitKeyFrequency = data.combinedKeys.split("-")[1];

  const validateExisting = await prisma.Default_Concepts.findFirst({
    where: {
      Id_Concept: String(splitKey),
      Id_PayFrequency: Number(frquencyToUpdate),
    },
  });
  if (validateExisting) {
    return new Response(
      JSON.stringify({
        error: "This concept-frequency combination already exists",
      }),
      { status: 400 }
    );
  }

  const updatedDefaultConcept = await prisma.Default_Concepts.updateMany({
    where: {
      Id_Concept: String(splitKey),
      Id_PayFrequency: Number(splitKeyFrequency),
    },
    data: {
      Id_PayFrequency: Number(frquencyToUpdate),
    },
  });

  return new Response(JSON.stringify(updatedDefaultConcept), { status: 200 });
}
