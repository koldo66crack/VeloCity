import { create } from 'zustand';

export const useLoading = create((set, get) => ({
  // Global loading state
  isLoading: false,
  loadingMessage: "Loading your VeloCity experience...",
  loadingVariant: "default",

  // Specific loading states
  isMapLoading: false,
  isDataLoading: false,
  isSaving: false,
  isFiltering: false,

  // Show global loading
  showLoading: (message = "Loading your VeloCity experience...", variant = "default") => {
    set({ 
      isLoading: true, 
      loadingMessage: message, 
      loadingVariant: variant 
    });
  },

  // Hide global loading
  hideLoading: () => {
    set({ isLoading: false });
  },

  // Map loading
  setMapLoading: (loading) => {
    set({ isMapLoading: loading });
  },

  // Data loading
  setDataLoading: (loading) => {
    set({ isDataLoading: loading });
  },

  // Save operation loading
  setSaving: (loading) => {
    set({ isSaving: loading });
  },

  // Filter loading
  setFiltering: (loading) => {
    set({ isFiltering: loading });
  },

  // Quick loading helpers
  withLoading: async (operation, message = "Loading...", variant = "default") => {
    set({ isLoading: true, loadingMessage: message, loadingVariant: variant });
    try {
      await operation();
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear all loading states
  clearAll: () => {
    set({
      isLoading: false,
      isMapLoading: false,
      isDataLoading: false,
      isSaving: false,
      isFiltering: false,
    });
  },
})); 