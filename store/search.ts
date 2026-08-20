"use client";

import { create } from "zustand";

type SearchState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

// Palette visibility lives in a store (not React context) so any button in
// the tree — sidebar, top bar, landing hero — can open it without prop drilling.
export const useSearchStore = create<SearchState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
