import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

interface PromoContent {
  tagline: string;
  title1: string;
  titleAccent: string;
  title2: string;
  code: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
  videoUrl?: string;
}

interface PromoStore {
  promo: PromoContent;
  isLoading: boolean;
  fetchPromo: () => Promise<void>;
  updatePromo: (content: Partial<PromoContent>) => Promise<void>;
}

const defaultPromo: PromoContent = {
  tagline: 'Special Offer',
  title1: 'GET',
  titleAccent: '20% OFF',
  title2: 'YOUR FIRST ORDER',
  code: 'elvaediit10',
  description: 'Valid on all new arrivals - Get 10% OFF now!',
  buttonText: 'CLAIM DISCOUNT',
  backgroundImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=100&w=2560&auto=format&fit=crop',
  videoUrl: '',
};

export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      promo: defaultPromo,
      isLoading: false,

      fetchPromo: async () => {
        if (!supabase) return;
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('promo_settings')
            .select('*')
            .single();
          
          if (error && error.code !== 'PGRST116') throw error;
          
          if (data) {
            const mappedPromo = {
              ...data,
              titleAccent: data.title_accent,
              buttonText: data.button_text,
              backgroundImage: data.background_image,
            };
            set({ promo: mappedPromo });
          }
        } catch (error) {
          console.warn('📡 Fetching promo data skipped or failed. Using defaults.');
        } finally {
          set({ isLoading: false });
        }
      },

      updatePromo: async (content) => {
        // Update local state immediately
        set((state) => ({
          promo: { ...state.promo, ...content },
        }));

        try {
          if (supabase) {
            const dbUpdate: any = { ...content };
            if (content.titleAccent) { dbUpdate.title_accent = content.titleAccent; delete dbUpdate.titleAccent; }
            if (content.buttonText) { dbUpdate.button_text = content.buttonText; delete dbUpdate.buttonText; }
            if (content.backgroundImage) { dbUpdate.background_image = content.backgroundImage; delete dbUpdate.backgroundImage; }

            const { error } = await supabase
              .from('promo_settings')
              .upsert({ id: 1, ...dbUpdate });
            
            if (error) throw error;
          }
        } catch (error) {
          console.warn('📡 Cloud sync for promo failed. Changes saved locally only.');
        }
      },
    }),
    {
      name: 'promo-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
