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
  secondBackgroundImage?: string;
  videoBannerBackgroundImage?: string;
  videoBannerHeading?: string;
  videoBannerSubtext?: string;
  videoBannerCta?: string;
  videoBannerCtaLink?: string;
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
  secondBackgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=100&w=2560&auto=format&fit=crop',
  videoBannerBackgroundImage: 'https://images.unsplash.com/photo-1611080626919-7cf5a969fc8f?q=100&w=2560&auto=format&fit=crop',
  videoBannerHeading: 'Crafted for the Bold',
  videoBannerSubtext: 'Discover the new season collection',
  videoBannerCta: 'Shop Now',
  videoBannerCtaLink: '/products',
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
              secondBackgroundImage: data.second_background_image || data.secondBackgroundImage || defaultPromo.secondBackgroundImage,
              videoBannerBackgroundImage: data.video_banner_background_image || data.videoBannerBackgroundImage || defaultPromo.videoBannerBackgroundImage,
              videoBannerHeading: data.video_banner_heading ?? data.videoBannerHeading ?? defaultPromo.videoBannerHeading,
              videoBannerSubtext: data.video_banner_subtext ?? data.videoBannerSubtext ?? defaultPromo.videoBannerSubtext,
              videoBannerCta: data.video_banner_cta ?? data.videoBannerCta ?? defaultPromo.videoBannerCta,
              videoBannerCtaLink: data.video_banner_cta_link ?? data.videoBannerCtaLink ?? defaultPromo.videoBannerCtaLink,
            };
            set({ promo: mappedPromo, lastSync: new Date() });
          }

          // Set up real-time subscription
          supabase
            .channel('promo_settings_changes')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'promo_settings' },
              (payload) => {
                const newData = payload.new as any;
                if (newData) {
                  const mappedPromo = {
                    ...newData,
                    titleAccent: newData.title_accent ?? newData.titleAccent,
                    buttonText: newData.button_text ?? newData.buttonText,
                    backgroundImage: newData.background_image || newData.backgroundImage || defaultPromo.backgroundImage,
                    secondBackgroundImage: newData.second_background_image || newData.secondBackgroundImage || defaultPromo.secondBackgroundImage,
                    videoBannerBackgroundImage: newData.video_banner_background_image || newData.videoBannerBackgroundImage || defaultPromo.videoBannerBackgroundImage,
                    videoBannerHeading: newData.video_banner_heading ?? newData.videoBannerHeading ?? defaultPromo.videoBannerHeading,
                    videoBannerSubtext: newData.video_banner_subtext ?? newData.videoBannerSubtext ?? defaultPromo.videoBannerSubtext,
                    videoBannerCta: newData.video_banner_cta ?? newData.videoBannerCta ?? defaultPromo.videoBannerCta,
                    videoBannerCtaLink: newData.video_banner_cta_link ?? newData.videoBannerCtaLink ?? defaultPromo.videoBannerCtaLink,
                  };
                  set({ promo: mappedPromo, lastSync: new Date() });
                }
              }
            )
            .subscribe();

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
            if (content.secondBackgroundImage !== undefined) { dbUpdate.second_background_image = content.secondBackgroundImage; delete dbUpdate.secondBackgroundImage; }
            if (content.videoBannerBackgroundImage !== undefined) { dbUpdate.video_banner_background_image = content.videoBannerBackgroundImage; delete dbUpdate.videoBannerBackgroundImage; }
            if (content.videoBannerHeading !== undefined) { dbUpdate.video_banner_heading = content.videoBannerHeading; delete dbUpdate.videoBannerHeading; }
            if (content.videoBannerSubtext !== undefined) { dbUpdate.video_banner_subtext = content.videoBannerSubtext; delete dbUpdate.videoBannerSubtext; }
            if (content.videoBannerCta !== undefined) { dbUpdate.video_banner_cta = content.videoBannerCta; delete dbUpdate.videoBannerCta; }
            if (content.videoBannerCtaLink !== undefined) { dbUpdate.video_banner_cta_link = content.videoBannerCtaLink; delete dbUpdate.videoBannerCtaLink; }

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
