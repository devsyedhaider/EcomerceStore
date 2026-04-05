import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { categories as initialCategories } from '@/lib/data';
import { indexedDBStorage } from '@/lib/storage';

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updatedCategory: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      isLoading: false,

      fetchCategories: async () => {
        if (!supabase) return;
        
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
          
          if (error) throw error;
          if (data) set({ categories: data });
        } catch (error) {
          console.warn('Error fetching categories:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addCategory: async (category) => {
        try {
          if (supabase) {
            const { error } = await supabase.from('categories').insert([category]);
            if (error) throw error;
          }
          set((state) => ({ categories: [...state.categories, category] }));
        } catch (error) {
          console.warn('📡 Cloud sync for adding category failed. Saved locally only.');
        }
      },

      updateCategory: async (id, updatedCategory) => {
        try {
          if (supabase) {
            const { error } = await supabase
              .from('categories')
              .update(updatedCategory)
              .eq('id', id);
            if (error) throw error;
          }
          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
          }));
        } catch (error) {
          console.warn('📡 Cloud sync for updating category failed. Saved locally only.');
        }
      },

      deleteCategory: async (id) => {
        try {
          if (supabase) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
          }
          set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        } catch (error) {
          console.warn('📡 Cloud sync for deleting category failed. Saved locally only.');
        }
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
