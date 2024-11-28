import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { id } = req.query;

    id = Number(id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID" });
    }

    // retrieve the post, let them know if its empty
    try {
      const post = await prisma.blogPost.findUnique({
        where: {
          id: id,
        },
        include: {
          tags: true
        }
      });

      // if no template found
      if (!post) {
        return res.status(404).json({ error: "Not Found" });
      }

      // if template is soft deleted
      if (post.title === "") {
        return res.status(200).json({ message: "Deleted template" });
      }

      // just return the template
      return res.status(200).json(post);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Failed to retrieve user template" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
