'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useOrderStore } from '@/store/useOrderStore';
import { usePromoStore } from '@/store/usePromoStore';
import { useHeroStore } from '@/store/useHeroStore';
import { supabase } from '@/lib/supabase';

export default function DataInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const { products, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchPromo = usePromoStore((state) => state.fetchPromo);
  const fetchHero = useHeroStore((state) => state.fetchHero);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
      return;
    }

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth State Changed:', event);
      setUser(session?.user ?? null);
    });

    // Initial fetch and seeding
    const initialSync = async () => {
      console.log('🔄 Initializing data from Supabase...');
      try {
        // Fetch existing data
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchOrders(),
          fetchPromo(),
          fetchHero()
        ]);

        console.log('✅ Initial cloud data sync complete.');
      } catch (err: any) {
        console.warn('📡 Supabase sync is offline. Realtime sync disabled.');
        console.log('💡 Note: Create a Supabase project at supabase.com to enable cloud sync.');
      }
    };

    initialSync();

    // Subscribe to REALTIME updates from Supabase for all tables
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
         console.log('📡 Product change detected. Refreshing...');
         fetchProducts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
         console.log('📡 Order change detected. Refreshing...');
         fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_settings' }, () => {
         console.log('📡 Promo change detected. Refreshing...');
         fetchPromo();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_settings' }, () => {
         console.log('📡 Hero change detected. Refreshing...');
         fetchHero();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
         console.log('📡 Category change detected. Refreshing...');
         fetchCategories();
      })
      .subscribe((status: string) => {
         if (status === 'SUBSCRIBED') {
           console.log('📡 Realtime cloud sync active.');
         } else if (status === 'CLOSED') {
            console.log('📡 Realtime cloud sync closed.');
         } else if (status === 'CHANNEL_ERROR') {
            console.warn('📡 Realtime cloud sync disabled. Tables may not be enabled for REALTIME in Supabase.');
         }
      });

    return () => {
       subscription.unsubscribe();
       if (supabase) {
         supabase.removeChannel(channel);
       }
    };
  }, [fetchProducts, fetchCategories, fetchOrders, fetchPromo, fetchHero, setUser]);

  return null;
}
