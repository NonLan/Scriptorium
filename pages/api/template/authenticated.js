import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        /* 
        *  As an authenticated user, I want to save my code as a template with a title, explanation, and tags so that I can 
        *  organize and share my work effectively.
        *  As an authenticated user, I want to use an existing code template, run or modify it, and if desired, save it as a new template
        *  with a notification that it's a forked version, so I can build on others' work.
        */

        // Accept JSON body.
        let { authorid, title, description, tags, code, language, stdin, forkedFromid } = req.body;

        // Check for required fields.
        if (!authorid || !title || !description || !code || !language) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        authorid = Number(authorid);
        forkedFromid = Number(forkedFromid);

            // some programs dont need stdin, if stdin is empty make it ""
        if (!stdin) {
            stdin = "";
        }

        // Ensure the user exists in the database.
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: authorid,
                },
            });

            if (!user) {
                return res.status(400).json({ error: "The user does not exist in database."});
            } 
        } catch (error) {
            return res.status(500).json({ error: "Internal error."});
        }

        // Crate tags where necessary.
        try {
            for (let t in tags) {
                const tag = await prisma.tag.findUnique({
                    where: {
                        name: tags[t],
                    },
                });

                if (!tag) {
                    await prisma.tag.create({
                        data: {
                            name: tags[t],
                        }
                    });
                } 
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal error."});
        }

        // Ensure the forked template exists in the database.
        if (forkedFromid) {
            try {
                const fork = await prisma.template.findUnique({
                    where: {
                        id: forkedFromid,
                    },
                });

                if (!fork) {
                    return res.status(400).json({ error: "The forked template does not exist in database."});
                } 
            } catch (error) {
                return res.status(500).json({ error: "Internal error."});
            }
        }

        try {
            // Insert template into database.
            const template = await prisma.template.create({
                data: {
                    authorid,
                    title,
                    description,
                    tags: {
                        connect: tags.map(tagName => ({ name: tagName }))
                    },
                    code,
                    language,
                    stdin,
                    forkedFromid,
                },
            });

            res.status(201).json(template);
        } catch (error) {
            res.status(500).json({ error: "Internal error."});
        }
    } else if (req.method === "GET") {
        /* 
        *  As an authenticated user, I want to view and search through my list of my saved templates, including 
        *  their titles, explanations, and tags, so that I can easily find and reuse them.
        */

        const { id, pageSize, pageNumber } = req.body;

        // Check for required fields.
        if (!id || !pageSize || !pageNumber) {
            return res.status(400).json({ error: "Missing required information" });
        }
        
        // Retrieve list of user's saved templates that arent deleted
        try {
            const templates = await prisma.template.findMany({
                where: {
                    authorid: id,
                    code: { not: "" },
                },
                select: {
                    title: true,
                    description: true,
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        
            // Paginate the list of templates.
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            if (startIndex >= templates.length || pageNumber <= 0) {
                return res.status(200).json([]);
            } 
        
            res.status(200).json(templates.slice(startIndex, Math.min(endIndex, templates.length)));
        } catch (error) {
            return res.status(400).json({ error: "Failed to retrieve user templates" });
        }
    } else if (req.method === "PUT") {
        /* 
        *  As an authenticated user, I want to edit an existing code template's title, explanation, tags, and code.
        */

        const { id, title, description, tags, code } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Template id is required" })
        }

        const updateData = { lastEdited: new Date() };
        if (title) {
            updateData.title = title;
        }
        if (description) {
            updateData.description = description;
        }
        if (tags) {
            updateData.tags = {
                connect: tags.map(tagName => ({ name: tagName })),
            };
        }
        if (code) {
            updateData.code = code;
        }

        try {
            // Update the template with id.
            const updatedTemplate = await prisma.template.update({
                where: { id: id, code: { not: "" }, },
                data: updateData,
            });

            return res.status(200).json(updatedTemplate);
        } catch (error) {
            return res.status(400).json({ error: "Failed to update template" })
        }
    } else if (req.method === "DELETE") {
        /* 
        *  As an authenticated user, I want to delete an existing code template's title, explanation, tags, and code.
        */

        const { id } = req.body;

        try {
            // Soft delete the template by emptying out everything except linked templates and blogs
            await prisma.template.update({
                where: { id: id },
                data: {      
                    title: "",            
                    description: "",      
                    tags: { set: [] },    
                    code: "",             
                    language: "",         
                    stdin: "",            
                    forkedFromid: null,   
                    lastEdited: null,
                  },
            });

            return res.status(200).json({ message: "Template deleted successfully" });
        } catch (error) {
            return res.status(400).json({ error: "Failed to delete template" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed." });
    }
}
