import { verifyAdmin } from "@/utils/auth";
import prisma from "@/utils/db";

/*
    API for hiding and unhiding reported blog posts and comments.
*/
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // Check for admin role
    const user = await verifyAdmin(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    const { userId, contentId, contentType, action } = req.body;

    // Check all fields
    if (!userId || !contentType || !contentId || !action) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (contentType !== "BlogPost" && contentType !== "Comment") {
        return res.status(400).json({ error: "Invalid content type." });
    }
    if (isNaN(userId) || isNaN(contentId)) {
        return res.status(400).json({ error: "Invalid user or content ID." });
    }
    if (action !== "hide" && action !== "unhide") {
        return res.status(400).json({ error: "Invalid action. Must be 'hide' or 'unhide'." });
    }

    // Set content as hidden or unhidden
    try {
        if (contentType === "BlogPost") {
            await prisma.blogPost.update({
                where: { id: Number(contentId) },
                data: { hidden: action === "hide" }
            });
        } else {
            await prisma.comment.update({
                where: { id: Number(contentId) },
                data: { hidden: action === "hide" }
            });
        }
        return res.status(200).json({ message: `Content was successfully ${action === "hide" ? "hidden" : "unhidden"}.` });

    } catch (error) {
        return res.status(500).json({ error: "Internal error." });
    }
}