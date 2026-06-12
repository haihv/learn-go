"use client";
import { useSyncExternalStore } from "react";

type ShortcutKeys = {
  mod: string; // "⌘" on Mac, "Ctrl" on Win/Linux
  alt: string; // "⌥" on Mac, "Alt" on Win/Linux
};

// useSyncExternalStore keeps the server snapshot ("Ctrl") for hydration and
// swaps to the real platform on the client without a setState-in-effect.
const subscribe = () => () => {};
const isMacSnapshot = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
const serverSnapshot = () => false;

export function useShortcutKey(): ShortcutKeys {
  const isMac = useSyncExternalStore(subscribe, isMacSnapshot, serverSnapshot);
  return isMac ? { mod: "⌘", alt: "⌥" } : { mod: "Ctrl", alt: "Alt" };
}
