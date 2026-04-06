import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { Product } from './useProductStore';

interface WishlistStore {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const { items } = get();
        const isInList = items.some((item) => item.id === product.id);

        if (isInList) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => set({ items: [] }),
      getItemCount: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
