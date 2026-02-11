import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { products as initialProducts } from '@/lib/data';
import { indexedDBStorage } from '@/lib/storage';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isTopInCategory: boolean;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      isLoading: false,

      fetchProducts: async () => {
        if (!supabase) return;

        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          if (data && data.length > 0) {
            const mappedData: Product[] = data.map((p: any) => ({
              ...p,
              isNew: p.is_new,
              isFeatured: p.is_featured,
              isTopInCategory: p.is_top_in_category,
            }));
            set({ products: mappedData });
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addProduct: async (product) => {
        try {
          if (supabase) {
            const dbProduct = {
              ...product,
              is_new: product.isNew,
              is_featured: product.isFeatured,
              is_top_in_category: product.isTopInCategory,
            };
            // @ts-ignore
            delete dbProduct.isNew; delete dbProduct.isFeatured; delete dbProduct.isTopInCategory;
            await supabase.from('products').insert([dbProduct]);
          }
          set((state) => ({ products: [product, ...state.products] }));
        } catch (error) {
          console.error('Error adding product:', error);
        }
      },

      updateProduct: async (id, updatedProduct) => {
        try {
          if (supabase) {
            const dbUpdate: any = { ...updatedProduct };
            if ('isNew' in dbUpdate) { dbUpdate.is_new = dbUpdate.isNew; delete dbUpdate.isNew; }
            if ('isFeatured' in dbUpdate) { dbUpdate.is_featured = dbUpdate.isFeatured; delete dbUpdate.isFeatured; }
            if ('isTopInCategory' in dbUpdate) { dbUpdate.is_top_in_category = dbUpdate.isTopInCategory; delete dbUpdate.isTopInCategory; }
            await supabase.from('products').update(dbUpdate).eq('id', id);
          }
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
          }));
        } catch (error) {
          console.error('Error updating product:', error);
        }
      },

      deleteProduct: async (id) => {
        try {
          if (supabase) {
            await supabase.from('products').delete().eq('id', id);
          }
          set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      },
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
