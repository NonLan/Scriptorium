import { generateAccessToken, verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ error: "No refresh token provided." });
    }

    try {
        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token
        const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });

        // Update cookies
        res.setHeader("Set-Cookie", [
            `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
        ]);

        return res.status(200).json({ message: "Token refreshed successfully." });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(401).json({ error: "Invalid refresh token." });
    }
}