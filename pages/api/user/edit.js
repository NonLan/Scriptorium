import prisma from "@/utils/db";
import { verifyToken, updateData, comparePassword, hashPassword } from "@/utils/auth";
import uploadAvatar from "@/utils/uploadAvatar";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ error: "Not authorized. Missing access token." });
    }

    const decoded = verifyToken(accessToken);
    if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    const processFormData = () =>
        new Promise((resolve, reject) => {
            upload.single("avatar")(req, {}, (err) => {
                if (err) return reject(err);
                resolve(req);
            });
        });

    try {
        await processFormData();

        const { firstName, lastName, currentPassword, newPassword } = req.body;
        const avatar = req.file;

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Validate current password if newPassword is provided
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    error: "Please provide your current password to update it.",
                });
            }

            const isPasswordMatch = await comparePassword(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ error: "Invalid current password." });
            }

            user.password = await hashPassword(newPassword);
        }

        // Upload avatar
        let avatarUrl = user.avatar;
        if (avatar) {
            avatarUrl = await uploadAvatar(user.id, avatar.buffer);
        }

        const updatedUser = await prisma.user.update({
            where: { email: user.email },
            data: {
                firstName,
                lastName,
                password: user.password,
                avatar: avatarUrl,
            },
        });

        res.status(200).json({
            message: "Profile updated successfully.",
            updatedUser: {
                ...updatedUser,
                id: updatedUser.id.toString(),
                phoneNumber: updatedUser.phoneNumber.toString(),
            },
        });
    } catch (error) {
        console.error("Error during profile update:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}