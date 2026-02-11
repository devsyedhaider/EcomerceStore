'use client';

import { useState, useEffect, useRef } from 'react';
import { useHeroStore } from '@/store/useHeroStore';
import { Save, Image as ImageIcon, Layout, Type, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminHeaderPage() {
  const { hero, updateHero } = useHeroStore();
  const [mounted, setMounted] = useState(false);
  const [localHero, setLocalHero] = useState(hero);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setLocalHero(hero);
  }, [hero]);

  if (!mounted) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const { compressImage } = await import('@/lib/image-utils');
          const compressed = await compressImage(base64, 1920, 1080, 0.7);
          setLocalHero(prev => ({ ...prev, backgroundImage: compressed }));
        } catch (error) {
          console.error('Error compressing image:', error);
          setLocalHero(prev => ({ ...prev, backgroundImage: base64 }));
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
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Header Management</h1>
        <p className="text-zinc-500 font-medium tracking-tight">Customize your website's first impression.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Editor Form */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-6">
              <Type className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xl font-black uppercase tracking-tight">Text Content</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Season Tag (Top)</label>
                <input 
                  value={localHero.seasonText}
                  onChange={e => setLocalHero({...localHero, seasonText: e.target.value})}
                  className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="e.g. New Season 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heading 1</label>
                  <input 
                    value={localHero.title}
                    onChange={e => setLocalHero({...localHero, title: e.target.value})}
                    className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase italic"
                    placeholder="e.g. UNLEASH"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heading 2 (Accent)</label>
                  <input 
                    value={localHero.accentTitle}
                    onChange={e => setLocalHero({...localHero, accentTitle: e.target.value})}
                    className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase italic text-accent"
                    placeholder="e.g. YOUR EDGE"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subtitle</label>
                <textarea 
                  value={localHero.subtitle}
                  onChange={e => setLocalHero({...localHero, subtitle: e.target.value})}
                  className="w-full min-h-[120px] bg-zinc-50 border-none p-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                  placeholder="Write a compelling subtitle..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Main Button Text</label>
                <input 
                  value={localHero.buttonText}
                  onChange={e => setLocalHero({...localHero, buttonText: e.target.value})}
                  className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="e.g. EXPLORE NOW"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
                <h2 className="text-xl font-black uppercase tracking-tight">Background Media</h2>
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
                className="px-4 py-2 bg-zinc-100 hover:bg-black hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Upload New Image
              </label>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Direct Image URL</label>
              <input 
                value={localHero.backgroundImage}
                onChange={e => setLocalHero({...localHero, backgroundImage: e.target.value})}
                className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="https://..."
              />
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Tip: Upload from your device or paste a URL directly.</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 bg-black text-white rounded-[24px] font-black tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isSaving ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            SAVE HEADER CHANGES
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
          
          <div className="relative aspect-video rounded-[40px] overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200">
            <img 
              src={localHero.backgroundImage} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-12">
               <div className="max-w-md scale-75 origin-left">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-0.5 bg-accent" />
                      <span className="text-accent font-black text-[10px] uppercase tracking-widest">{localHero.seasonText}</span>
                  </div>
                  <h1 className="text-6xl font-black text-white italic leading-none mb-6">
                    {localHero.title} <br />
                    <span className="text-accent">{localHero.accentTitle}</span>
                  </h1>
                  <p className="text-white/60 text-xs font-medium mb-8 leading-relaxed">
                    {localHero.subtitle}
                  </p>
                  <div className="inline-block bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    {localHero.buttonText}
                  </div>
               </div>
            </div>
            {/* Desktop Mockup Frame */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
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
