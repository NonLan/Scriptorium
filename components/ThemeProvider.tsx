// components/ThemeProvider.js
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { ReactNode } from "react"; // Import ReactNode type

const ThemeProvider = ({ children }: { children:ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
};

export default ThemeProvider;
