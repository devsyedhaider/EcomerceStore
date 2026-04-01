import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText: string;
  accentTitle: string;
  seasonText: string;
}

interface HeroStore {
  hero: HeroContent;
  isLoading: boolean;
  fetchHero: () => Promise<void>;
  updateHero: (content: Partial<HeroContent>) => Promise<void>;
}

const defaultHero: HeroContent = {
  seasonText: 'New Season 2026',
  accentTitle: 'YOUR EDGE.',
  title: 'UNLEASH',
  subtitle: 'Experience the fusion of high-performance technology and street-ready aesthetics. Engineered for those who lead, never follow.',
  backgroundImage: '/hero-aura-feet.png',
  buttonText: 'EXPLORE NOW',
};

export const useHeroStore = create<HeroStore>()(
  persist(
    (set) => ({
      hero: defaultHero,
      isLoading: false,

      fetchHero: async () => {
        if (!supabase) return;
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('hero_settings')
            .select('*')
            .single();

          if (error && error.code !== 'PGRST116') throw error;
          
          if (data) {
            const mappedHero = {
              ...data,
              backgroundImage: data.background_image,
              buttonText: data.button_text,
              accentTitle: data.accent_title,
              seasonText: data.season_text,
            };
            set({ hero: mappedHero });
          }
        } catch (error) {
          console.warn('Error fetching hero:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateHero: async (content) => {
        // Update local state immediately for a fast feel
        set((state) => ({
          hero: { ...state.hero, ...content },
        }));

        try {
          if (supabase) {
            const dbUpdate: any = { ...content };
            if (content.backgroundImage) { dbUpdate.background_image = content.backgroundImage; delete dbUpdate.backgroundImage; }
            if (content.buttonText) { dbUpdate.button_text = content.buttonText; delete dbUpdate.buttonText; }
            if (content.accentTitle) { dbUpdate.accent_title = content.accentTitle; delete dbUpdate.accentTitle; }
            if (content.seasonText) { dbUpdate.season_text = content.seasonText; delete dbUpdate.seasonText; }

            const { error } = await supabase
              .from('hero_settings')
              .upsert({ id: 1, ...dbUpdate });
            
            if (error) throw error;
          }
        } catch (error) {
          console.warn('Error syncing hero to cloud:', error);
        }
      },
    }),
    {
      name: 'hero-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
