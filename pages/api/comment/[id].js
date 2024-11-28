import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { id } = req.query;

    id = Number(id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID" });
    }

    // retrieve the comment, let them know if its empty
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: id,
        },
      });

      // if no comment found
      if (!comment) {
        return res.status(404).json({ error: "Not Found" });
      }

      const upvotes = await prisma.rating.count({
        where: {
            Commentid: id,  
            liked: true,
        },
    });

    const downvotes = await prisma.rating.count({
        where: {
            Commentid: id,
            liked: false,
        }
    });

    const c = await prisma.comment.update({
        where: {
            id,
        },
        data: {
            rating: upvotes - downvotes,
        },
    });

      // just return the comment
      return res.status(200).json(c);
    } catch (error) {
        console.log(error);
      return res
        .status(500)
        .json({ error: "Internal error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
