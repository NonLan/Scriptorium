import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "./AuthContext";

export const DefaultFooter = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    return (
        <footer>
            <div className="logo">
                <button onClick={() => router.push("/")} className="flex items-center gap-4">
                    <img src="/logo.svg" alt="Scriptorium" className="w-12" />
                    <div id="footer-title" className="flex flex-col items-begin text-left">
                        <h2 className="text-2xl text-left">Scriptorium</h2>
                        <p className="text-light text-sm">The new way of writing code.</p>
                    </div>
                </button>
            </div>
            <div className="flex flex-col items-end justify-end gap-1">
                <Link href="/ide" className="footer-link">IDE</Link>
                <Link href="/templates" className="footer-link">Templates</Link>
                <Link href="/blog/search" className="footer-link">Blogs</Link>
                {isLoggedIn ? (
                    <> <Link href="/user" className="footer-link">Profile</Link> </>
                ) : (
                    <> <Link href="/user/register" className="footer-link">Register</Link> </>
                )}
            </div>
            <p className="text-light text-xs">Copyright © 2024 Group 11026</p>
            <Link href="#" className="footer-link justify-end">Back to Top</Link>
    </footer>
    )
}


export const IdeFooter = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    const leavePage = (e: React.MouseEvent<HTMLElement>, url: string) => {
        e.preventDefault();
        const isConfirmed = window.confirm(
            "Return to home? Unsaved changes will be lost"
        );

        if (isConfirmed) {
            router.push(url);
        }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";  // Apparently required for some browsers...
    };

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <footer>
            <div className="logo">
                <button onClick={(e) => leavePage(e, "/ide")} className="flex items-center gap-4">
                    <img src="/logo.svg" alt="Scriptorium" className="w-12" />
                    <div id="footer-title" className="flex flex-col items-begin text-left">
                        <h2 className="text-2xl text-left">Scriptorium</h2>
                        <p className="text-light text-sm">The new way of writing code.</p>
                    </div>
                </button>
            </div>
            <div className="flex flex-col items-end justify-end gap-1">
                <Link className="footer-link" href="/" onClick={(e) => leavePage(e, "/ide")}>IDE</Link>
                <Link className="footer-link" href="/" onClick={(e) => leavePage(e, "/templates")}>Templates</Link>
                <Link className="footer-link" href="/" onClick={(e) => leavePage(e, "/blog/search")}>Blogs</Link>
                {isLoggedIn ? (
                    <> <Link className="footer-link" href="/" onClick={(e) => leavePage(e, "/user")}>Profile</Link> </>
                ) : (
                    <> <Link className="footer-link" href="/" onClick={(e) => leavePage(e, "/user/register")}>Register</Link> </>
                )}
            </div>
            <p className="text-light text-xs">Copyright © 2024 Group 11026</p>
            <Link href="#" className="footer-link justify-end">Back to Top</Link>
    </footer>
    )
}