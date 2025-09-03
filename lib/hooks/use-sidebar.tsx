"use client";

import { create } from "zustand";
import { createContext, useContext } from "react";

interface SidebarState {
  isOpen: boolean;
  isHover: boolean;
  toggleOpen: () => void;
  setIsHover: (isHover: boolean) => void;
  getOpenState: () => boolean;
  settings: {
    disabled: boolean;
  };
}

const useSidebarStore = create<SidebarState>((set, get) => ({
  isOpen: true,
  isHover: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsHover: (isHover) => set({ isHover }),
  getOpenState: () => {
    const { isOpen, isHover } = get();
    return isOpen || isHover;
  },
  settings: {
    disabled: false,
  },
}));

const SidebarContext = createContext<typeof useSidebarStore | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarContext.Provider value={useSidebarStore}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const store = useContext(SidebarContext);
  if (!store) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return store();
}
