import prisma from "@/utils/db";

/*
    Helper function to get grouped reasonings for reported blog posts and comments.
    Groups reports by BlogPostid or Commentid and aggregates the reasonings and reporters.
*/
export async function getReportedItemDetails(reportedItems) {
    const groupedReports = {};

    // Duplicate input items based on BlogPostid and Commentid
    const uniqueItems = Array.from(
        new Set(reportedItems.map((item) => item.BlogPostid || item.Commentid))
    ).map((id) =>
        reportedItems.find((item) => item.BlogPostid === id || item.Commentid === id)
    );

    for (const item of uniqueItems) {
        try {
            if (item.BlogPostid) {
                // Fetch blog post details along with its reports
                const blogPost = await prisma.blogPost.findUnique({
                    where: { id: parseInt(item.BlogPostid) },
                    include: { reports: { include: { reporter: true } } },
                });

                // Composite keys
                const key = `BlogPost-${blogPost.id}`;
                if (!groupedReports[key]) {
                    groupedReports[key] = {
                        id: blogPost.id.toString(),
                        type: "BlogPost",
                        title: blogPost.title,
                        content: blogPost.content,
                        hidden: blogPost.hidden,
                        reportCount: 0,
                        reports: [],
                    };
                }
                const group = groupedReports[key];
                group.reportCount = blogPost.reports.length;
                group.reports = blogPost.reports.map((report) => ({
                    id: report.id.toString(),
                    reason: report.reason,
                    reporter: report.reporter,
                }));

            } else if (item.Commentid) {
                // Fetch comment details and reports
                const comment = await prisma.comment.findUnique({
                    where: { id: parseInt(item.Commentid) },
                    include: { reports: { include: { reporter: true } } },
                });

                // Composite keys
                const key = `Comment-${comment.id}`;
                if (!groupedReports[key]) {
                    groupedReports[key] = {
                        id: comment.id.toString(),
                        type: "Comment",
                        content: comment.content,
                        hidden: comment.hidden,
                        reportCount: 0,
                        reports: [],
                    };
                }
                const group = groupedReports[key];
                group.reportCount = comment.reports.length;
                group.reports = comment.reports.map((report) => ({
                    id: report.id.toString(),
                    reason: report.reason,
                    reporter: report.reporter,
                }));
            }
        } catch (error) {
            console.error("Error fetching details for reported item:", error);
        }
    }
    return Object.values(groupedReports);
}