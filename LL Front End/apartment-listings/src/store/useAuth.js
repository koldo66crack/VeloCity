// src/store/useAuth.js
import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useAuth = create((set) => ({
  user: null,
  loading: true,

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
      (_event, newSession) => set({ user: newSession?.user || null })
    );

    // 3️⃣  Return an unsubscribe fn (optional cleanup)
    return () => sub.subscription.unsubscribe();
  },

  /* Auth helpers */
  signIn:  (email, password) =>
              supabase.auth.signInWithPassword({ email, password }),

  signUp:  (email, password, fullName) =>
              supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } },
              }),

  signOut: () => supabase.auth.signOut(),
}));
