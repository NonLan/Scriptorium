import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method == "GET") {
        /* 
        *  As a visitor, I want to search through all available templates by title, tags, or content so that I can 
        *  quickly find relevant code for my needs.
        */

        // Accept JSON body.
        let { title, description, tags, authorid, pageSize, pageNumber } = req.query;        

        // Check for required fields.
        if (!pageSize || !pageNumber) {
            return res.status(400).json({ error: "Missing page information" });
        }

        pageSize = Number(pageSize);
        pageNumber = Number(pageNumber);

        // Filter based on search.
        const filters = {};
        if (title) {
          filters.title = { 
            contains: title, 
          };
        } else {
            filters.title = {not: ""};
        }
        if (description) {
          filters.description = { contains: description, };
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
        if (authorid) {
            authorid = Number(authorid);
            filters.authorid = {equals: authorid,};
        }

        // add filter to ignore soft deleted entries
        filters.code = { not: "", }

        // Retrieve list of templates with filters.
        try {
            const templates = await prisma.template.findMany({
                where: filters,
                include: {
                    tags: true,
                },
            });

            // Paginate the list of templates.
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            if (startIndex >= templates.length || pageNumber <= 0) {
                return res.status(200).json([]);
            }             

            return res.status(200).json(templates.slice(startIndex, Math.min(endIndex, templates.length)));
        } catch (error) {
            return res.status(500).json({ error: "Failed to retrieve user templates" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed" });
    }
}