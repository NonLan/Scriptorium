import React, { useState, useEffect } from "react";
import Head from "next/head";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountType: string;
};

type ReportDetail = {
  id: number;
  reason: string;
  reporter: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type Report = {
  id: number;
  title: string;
  type: "BlogPost" | "Comment";
  content: string;
  reportCount: number;
  reports: ReportDetail[];
  hidden: boolean;
};


/*
  Page for admin to view and manage reports.
*/
export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error instanceof Error ? error.message : String(error));
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.accountType === "admin") {
      const fetchReports = async () => {
        try {
          const res = await fetch("/api/admin/reports", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch reports");
          }
          const data: Report[] = await res.json();
          setReports(data);
        } catch (error) {
          console.error("Error fetching reports:", error);
          setError(error instanceof Error ? error.message : String(error));
        }
      };
      fetchReports();
    }
  }, [user]);

  if (error) {
    return <div id="error">An error occurred: {error}</div>;
  }
  if (!user) {
    return <div id="error">Loading...</div>;
  }
  if (user.accountType !== "admin") {
    return <div id="error">Access denied.</div>;
  }

  const handleToggleHide = async (report: Report) => {
    const action = report.hidden ? "unhide" : "hide";

    try {
      const res = await fetch("/api/admin/hideContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          contentId: report.id,
          contentType: report.type,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`${report.type} ${report.id} is ${action}d.`);

        setReports((prevReports) =>
          prevReports.map((r) =>
            r.id === report.id ? { ...r, hidden: !report.hidden } : r
          )
        );
      } else {
        const errorData = await res.json();
        alert(`Failed to ${action} ${report.type}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error toggling hide state:", error);
      alert("An error occurred while toggling the hide state.");
    }
  };

  // Calculate the indices for the current page
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>
      <main>
        <section className="flex flex-col gap-4">
          <h2 className="text-left">User Reports</h2>
          <div className="flex flex-col rounded-2xl border-2 border-primeBlue p-2 md:p-8 gap-8 md:gap-16">
            {currentReports.length === 0 ? (
              <p>No reports available.</p>
            ) : (
              currentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 md:p-16 rounded-2xl border-2 border-primeRed shadow-sm"
                >
                  <h3 className="font-semibold mb-2">
                    {report.type} - ID #{report.id}
                  </h3>
                  {report.title && (
                    <p>
                      <strong>Title:</strong> {report.title}
                    </p>
                  )}
                  <p>
                    <strong>Content:</strong>{" "}
                    {report.content.length > 200
                      ? `${report.content.substring(0, 200)} (...)`
                      : report.content}
                  </p>
                  <p className="my-2">
                    <strong>Total Reports:</strong> {report.reports.length}
                  </p>
                  <h4 className="font-semibold">Reasonings:</h4>
                  <ul className="mb-8">
                    {report.reports.map((detail, index) => (
                      <li key={index} className="mb-2">
                        <p>
                          <strong>Reason:</strong> {detail.reason}
                        </p>
                        <p>
                          <strong>Reporter:</strong> {detail.reporter.firstName}{" "}
                          {detail.reporter.lastName} ({detail.reporter.email})
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleToggleHide(report)}
                    id="internal-link"
                  >
                    {report.hidden ? "Unhide" : "Hide"} {report.type}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pages */}
          <div className="flex flex-row justify-center gap-8 md:gap-24 items-center mt-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-6 py-4 text-lg text-light bg-primeRed rounded-2xl disabled:opacity-50">
              Back
            </button>
            <span className="text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-6 py-4 text-lg text-light bg-primeRed rounded-2xl disabled:opacity-50">
              Next
            </button>
          </div>
        </section>
      </main>
    </>
  );
}