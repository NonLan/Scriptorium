import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method == "GET") {
        /* 
        *  As a visitor, I want to see the list of blog posts that mention a code template on the template page.
        */

        // Accept JSON body.
        const { id, pageSize, pageNumber } = req.body;

        // Check for required fields.
        if (!id || !pageSize || !pageNumber) {
            return res.status(400).json({ error: "Missing required information" });
        }

        // Retrieve list of posts.
        try {
            const posts = await prisma.blogPost.findMany({
                where: {
                    templatesid: id,
                },
            });

            // Paginate the list of templates.
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            if (startIndex >= posts.length || pageNumber <= 0) {
                return res.status(200).json([]);
            } 

            res.status(200).json(posts.slice(startIndex, Math.min(endIndex, posts.length)));
        } catch (error) {
            return res.status(400).json({ error: "Failed to retrieve posts" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed." });
    }
}
