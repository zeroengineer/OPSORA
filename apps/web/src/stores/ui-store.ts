import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

/** Ephemeral client-side UI state. Server data belongs in TanStack Query. */
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  searchOpen: false,
  openSearch: () => {
    set({ searchOpen: true });
  },
  closeSearch: () => {
    set({ searchOpen: false });
  },
}));
