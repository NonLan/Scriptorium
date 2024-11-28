import { verifyToken } from "@/utils/auth";
import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Prevent caching (removes 304)
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Access token missing." });
  }

  try {
    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired access token." });
    }

    const userData = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        accountType: true,
      },
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}