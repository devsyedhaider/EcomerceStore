import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'customer';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      signup: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        // Clear cookies for middleware
        document.cookie = "auth_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "admin_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      version: 2,
    }
  )
);
