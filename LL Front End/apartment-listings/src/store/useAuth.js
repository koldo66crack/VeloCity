// src/store/useAuth.js
import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { useLoading } from './useLoading';

export const useAuth = create((set, get) => ({
  user: null,
  loading: true,
  authLoading: false, // For login/signup operations
  error: null,

  /*  Called once in AuthProvider
      – fetch cached session (async)
      – subscribe to future auth state changes
  */
  init: () => {
    // 1️⃣  Resolve cached session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user || null, loading: false });
    });

    // 2️⃣  Listen for sign-in / sign-out events
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        set({ 
          user: newSession?.user || null,
          loading: false,
          authLoading: false,
          error: null // Clear errors on successful auth state change
        });
      }
    );

    // 3️⃣  Return an unsubscribe fn (optional cleanup)
    return () => sub.subscription.unsubscribe();
  },

  /* Enhanced Auth helpers with proper error handling */
  signIn: async (email, password) => {
    const { showLoading, hideLoading } = useLoading.getState();
    set({ authLoading: true, error: null });
    showLoading("Signing you in...", "save");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        set({ error: error.message, authLoading: false });
        hideLoading();
        return { error };
      }
      
      // No need to fetch user again - auth state change will handle it
      set({ authLoading: false });
      hideLoading();
      return { data };
    } catch (err) {
      set({ 
        error: 'An unexpected error occurred. Please try again.', 
        authLoading: false 
      });
      hideLoading();
      return { error: err };
    }
  },

  signUp: async (email, password, fullName) => {
    const { showLoading, hideLoading } = useLoading.getState();
    set({ authLoading: true, error: null });
    showLoading("Creating your account...", "save");
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      
      if (error) {
        set({ error: error.message, authLoading: false });
        hideLoading();
        return { error };
      }
      
      set({ authLoading: false });
      hideLoading();
      return { data };
    } catch (err) {
      set({ 
        error: 'An unexpected error occurred. Please try again.', 
        authLoading: false 
      });
      hideLoading();
      return { error: err };
    }
  },

  signOut: async () => {
    const { showLoading, hideLoading } = useLoading.getState();
    set({ authLoading: true, error: null });
    showLoading("Signing you out...", "save");
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        set({ error: error.message, authLoading: false });
        hideLoading();
        return { error };
      }
      
      set({ authLoading: false });
      hideLoading();
      return { success: true };
    } catch (err) {
      set({ 
        error: 'An unexpected error occurred during sign out.', 
        authLoading: false 
      });
      hideLoading();
      return { error: err };
    }
  },

  // Clear errors manually
  clearError: () => set({ error: null }),
}));
