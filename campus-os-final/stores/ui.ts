"use client";
import { create } from "zustand";

type UIState = {
  planPreviewOpen: boolean;
  setPlanPreviewOpen: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  planPreviewOpen: false,
  setPlanPreviewOpen: (v) => set({ planPreviewOpen: v }),
}));