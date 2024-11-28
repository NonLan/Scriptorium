import { tokenBlacklist } from "@/lib/tokens";

/*
    API for logging out users.
*/
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required to log out." });
    }

    try {
        tokenBlacklist.add(refreshToken);

        // Clear cookies
        res.setHeader("Set-Cookie", [
            "accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure",
            "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure",
        ]);

        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal error." });
    }
}
