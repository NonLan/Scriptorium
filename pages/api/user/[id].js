import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { id } = req.query;

    id = Number(id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID" });
    }

    // retrieve the user
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      // return user's name
      return res.status(200).json({"name": user.firstName + " " + user.lastName});
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
