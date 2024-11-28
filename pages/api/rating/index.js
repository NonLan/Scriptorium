import prisma from "@/utils/db";

/* 
*  As an authenticated user, I want to rate blog posts and comments.
*/
export default async function handler(req, res) {
    if (req.method === 'GET') {
        let { authorid, BlogPostid, Commentid } = req.query;
        authorid = Number(authorid);

        if (!authorid || authorid === undefined || (BlogPostid && Commentid) || (!BlogPostid && !Commentid)) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        if (BlogPostid) {
            BlogPostid = Number(BlogPostid);
        } else {
            Commentid = Number(Commentid);
        }

        try {
            const rating = await prisma.rating.findMany({
                where: {
                    authorid,
                    BlogPostid,
                    Commentid,
                },
            });
 
            if (rating.length === 0) {
                return res.status(200).json({upvote: false, downvote: false});
            } else if (rating.length > 1) {
                return res.status(409).json({error: "Rating discrepancy."});
            }

            if (rating[0].liked === true) {
                return res.status(200).json({upvote: true, downvote: false});
            } else {
                return res.status(200).json({upvote: false, downvote: true});
            }
        } catch(error) {
            console.log(error);
            return res.status(500).json({error: "Internal error"});
        }
    } else if (req.method === "POST") {
       // Accept JSON body.
       const { authorid, liked, BlogPostid, Commentid } = req.body;

       if (!authorid || liked === undefined || (BlogPostid && Commentid) || (!BlogPostid && !Commentid)) {
            return res.status(400).json({ error: "Missing required fields." });
       }

        try {
            // Add the rating to the db
            await prisma.rating.create({
                data: {
                    authorid,
                    liked,
                    BlogPostid,
                    Commentid,
                }
            });

            // Update post or comment rating.
            if (BlogPostid) {
                const upvotes = await prisma.rating.count({
                    where: {
                        BlogPostid,  
                        liked: true,
                    },
                });

                const downvotes = await prisma.rating.count({
                    where: {
                        BlogPostid,
                        liked: false,
                    }
                })

                const post = await prisma.blogPost.update({
                    where: {
                        id: BlogPostid,
                    },
                    data: {
                        rating: upvotes - downvotes,
                    },
                });

                return res.status(201).json(post);
            } else {
                const upvotes = await prisma.rating.count({
                    where: {
                        Commentid,  
                        liked: true,
                    },
                });

                const downvotes = await prisma.rating.count({
                    where: {
                        Commentid,
                        liked: false,
                    }
                })

                const comment = await prisma.comment.update({
                    where: {
                        id: Commentid,
                    },
                    data: {
                        rating: upvotes - downvotes,
                    },
                });

                return res.status(201).json(comment);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal error" });
        }
    } else if (req.method === 'DELETE') {
        // Accept JSON body.
        let { authorid, BlogPostid, Commentid } = req.body;
        if (!authorid || (BlogPostid && Commentid) || (!BlogPostid && !Commentid)) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        authorid = Number(authorid);
        BlogPostid = Number(BlogPostid);
        Commentid = Number(Commentid);

        try {
        const rating = await prisma.rating.findMany({
            where: {
                authorid,
                BlogPostid,
                Commentid,
            },
        });

        if (rating.length === 0) {
            return res.status(400).json({error: "Field is wrong."})
        }

        for (let r of rating) {
            await prisma.rating.delete({
                where: {
                    id: r.id,
                },
            });
        }

        // Update post or comment rating.
        if (BlogPostid) {
            const upvotes = await prisma.rating.count({
                where: {
                    BlogPostid,  
                    liked: true,
                },
            });
        
            const downvotes = await prisma.rating.count({
                where: {
                    BlogPostid,
                    liked: false,
                }
            })
        
            const post = await prisma.blogPost.update({
                where: {
                    id: BlogPostid,
                },
                data: {
                    rating: upvotes - downvotes,
                },
            });
        
            return res.status(201).json(post);
        } else {
            const upvotes = await prisma.rating.count({
                where: {
                    Commentid,  
                    liked: true,
                },
            });
        
            const downvotes = await prisma.rating.count({
                where: {
                    Commentid,
                    liked: false,
                }
            });
        
            const comment = await prisma.comment.update({
                where: {
                    id: Commentid,
                },
                data: {
                    rating: upvotes - downvotes,
                },
            });
        
            return res.status(201).json(comment);
        }
        } catch(error) {
            console.log(error);
            return res.status(500).json({ error: "Internal error." });
        }
    } else {
        // Throw method invalid error.
        return res.status(405).json({ error: "Method not allowed." });
    }
}