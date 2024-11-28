import "@/styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from 'next/head';
import ThemeProvider from '@/components/ThemeProvider';
import { CodeProvider } from "@/components/codeContext";
import { Header, Footer } from "@/components/navbars";
import { AuthProvider } from "@/components/AuthContext";


export default function App({ Component, pageProps }: AppProps) {
  const [authKey, setAuthKey] = useState<number>(0);

  const handleAuthUpdate = () => {
    setAuthKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
        try {
            const response = await fetch("/api/user/refresh", {
                method: "POST",
                credentials: "include", // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error("Failed to refresh access token");
            }

            console.log("Access token refreshed.");
        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    };

    const intervalId = setInterval(refreshAccessToken, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(intervalId);
}, []);

  return (
    <>
      <Head>
        <title>Scriptorium</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Scriptorium is a platform for writers to share their work and get feedback." />
        <meta name="keywords" content="writing, feedback, community, literature" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <AuthProvider>
        <ThemeProvider>
          <CodeProvider>
            <main>
              <Header key={authKey} />
              <div>
                <Component {...pageProps} onAuthUpdate={handleAuthUpdate} />
              </div>
              <Footer />
            </main>
          </CodeProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}