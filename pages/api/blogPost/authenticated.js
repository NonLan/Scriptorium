import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        /* 
        *  As an authenticated user, I want to create blog posts.
        */

        // Accept JSON body.
        let { author, title, content, tags, template } = req.body;

        // Check for required fields.
        if (!author || !title || !content || !tags || title === "") {
            return res.status(400).json({ error: "Missing required fields" });
        }
        author = Number(author);
        template = Number(template);

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
            
        // Ensure the template exists in the database.
        if (template) {
            try {
                const t = await prisma.template.findUnique({
                    where: {
                        id: template,
                    },
                });

                if (!t || t.title === "") {
                    return res.status(400).json({ error: "The template does not exist in database."});
                }
            } catch (error) {
                return res.status(500).json({ error: "Internal error."});
            }
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
            return res.status(500).json({ error: "Internal error."});
        }

        try {
            // Insert post into database.
            const post = await prisma.blogPost.create({
                data: {
                    authorid: author,
                    title,
                    content,
                    tags: {
                        connect: tags.map(tagName => ({ name: tagName }))
                    },
                    templatesid: template,
                    rating: 0,
                    hidden: false
                },
            });

            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: "Internal error."});
        }
    } else if (req.method === "PUT") {
        /* 
        *  As a user, I want to edit blog posts.
        */

        let { id, title, content, tags } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Post id is required" })
        }
        if (title === "" || content === "") {
            return res.status(400).json({ error: "Title and content cannot be empty if submitted" })
        }
        id = Number(id);

        const updateData = { lastEdited: new Date() };
        if (title) {
            updateData.title = title;
        }
        if (content) {
            updateData.content = content;
        }
        if (tags) {
            // Create tags where necessary.
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
                return res.status(500).json({ error: "Internal error."});
            }
            updateData.tags = tags;
        }

        try {
            // Update the post with id.
            const updatedPost = await prisma.blogPost.update({
                where: { 
                    id: id,
                    title: { not: "" },
                },
                data: {
                    ...updateData,
                    tags: {
                        set: [], 
                        connectOrCreate: tags.map(tagName => ({
                            where: { name: tagName },
                            create: { name: tagName },
                        })),
                    },
                },
            });

            return res.status(200).json(updatedPost);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal error." })
        }
    } else if (req.method === "DELETE") {
        /* 
        *  As a user, I want to delete blog posts.
        */

        const { id } = req.body;

        try {
            // Soft delete the template with id.
            await prisma.blogPost.update({
                where: { id: id },
                data: {
                    title: "",
                    content: "",
                    tags: { set: [] },
                    lastEdited: null,
                }
            });

            return res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Internal error" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed." });
    }
}
