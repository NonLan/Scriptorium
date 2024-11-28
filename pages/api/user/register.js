import multer from "multer";
import { hashPassword } from "@/utils/auth";
import prisma from "@/utils/db";
import uploadAvatar from "@/utils/uploadAvatar";

// For avatar uploads
const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single("avatar");

const runMiddleware = (req, res, fn) =>
    new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });



/*
    API for registering new users.
*/
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }
    await runMiddleware(req, res, uploadMiddleware);

    const avatarFile = req.file;
    let avatarUrl = null;

    const parsedBody = Object.fromEntries(new URLSearchParams(req.body));
    const { firstName, lastName, email, phoneNumber, password } = parsedBody;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: "Fill out all fields." });
    }


    try {
        // Check if email or phone number already exists
        if (await prisma.user.findUnique({ where: { email } })) {
            return res.status(400).json({ error: "Email already in use." });
        }
        if (await prisma.user.findUnique({ where: { phoneNumber: BigInt(phoneNumber) } })) {
            return res.status(400).json({ error: "Phone number already in use." });
        }

        // Upload avatar
        if (avatarFile) {
            avatarUrl = await uploadAvatar(phoneNumber, avatarFile.buffer);
        } else {
            avatarUrl = "https://dl.dropboxusercontent.com/scl/fi/4e5wme63i6z8lqqfcoj6q/default-avatar.png?rlkey=fswzdav0lwj4alubznqrfho3n&e=1";
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber: BigInt(phoneNumber),
                avatar: avatarUrl,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber.toString(),
            avatar: user.avatar,
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to use Multer
    },
};