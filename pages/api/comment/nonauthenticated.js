import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method == "GET") {
        /* 
        *  As a visitor, I want to see the list of comments sorted by their ratings.
        */

        // Accept JSON body.
        let { userId, commentid, blogPostid, pageSize, pageNumber } = req.query;

        // Check for required fields.
        if (!pageSize || !pageNumber || (!commentid && !blogPostid)) {
            return res.status(400).json({ error: "Missing page information" });
        }

        if (blogPostid && commentid) {
            return res.status(400).json({ error: "Response field is unclear" });
        }

        if (userId) {
            userId = Number(userId);
        } else {
            userId = 0;
        }

        pageSize = Number(pageSize);
        pageNumber = Number(pageNumber);

        // Filter based on search.
        const filters = {
            OR: [ 
                {hidden: false},  // Public view
                { hidden: true, authorid: userId }  // Show hidden posts to the author
             ]
        };
        
        if (blogPostid) {
            blogPostid = Number(blogPostid)
            filters.BlogPostid = { equals: blogPostid };
        }
        if (commentid) {
            commentid = Number(commentid)
            filters.Commentid = { equals: commentid };
        }

        // Retrieve list of comments.
        try {
            if (commentid) {
                const comments = await prisma.comment.findMany({
                    where: filters,
                });
                
                // Sort comments by ratings
                comments.sort((a, b) => b.rating - a.rating);

                // Paginate the comments.
                const startIndex = (pageNumber - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                if (startIndex >= comments.length || pageNumber <= 0) {
                    return res.status(200).json([]);
                } 

                const userPromises = comments.slice(startIndex, Math.min(endIndex, comments.length)).map(async (comment) => {
                    const user = await prisma.user.findUnique({
                        where: {
                          id: comment.authorid,
                        },
                    })
                    comment.username = user.firstName + " " + user.lastName;
                    return comment;
                });
                const commentsWithUsers = await Promise.all(userPromises);

                return res.status(200).json(commentsWithUsers);
            } else {
                const comments = await prisma.comment.findMany({
                    where: filters,
                });
                
                // Sort comments by ratings/
                comments.sort((a, b) => b.rating - a.rating);

                // Paginate the comments.
                const startIndex = (pageNumber - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                if (startIndex >= comments.length || pageNumber <= 0) {
                    return res.status(200).json([]);
                } 

                const userPromises = comments.slice(startIndex, Math.min(endIndex, comments.length)).map(async (comment) => {
                    const user = await prisma.user.findUnique({
                        where: {
                          id: comment.authorid,
                        },
                    })
                    comment.username = user.firstName + " " + user.lastName;
                    return comment;
                });
                const commentsWithUsers = await Promise.all(userPromises);

                return res.status(200).json(commentsWithUsers);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal error" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed" });
    }
}