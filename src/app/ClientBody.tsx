"use client";

import { useEffect, useState } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("dark");
  
  // Initialize with dark mode by default, but check localStorage
  useEffect(() => {
    // Check if theme preference is stored
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } else {
      // Default to dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    
    // This runs only on the client after hydration
    document.body.className = "antialiased";
    
    // Listen for theme changes from other components
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme && currentTheme !== theme) {
        setTheme(currentTheme);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  return (
    <body className={`antialiased ${theme}`} suppressHydrationWarning>
      {children}
    </body>
  );
}
