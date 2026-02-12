import { prisma } from "@/lib/prisma";

export async function findUserById(idUser) {
  return prisma.Users.findFirst({
    where: { Id_User: parseInt(idUser) },
    select: {
      Name: true,
      Id_Department: true,
    },
  });
}

export async function findUserByEmail(email) {
  return prisma.Users.findFirst({ where: { Email: email } });
}

export async function createUser({ Name, Email, Password }) {
  return prisma.Users.create({
    data: { Name, Email, Password },
  });
}
