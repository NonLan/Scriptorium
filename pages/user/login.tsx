import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { AuthContext } from "@/components/AuthContext";

export default function SignIn({ onAuthUpdate }: { onAuthUpdate: () => void }) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      body.append(key, value.toString());
    });

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        credentials: "include",
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Failed to sign in.");
        return;
      }

      onAuthUpdate();
      setIsLoggedIn(true);
      router.push("/user");
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Head>
        <title>Scriptorium - Sign-In</title>
      </Head>
      <main>
        <section className="flex flex-col gap-4 py-24 sm:py-16">
        <h2>Sign In</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="flex flex-col p-4 md:px-24 md:py-16 gap-2">
              <label htmlFor="email">Email</label>
              <input className="mb-6" type="email" name="email" id="email" placeholder="Email" required />

              <label htmlFor="password">Password</label>
              <input className="mb-6" type="password" name="password" id="password" placeholder="Password" required />

              <button type="submit" id="internal-link">Sign In</button>
              {error && <p className="text-primeRed text-xl text-center italic mt-2">Error: {error}</p>}
            </form>
        </div>

        <div className="redirect flex flex-row gap-1 md:gap-2 align-baseline">
          <p>Don't have an account?</p><Link href="./register" className="hover:underline">Create one here!</Link>
        </div>
        </section>
      </main>
    </>
  );
}
