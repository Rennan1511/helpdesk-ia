"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => {},
  });

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>("dark");

  useEffect(() => {
    const saved =
      localStorage.getItem("theme");

    if (
      saved === "light" ||
      saved === "dark"
    ) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      theme
    );

    document.documentElement.classList.toggle(
      "light",
      theme === "light"
    );
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) =>
      prev === "dark"
        ? "light"
        : "dark"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(
    ThemeContext
  );
}