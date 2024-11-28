import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        /* 
        *  As an authenticated user, I want to comment or reply to existing comments on a blog post.
        */

        // Accept JSON body.
        const { author, content, BlogPostid, Commentid } = req.body;

        // Check for required fields.
        if (!author || !content || (!BlogPostid && !Commentid)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (BlogPostid && Commentid) {
            return res.status(400).json({ error: "Response field is unclear" });
        }

        // Ensure the user exists in the database.
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: author,
                },
            });

            if (!user) {
                return res.status(400).json({ error: "The user does not exist in database."});
            }
        } catch (error) {
            return res.status(500).json({ error: "Internal error."});
        }
        
        try {
            // Insert comment into database.
            const comment = await prisma.comment.create({
                data: {
                    authorid: author,
                    content,
                    rating: 0,
                    BlogPostid,
                    Commentid,
                },
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ error: "Internal error."});
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed." });
    }
}
