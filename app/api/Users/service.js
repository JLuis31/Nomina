import {
  findUserById,
  findUserByEmail,
  createUser,
} from "./InformationUsers/repository";
import bcrypt from "bcrypt";

export async function getUserInformation(idUser) {
  const user = await findUserById(idUser);
  return user;
}

export async function registerUser({ Name, Email, Password }) {
  const userExists = await findUserByEmail(Email);
  if (userExists) {
    return { error: "User with this email already exists", status: 409 };
  }
  const encryptedPassword = await bcrypt.hash(Password, 10);
  await createUser({ Name, Email, Password: encryptedPassword });
  return { message: "User registered successfully", status: 201 };
}
