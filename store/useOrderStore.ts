import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { CartItem } from './useCartStore';

export interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  postalCode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingDetails: ShippingDetails;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, status: Order['status']) => Promise<void>;
  getOrdersByEmail: (email: string) => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      fetchOrders: async () => {
        if (!supabase) return;
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

          if (error) {
            console.warn('❌ Supabase Order Fetch Error:', error.message, error.details);
            return;
          }
          
          const mappedOrders = (data || []).map((o: any) => ({
            ...o,
            shippingDetails: o.shipping_details,
          }));
          
          // Merge strategy: Keep local-only orders that aren't in the cloud yet
          const cloudIds = new Set(mappedOrders.map(o => o.id));
          const localOnly = get().orders.filter(o => !cloudIds.has(o.id));
          
          const finalOrders = [...mappedOrders, ...localOnly].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          set({ orders: finalOrders });
          console.log(`✅ Synchronized ${mappedOrders.length} orders from cloud. Kept ${localOnly.length} local-only orders.`);
        } catch (error) {
          console.warn('❌ Unexpected Error fetching orders:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addOrder: async (order) => {
        // 1. Update local state immediately so user sees "Success"
        set({ orders: [order, ...get().orders] });

        try {
          if (supabase) {
            const dbOrder = {
              ...order,
              shipping_details: order.shippingDetails,
            };
            // @ts-ignore
            delete dbOrder.shippingDetails;
            
            const { error } = await supabase.from('orders').insert([dbOrder]);
            if (error) {
               console.warn('❌ Cloud Save Failed:', error.message);
               // We don't throw here so the user isn't stuck, but we log the error
            } else {
               console.log('✅ Order synced to cloud.');
            }
          }
        } catch (error) {
          console.warn('❌ unexpected error adding order:', error);
        }
      },

      updateOrder: async (id, status) => {
        // 1. Update local state immediately for instant feedback
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));

        try {
          if (supabase) {
            const { error } = await supabase
              .from('orders')
              .update({ status })
              .eq('id', id);
            
            if (error) {
              console.warn('❌ Cloud Status Update Failed:', error.message);
              // We keep the local update so the user isn't frustrated
            } else {
              console.log('✅ Order status synced to cloud: ' + status);
            }
          }
        } catch (error) {
          console.warn('❌ Unexpected error updating status:', error);
        }
      },

      getOrdersByEmail: (email) => {
        if (!email) return [];
        const searchEmail = email.toLowerCase();
        return get().orders.filter(o => o.shippingDetails?.email?.toLowerCase() === searchEmail);
      },
    }),
    {
      name: 'order-storage',
      version: 2,
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
