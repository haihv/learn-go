"use client";
import { useSyncExternalStore } from "react";

type Props = {
  className?: string;
};

// The theme lives as a .dark class on <html>, applied before hydration by
// the layout bootstrap script. Observing the class keeps the icon in sync
// without setState-in-effect, even if something else flips the theme.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const isDarkSnapshot = () => document.documentElement.classList.contains("dark");
const serverSnapshot = () => false;

export default function ThemeToggle({ className = "" }: Props) {
  const dark = useSyncExternalStore(subscribe, isDarkSnapshot, serverSnapshot);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // private browsing — preference just won't persist
    }
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`rounded-full border border-navy-600 bg-navy-800 hover:bg-navy-700 w-9 h-9 flex items-center justify-center text-base transition-colors cursor-pointer ${className}`}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
