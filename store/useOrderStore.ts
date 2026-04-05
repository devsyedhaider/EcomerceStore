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
          
          set({ orders: mappedOrders });
          console.log(`✅ Synchronized ${mappedOrders.length} orders from cloud.`);
        } catch (error) {
          console.error('❌ Unexpected Error fetching orders:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addOrder: async (order) => {
        try {
          if (supabase) {
            const dbOrder = {
              ...order,
              shipping_details: order.shippingDetails,
            };
            // @ts-ignore
            delete dbOrder.shippingDetails;
            
            const { error } = await supabase.from('orders').insert([dbOrder]);
            if (error) throw error;
            console.log('✅ Order synced to cloud.');
          }
          set({ orders: [order, ...get().orders] });
        } catch (error) {
          console.error('❌ Error adding order:', error);
          alert('Failed to place order. Please check your connection.');
          throw error;
        }
      },

      updateOrder: async (id, status) => {
        try {
          if (supabase) {
            const { error } = await supabase
              .from('orders')
              .update({ status })
              .eq('id', id);
            
            if (error) throw error;
            console.log('✅ Order status synced to cloud: ' + status);
          }
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
          }));
        } catch (error) {
          console.error('❌ Error updating status:', error);
          alert('Failed to update order status.');
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
