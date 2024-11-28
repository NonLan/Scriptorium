import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeButton from "./ThemeSwitcher";
import { AuthContext } from "./AuthContext";
import { useCode } from "./codeContext";

/*
  Default header for most web pages of the application.
*/
export const DefaultHeader = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle Menu for Mobile
  const toggleMenu = () => {
    console.log(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/logout", { method: "POST", credentials: "include" });
      if (response.ok) {
        setIsLoggedIn(false);
        alert("You have been signed out.");
        router.push("/");
      } else {
        alert("Failed to sign out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred.");
    }
  };

  return (
    <header className="flex justify-between items-center p-4">
      <div className="logo flex flex-row h-full items-center">
        <button onClick={() => router.push("/")} className="flex items-center space-x-1">
          <img src="/logo.svg" alt="Scriptorium" className="text-xl nav-icon" />
          <h2 className="text-sm flex sm:hidden">Scriptorium</h2>
        </button>
      </div>
      <nav className="space-x-4 hidden sm:flex">
        <Link id="nav-link" href="/ide">IDE</Link>
        <Link id="nav-link" href="/template/search">Templates</Link>
        <Link id="nav-link" href="/blog/search">Blogs</Link>
        {!isLoggedIn ? (
          <>
            <Link id="nav-link" href="/user/login">Sign In</Link>
            <Link id="nav-link" href="/user/register">Register</Link>
          </>
        ) : (
          <>
            <Link id="nav-link" href="/user">Profile</Link>
            <button id="nav-link" onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </nav>
      <div className="darkmode nav-icon hidden sm:flex">
        <ThemeButton />
      </div>
      <button onClick={toggleMenu} id="hamburger-menu" className="sm:hidden text-light focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col z-50 absolute top-16 right-6 px-4 py-2 rounded-b-xl bg-primeRed justify-end items-end">
          <Link href="/ide">IDE</Link>
          <Link href="/template/search">Templates</Link>
          <Link href="/blog/search">Blogs</Link>
          {!isLoggedIn ? (
            <>
              <Link href="/user/login">Sign In</Link>
              <Link href="/user/register">Register</Link>
            </>
          ) : (
            <>
              <Link href="/user">Profile</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          )}
          <div className="darkmode nav-icon pt-2">
            <ThemeButton />
          </div>
        </div>
      )}
    </header>
  );
};


/*
  Header for the IDE page.
*/
export const IdeHeader = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {setId, setTags, setAuthorId, setCode, setLanguage, setTitle, setDescription, setForkFrom, setStdin} = useCode();

  // Toggle Menu for Mobile
  const toggleMenu = () => {
    console.log(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  }
  
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/logout", { method: "POST", credentials: "include" });
      if (response.ok) {
        setIsLoggedIn(false);
        alert("You have been signed out.");
        router.push("/");
      } else {
        alert("Failed to sign out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred.");
    }
  };

  const leavePage = (e: React.MouseEvent<HTMLElement>, url: string) => {
    e.preventDefault();

    // Empty out all the IDE info
    setId(-1);
    setTags([]);
    setAuthorId(-1);
    setCode("");
    setLanguage("");
    setTitle("");
    setDescription("");
    setForkFrom(-1);
    setStdin("");

    const isConfirmed = window.confirm(
      "Leave this page? Unsaved changes will be lost."
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
    <header className="flex justify-between items-center p-4">
      <div className="logo flex items-center">
      <button onClick={() => router.push("/")} className="flex items-center space-x-1">
          <img src="/logo.svg" alt="Scriptorium" className="text-xl nav-icon" />
          <h2 className="text-sm flex sm:hidden">Scriptorium</h2>
        </button>
      </div>
      <nav className="flex space-x-4 hidden sm:flex">
        <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/ide")}>IDE</Link>
        <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/template/search")}>Templates</Link>
        <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/blog/search")}>Blogs</Link>
        {!isLoggedIn ? (
          <>
            <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/user/login")}>Sign In</Link>
            <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/user/register")}>Register</Link>
          </>
        ) : (
          <>
            <Link id="nav-link" href="/user" onClick={(e) => leavePage(e, "/user")}>Profile</Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </nav>
      <div className="darkmode nav-icon hidden sm:flex">
        <ThemeButton />
      </div>
      <button onClick={toggleMenu} id="hamburger-menu" className="sm:hidden text-light focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col z-50 absolute top-16 right-6 px-4 py-2 rounded-b-xl bg-primeRed justify-end items-end">
          <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/ide")}>IDE</Link>
          <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/templates")}>Templates</Link>
          <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/blog/search")}>Blogs</Link>
          {!isLoggedIn ? (
            <>
              <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/user/login")}>Sign In</Link>
              <Link id="nav-link" href="/" onClick={(e) => leavePage(e, "/user/register")}>Register</Link>
            </>
          ) : (
            <>
              <Link id="nav-link" href="/user" onClick={(e) => leavePage(e, "/user")}>Profile</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          )}
          <div className="darkmode nav-icon pt-2">
            <ThemeButton />
          </div>
        </div>
      )}
    </header>
  );
};