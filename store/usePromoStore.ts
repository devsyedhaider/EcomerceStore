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
  secondVideoUrl?: string;
}

interface PromoStore {
  promo: PromoContent;
  isLoading: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
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
  secondVideoUrl: 'https://player.vimeo.com/external/340032049.sd.mp4?s=6a575e92706e2c31e9c9339327855013ed2d8333&profile_id=164&oauth2_token_id=57447761', // High-performance Diamond Move
};

export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      promo: defaultPromo,
      isLoading: false,
      isSyncing: false,
      lastSync: null,

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
              titleAccent: data.title_accent ?? data.titleAccent,
              buttonText: data.button_text ?? data.buttonText,
              backgroundImage: data.background_image || data.backgroundImage || defaultPromo.backgroundImage,
              secondVideoUrl: data.second_video_url || data.secondVideoUrl || defaultPromo.secondVideoUrl,
            };
            set({ promo: mappedPromo, lastSync: new Date() });
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
          isSyncing: true,
        }));

        try {
          if (supabase) {
            const dbUpdate: any = { ...content };
            
            // Correct mapping for snake_case columns
            if (content.titleAccent !== undefined) { dbUpdate.title_accent = content.titleAccent; delete dbUpdate.titleAccent; }
            if (content.buttonText !== undefined) { dbUpdate.button_text = content.buttonText; delete dbUpdate.buttonText; }
            if (content.backgroundImage !== undefined) { dbUpdate.background_image = content.backgroundImage; delete dbUpdate.backgroundImage; }
            if (content.videoUrl !== undefined) { dbUpdate.video_url = content.videoUrl; delete dbUpdate.videoUrl; }
            if (content.secondVideoUrl !== undefined) { dbUpdate.second_video_url = content.secondVideoUrl; delete dbUpdate.secondVideoUrl; }

            const { error } = await supabase
              .from('promo_settings')
              .upsert({ id: 1, ...dbUpdate });
            
            if (error) throw error;
            set({ lastSync: new Date() });
          }
        } catch (error) {
          console.warn('📡 Cloud sync for promo failed. Changes saved locally only.');
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'promo-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
