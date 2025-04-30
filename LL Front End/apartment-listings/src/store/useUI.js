import { create } from "zustand";

export const useUI = create((set) => ({
  showAuthModal: false,
  openAuthModal: ()  => set({ showAuthModal: true  }),
  closeAuthModal: () => set({ showAuthModal: false }),
}));
