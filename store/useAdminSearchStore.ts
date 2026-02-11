import { create } from 'zustand';

interface AdminSearchStore {
  adminSearchTerm: string;
  setAdminSearchTerm: (term: string) => void;
}

export const useAdminSearchStore = create<AdminSearchStore>((set) => ({
  adminSearchTerm: '',
  setAdminSearchTerm: (term) => set({ adminSearchTerm: term }),
}));
