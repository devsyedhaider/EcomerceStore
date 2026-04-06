'use client';

import { useState, useEffect, useRef } from 'react';
import { useHeroStore } from '@/store/useHeroStore';
import { Save, Image as ImageIcon, Layout, Type, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminHeaderPage() {
  const hero = useHeroStore((state) => state.hero);
  const updateHero = useHeroStore((state) => state.updateHero);
  const [mounted, setMounted] = useState(false);
  const [localHero, setLocalHero] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!localHero && hero) {
      setLocalHero(hero);
    }
  }, [hero, localHero]);

  if (!mounted || !localHero) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const { compressImage } = await import('@/lib/image-utils');
          const compressed = await compressImage(base64, 1920, 1080, 0.7);
          setLocalHero((prev: any) => ({ ...prev, backgroundImage: compressed }));
        } catch (error) {
          console.error('Error compressing image:', error);
          setLocalHero((prev: any) => ({ ...prev, backgroundImage: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHero(localHero);
      alert('Header updated successfully!');
    } catch (error) {
      console.error('Error updating hero:', error);
      alert('Failed to update header.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light uppercase tracking-[0.3em]">Hero Content</h1>
        <p className="text-xs text-zinc-400 font-medium">Edit your homepage hero heading, subtitle, and background image. Changes are reflected live on the storefront.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Editor Form */}
        <div className="space-y-12">
          <div className="bg-white p-10 border border-zinc-100 space-y-10">
            <div className="flex items-center gap-4 border-b border-zinc-50 pb-8">
              <Type className="w-5 h-5 text-zinc-300" />
              <h2 className="text-lg font-light uppercase tracking-[0.2em]">Typography</h2>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Main Heading</label>
                  <input 
                    value={localHero.title}
                    onChange={e => setLocalHero({...localHero, title: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light uppercase"
                    placeholder="ELEGANCE"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Accent Heading</label>
                  <input 
                    value={localHero.accentTitle}
                    onChange={e => setLocalHero({...localHero, accentTitle: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-medium uppercase"
                    placeholder="REDEFINED"
                  />
                </div>
              </div>

              {/* Subtitle / Paragraph Field */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Subtitle / Paragraph</label>
                <p className="text-[10px] text-zinc-300 font-medium">This text appears below the heading in the hero section on the homepage.</p>
                <textarea
                  value={localHero.subtitle}
                  onChange={e => setLocalHero({...localHero, subtitle: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-50 border-none px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light resize-none leading-relaxed"
                  placeholder="Handcrafted jewelry from Pakistan — where timeless artistry meets modern luxury..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 border border-zinc-100 space-y-10">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
              <div className="flex items-center gap-4">
                <ImageIcon className="w-5 h-5 text-zinc-300" />
                <h2 className="text-lg font-light uppercase tracking-[0.2em]">Visual Asset</h2>
              </div>
              <input 
                type="file" 
                id="header-upload"
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label 
                htmlFor="header-upload"
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 border border-zinc-200 hover:border-black transition-smooth cursor-pointer"
              >
                Change Media
              </label>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Media Source URL</label>
              <input 
                value={localHero.backgroundImage}
                onChange={e => setLocalHero({...localHero, backgroundImage: e.target.value})}
                className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 bg-black text-white text-xs uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 transition-smooth hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Deploy Header Updates
          </button>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Layout className="w-4 h-4" /> Live Preview
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
          </div>
          
          <div className="relative aspect-video rounded-[32px] overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200 group">
            <img 
              src={localHero.backgroundImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 scale-[0.6] origin-center">
               <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-7xl font-light uppercase tracking-[0.2em] mb-10 leading-tight font-lato">
                    {localHero.title} <br />
                    <span className="font-medium tracking-[0.1em]">{localHero.accentTitle}</span>
                  </h1>
               </div>
            </div>
          </div>
          
          <div className="bg-zinc-50 p-6 rounded-[24px] border border-dashed border-zinc-300 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Edit3 className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                Changes made here will be reflected globally across the website hero section immediately after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
