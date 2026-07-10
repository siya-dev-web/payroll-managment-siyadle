import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  notifications: number;
  searchQuery: string;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  notifications: 1,
  searchQuery: "",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
