import prisma from "@/utils/db";
import { verifyAdmin } from "@/utils/auth";
import { getReportedItemDetails } from "@/utils/db-admin";

function bigIntToString(obj) {
    if (typeof obj === 'bigint') {
        return obj.toString();
    } else if (Array.isArray(obj)) {
        return obj.map(bigIntToString);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, bigIntToString(value)])
        );
    }
    return obj;
}


export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const user = await verifyAdmin(req, res);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    try {
        const reportedBlogPosts = await prisma.report.findMany({
            where: {
                BlogPostid: { not: null }
            },
            select: {
                BlogPostid: true
            }
        });

        const reportedComments = await prisma.report.findMany({
            where: {
                Commentid: { not: null }
            },
            select: {
                Commentid: true
            }
        });

        const reportedItems = [
            ...reportedBlogPosts.map(post => ({ ...post, type: 'BlogPost', BlogPostid: post.BlogPostid })),
            ...reportedComments.map(comment => ({ ...comment, type: 'Comment', Commentid: comment.Commentid }))
        ];

        const detailedReports = await getReportedItemDetails(reportedItems);

        const response = detailedReports.map(report => ({
            ...report,
            id: report.id,
            reportCount: report.reportCount,
            reports: report.reports.map(r => ({
                ...r,
                id: r.id,
                reason: r.reason,
                reporter: {
                    ...r.reporter,
                    id: r.reporter.id,
                }
            }))
        }));

        // Use the utility function to convert BigInt to string throughout the entire response object
        const sanitizedResponse = bigIntToString(response);

        return res.status(200).json(sanitizedResponse);

    } catch (error) {
        console.error("Error fetching reported items:", error);
        return res.status(500).send("Internal Server Error");
    }
}