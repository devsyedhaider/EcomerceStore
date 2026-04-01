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
          if (data && data.length > 0) set({ categories: data });
        } catch (error) {
          console.warn('Error fetching categories:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addCategory: async (category) => {
        try {
          if (supabase) {
            await supabase.from('categories').insert([category]);
          }
          set((state) => ({ categories: [...state.categories, category] }));
        } catch (error) {
          console.warn('Error adding category:', error);
        }
      },

      updateCategory: async (id, updatedCategory) => {
        try {
          if (supabase) {
            await supabase
              .from('categories')
              .update(updatedCategory)
              .eq('id', id);
          }
          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
          }));
        } catch (error) {
          console.error('Error updating category:', error);
        }
      },

      deleteCategory: async (id) => {
        try {
          if (supabase) {
            await supabase.from('categories').delete().eq('id', id);
          }
          set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
