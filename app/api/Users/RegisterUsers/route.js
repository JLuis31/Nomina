import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();

  const userExists = await prisma.Users.findFirst({
    where: { Email: body.Email },
  });

  if (userExists) {
    return new Response(
      JSON.stringify({ error: "User with this email already exists" }),
      { status: 409 }
    );
  }
  const encryptedPassword = await bcrypt.hash(body.Password, 10);
  const selectedDepartment =
    body.Department === "Human Resources"
      ? "1"
      : body.Department === "Finance"
      ? "2"
      : body.Department === "IT"
      ? "3"
      : null;
  console.log("Selected Department ID:", body);
  const newUser = await prisma.Users.create({
    data: {
      Name: body.Name,
      Email: body.Email,
      Id_Department: selectedDepartment,
      Password: encryptedPassword,
    },
  });
  return new Response(JSON.stringify(newUser), { status: 201 });
}
