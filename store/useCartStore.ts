import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

import { Product } from './useProductStore';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                slug: product.slug || product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                size,
                color,
                quantity: 1,
              },
            ],
          });
        }
      },
      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        });
      },
      updateQuantity: (id, size, color, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
