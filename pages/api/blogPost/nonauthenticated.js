import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method == "GET") {
        /* 
        *  As a visitor, I want to browse and read blog posts so that I can learn from others' experiences and code examples.
        *  I want to search through posts by their title, content, tags, and also the code templates.
        */

        // Accept JSON body.
        let { title, userId, content, template, tags, pageSize, pageNumber, authorid } = req.query;    

        // Check for required fields.
        if (!pageSize || !pageNumber) {
            return res.status(400).json({ error: "Missing page information" });
        }

        pageSize = Number(pageSize);
        pageNumber = Number(pageNumber);
        if (template && template !== "null") {
            template = Number(template);
        } else {
            template = null;
        }

        if (userId) {
            userId = Number(userId);
        } else {
            userId = 0;
        }

        // Filter based on search.
        const filters = { 
            OR: [ 
                {hidden: false},  // Public view
                { hidden: true, authorid: userId }  // Show hidden posts to the author
             ]
        };

        if (title) {
            filters.title = { 
              contains: title, 
            };
        } else {
            filters.title = {not: ""};
        }
        if (content) {
            filters.content = { contains: content, };
        }
        if (tags) {
            tags = tags.split(',').map(tag => tag.trim());
            filters.tags = {
                some: {
                    name: {
                        in: tags, 
                    },
                },
            };
        }
        if (template) {
            filters.templatesid = { equals: template, };
        }
        if (authorid && authorid > 0) {
            authorid = Number(authorid);
            filters.authorid = {equals: authorid,};
        }

        // Retrieve list of posts with filters.
        try {
            const posts = await prisma.blogPost.findMany({
                where: filters,
                include: {
                    tags: true,
                },
            });

            // Sort comments by ratings
            posts.sort((a, b) => b.rating - a.rating);

            // Paginate the list of templates.
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            if (startIndex >= posts.length || pageNumber <= 0) {
                return res.status(200).json([]);
            } 
            
            return res.status(200).json(posts.slice(startIndex, Math.min(endIndex, posts.length)));
        } catch (error) {
            return res.status(500).json({ error: "Internal error." });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed" });
    }
}