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


/*
  Page for viewing a user's information.
  Allows users to see their profile, edit their profile, and view their templates and blogs.
  Also allows admins to view reports.
*/
export default function UsersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return <div id="error">An error occurred: {error}</div>;
  }

  if (!user) {
    return <div id="error">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Scriptorium - Profile</title>
      </Head>
      <main>
        <section className="flex flex-col gap-4">
          <h2 className="text-left">
            Welcome Back, {user.firstName}!
          </h2>
          <div className="flex flex-col rounded-2xl border-2 border-primeBlue items-center gap-10 p-16">
            <div id="avatar" className="flex flex-col items-center gap-4">
              {user.avatar && (
                <div>
                  <img className="w-32 h-32 object-cover rounded-full"
                    src={user.avatar}
                    alt={`Avatar`}
                    style={{ width: "150px", height: "150px", borderRadius: "50%" }} 
                  />
                </div>
              )}
              <p className="text-center">{user.firstName} {user.lastName}</p>
            </div>
            <div className="flex gap-8">
              {user.accountType === "admin" && (
                <button id="internal-link" onClick={() => window.location.href = "/user/reports"}>ADMIN - Reports</button>
              )}
              <button id="internal-link" onClick={() => window.location.href = "/user/edit"}>Edit Profile</button>
            </div>

            <div className="flex gap-8">
              <button id="internal-link" onClick={() => window.location.href = `/template/search?title=&description=&tags=&page=${encodeURIComponent(1)}&user=${encodeURIComponent(user.id)}`}>My Templates</button>
              <button id="internal-link" onClick={() => window.location.href = `/blog/search?title=&content=&tags=&page=${encodeURIComponent(1)}&templateid=&user=${encodeURIComponent(user.id)}`}>My Blogs</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}