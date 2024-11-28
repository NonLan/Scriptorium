import prisma from "@/utils/db";

/*
    API for reporting blog posts and comments.
    Allows for users to add explanations for their report submissions.
*/
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { userId, type, id, reasoning } = req.body;

    // Verify user exists in the database
    const dbUser = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!dbUser) {
        return res.status(404).json({ error: "User not found." });
    }

    // Check all fields
    if (!type || !id || !reasoning) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (type !== "BlogPost" && type !== "Comment") {
        return res.status(400).json({ error: "Invalid type." });
    }
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id." });
    }
    if (reasoning.length < 10) {
        return res.status(400).json({ error: "Reasoning must be at least 10 characters long." });
    }

    try {
        // Verify content exists
        let content;
        if (type === "BlogPost") {
            content = await prisma.blogPost.findUnique({
                where: { id: Number(id) }
            });

            if (!content) {
                return res.status(404).json({ error: `${type} not found.` });
            }

            // Create a new report in the database
            await prisma.report.create({
                data: {
                    reporterid: userId,
                    reason: reasoning,
                    BlogPostid: Number(id),
                }
            });
        } else if (type === "Comment") {
            content = await prisma.comment.findUnique({
                where: { id: Number(id) }
            });

            if (!content) {
                return res.status(404).json({ error: `${type} not found.` });
            }

            // Create a new report in the database
            await prisma.report.create({
                data: {
                    reporterid: userId,
                    Commentid: Number(id),
                    reason: reasoning,
                }
            });
        }

        if (!content) {
            return res.status(404).json({ error: `${type} not found.` });
        }

        return res.status(201).json({ message: "Report submitted successfully." });
    } catch (error) {
        console.error("Error submitting report:", error); // Log the error for debugging
        return res.status(500).json({ error: "Internal error." });
    }
}