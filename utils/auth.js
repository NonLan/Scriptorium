import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "@/lib/tokens";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Hashes password
export async function hashPassword(password) {
  return await bcrypt.hash(password, parseInt(BCRYPT_SALT_ROUNDS, 10));
}

// Compares password with hash
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generates access token
export function generateAccessToken(obj) {
  return jwt.sign(
      { id: obj.id, email: obj.email, role: obj.role }, // Ensure `email` or `id` is included
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1hr" }
  );
}

// Generates refresh token
export function generateRefreshToken(obj) {
  return jwt.sign(
      { id: obj.id, email: obj.email }, // Include unique identifiers
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
  );
}

// Checks token and returns user data
export function verifyToken(token) {
  if (!token) {
    console.error("Token is missing.");
    return null;
  }

  if (isTokenBlacklisted(token)) {  
    console.error("Token is blacklisted.");
    return null;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

// Returns new access token if refresh token is valid
export function refreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });
    return { accessToken: newAccessToken };

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { error: "Refresh token expired." };
    } else if (error.name === "JsonWebTokenError") {
      return { error: "Invalid token." };
    } else {
      return { error: "Token verification failed." };
    }
  }
}

// Returns new data to update user
export async function updateData(
  firstName,
  lastName,
  phoneNumber,
  password,
  avatar
) {
  const updatedData = {};

  if (firstName) updatedData.firstName = firstName;
  if (lastName) updatedData.lastName = lastName;
  if (phoneNumber) updatedData.phoneNumber = phoneNumber;
  if (password) updatedData.password = await hashPassword(password);
  if (avatar) updatedData.avatar = avatar;

  return updatedData;
}

// Verifies a user using the token stored in cookies
export function verifyUser(req) {
  const token = req.cookies?.accessToken;
  if (!token) return null;

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return user;
  } catch (error) {
    console.error("Error verifying user token:", error);
    return null;
  }
}

// Verifies the user is an admin, returns user data if valid
export async function verifyAdmin(req) {
  const user = verifyUser(req);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}