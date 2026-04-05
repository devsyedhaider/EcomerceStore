import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'admin' | 'customer';
}

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  setUser: (user: SupabaseUser | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  initialized: false,

  setUser: (supabaseUser) => {
    if (supabaseUser) {
      const user: UserProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
        phone: supabaseUser.user_metadata?.phone || supabaseUser.phone,
        role: supabaseUser.user_metadata?.role || 'customer',
      };
      
      // Set cookies for middleware
      document.cookie = `auth_logged_in=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      if (user.role === 'admin') {
        document.cookie = `admin_mode=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      }

      set({ user, isLoading: false, initialized: true });
    } else {
      set({ user: null, isLoading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      // setUser will be called by the auth state listener in DataInitializer
    }
    set({ isLoading: false });
    return { error };
  },

  signup: async (email, password, metadata) => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    set({ isLoading: false });
    return { error };
  },

  logout: async () => {
    if (supabase) await supabase.auth.signOut();
    document.cookie = "auth_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "admin_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    set({ user: null });
  },
}));
