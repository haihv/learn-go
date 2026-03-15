"use client";
import { useEffect, useState } from "react";

type ShortcutKeys = {
  mod: string; // "⌘" on Mac, "Ctrl" on Win/Linux
  alt: string; // "⌥" on Mac, "Alt" on Win/Linux
};

export function useShortcutKey(): ShortcutKeys {
  const [keys, setKeys] = useState<ShortcutKeys>({ mod: "Ctrl", alt: "Alt" });

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    setKeys(isMac ? { mod: "⌘", alt: "⌥" } : { mod: "Ctrl", alt: "Alt" });
  }, []);

  return keys;
}
