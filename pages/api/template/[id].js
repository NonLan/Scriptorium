import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { id } = req.query;

    id = Number(id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID" });
    }

    // retrieve the template, let them know if its empty
    try {
      const template = await prisma.template.findUnique({
        where: {
          id: id,
        },
        include: {
          tags: true
        }
      });

      // if no template found
      if (!template) {
        return res.status(404).json({ error: "Not Found" });
      }

      // if template is soft deleted
      if (template.code === "") {
        return res.status(200).json({ message: "Deleted template" });
      }

      // just return the template
      return res.status(200).json(template);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Failed to retrieve user template" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
