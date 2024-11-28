import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);