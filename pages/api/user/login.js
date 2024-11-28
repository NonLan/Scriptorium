import { comparePassword, generateAccessToken, generateRefreshToken } from "@/utils/auth";
import prisma from "@/utils/db";

/*
    API for logging in users.
*/
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const payload = { id: user.id, email: user.email, role: user.accountType };
        // Generate tokens
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);        

        res.setHeader("Set-Cookie", [
            `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`,
            `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`,
          ]);
          
        return res.status(200).json({ message: "Logged in successfully." });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal error." });
    }
}
