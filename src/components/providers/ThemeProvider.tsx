"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Apply theme class to <html>
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;

    // First mount: check localStorage or system preference
    const stored = localStorage.getItem("nexora-theme");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const savedTheme = parsed?.state?.theme;
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        }
      } catch {
        // ignore
      }
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  // Update class whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme, mounted]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem('nexora-theme');
                var theme = 'dark';
                if (stored) {
                  var parsed = JSON.parse(stored);
                  theme = parsed.state && parsed.state.theme || 'dark';
                } else {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch(e) {}
            })();
          `,
        }}
      />
    );
  }

  return <>{children}</>;
}
