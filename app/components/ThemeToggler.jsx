"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle Dark Mode"
        title="Toggle light/dark theme"
        className="
          p-3
          rounded-full
          bg-gray-200 dark:bg-gray-700
          shadow-lg
          animate-bounce
          focus:outline-none
          hover:scale-110
          transition-transform duration-300
          flex
          items-center
          justify-center
          cursor-pointer
          hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]
        "
      >
        {currentTheme === "dark" ? (
          <HiSun className="text-yellow-400 w-6 h-6" />
        ) : (
          <HiMoon className="text-gray-800 w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggler;