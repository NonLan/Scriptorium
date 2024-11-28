import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method == "GET") {
        // Retrieve list of tags.
        try {
            const tags = await prisma.tag.findMany();

            const tagStrings = tags.map(tag => tag.name);

            return res.status(200).json(tagStrings);            
        } catch (error) {
            return res.status(400).json({ error: "Failed to retrieve tags" });
        }
    } else {
        // Throw method invalid error.
        res.status(405).json({ error: "Method not allowed" });
    }
}