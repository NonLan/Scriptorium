import fs from "fs/promises";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

// Read the defaultAdmin.json file
async function loadDefaultAdmin() {
  const defaultAdminData = await fs.readFile("./defaultAdmin.json", "utf-8");
  return JSON.parse(defaultAdminData);
}

// Hashes password
async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function creatUser() {
  const defaultAdmin = await loadDefaultAdmin();
  const { firstName, lastName, email, phoneNumber, password } = defaultAdmin;

  // Check input errors
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return console.log("JSON is missing params");
  }
  if (await prisma.user.findUnique({ where: { email: email } })) {
    return console.log("Admin already added");
  }

  // Add user to DB
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: await hashPassword(password),
        accountType: "admin",
      },
    });
    return console.log("User added");
  } catch (error) {
    console.error(error);
    return console.log("Couldn't add user");
  }
}

creatUser();
