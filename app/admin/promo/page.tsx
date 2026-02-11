'use client';

import { useState, useEffect, useRef } from 'react';
import { usePromoStore } from '@/store/usePromoStore';
import { Save, Image as ImageIcon, Layout, Type, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPromoPage() {
  const { promo, updatePromo } = usePromoStore();
  const [mounted, setMounted] = useState(false);
  const [localPromo, setLocalPromo] = useState(promo);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setLocalPromo(promo);
  }, [promo]);

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
          setLocalPromo(prev => ({ ...prev, backgroundImage: compressed }));
        } catch (error) {
          console.error('Error compressing image:', error);
          setLocalPromo(prev => ({ ...prev, backgroundImage: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePromo(localPromo);
      alert('Promotional banner updated successfully!');
    } catch (error) {
      console.error('Error updating promo:', error);
      alert('Failed to update promo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Promo Management</h1>
        <p className="text-zinc-500 font-medium tracking-tight">Customize your mid-page promotional banner.</p>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tagline</label>
                <input 
                  value={localPromo.tagline}
                  onChange={e => setLocalPromo({...localPromo, tagline: e.target.value})}
                  className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="e.g. Special Offer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heading 1</label>
                  <input 
                    value={localPromo.title1}
                    onChange={e => setLocalPromo({...localPromo, title1: e.target.value})}
                    className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase italic"
                    placeholder="e.g. GET"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heading Accent</label>
                  <input 
                    value={localPromo.titleAccent}
                    onChange={e => setLocalPromo({...localPromo, titleAccent: e.target.value})}
                    className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase italic text-accent"
                    placeholder="e.g. 20% OFF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heading 2</label>
                <input 
                  value={localPromo.title2}
                  onChange={e => setLocalPromo({...localPromo, title2: e.target.value})}
                  className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase italic"
                  placeholder="e.g. YOUR FIRST ORDER"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Coupon Code</label>
                    <div className="relative">
                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            value={localPromo.code}
                            onChange={e => setLocalPromo({...localPromo, code: e.target.value})}
                            className="w-full h-14 bg-black text-white border-none pl-12 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all font-black tracking-widest uppercase"
                            placeholder="AURAFEET20"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Button Text</label>
                    <input 
                        value={localPromo.buttonText}
                        onChange={e => setLocalPromo({...localPromo, buttonText: e.target.value})}
                        className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all font-black uppercase tracking-widest"
                        placeholder="CLAIM DISCOUNT"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Disclaimer Text</label>
                <input 
                  value={localPromo.description}
                  onChange={e => setLocalPromo({...localPromo, description: e.target.value})}
                  className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="e.g. Valid on all new arrivals"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
                <h2 className="text-xl font-black uppercase tracking-tight">Background Image</h2>
              </div>
              <input 
                type="file" 
                id="promo-upload"
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label 
                htmlFor="promo-upload"
                className="px-4 py-2 bg-zinc-100 hover:bg-black hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Upload New
              </label>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Image URL</label>
              <input 
                value={localPromo.backgroundImage}
                onChange={e => setLocalPromo({...localPromo, backgroundImage: e.target.value})}
                className="w-full h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 bg-black text-white rounded-[24px] font-black tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isSaving ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            SAVE PROMO CHANGES
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
          
          <div className="relative h-[400px] rounded-[48px] overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-[#7a0d1a] z-10" />
            <img 
              src={localPromo.backgroundImage} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="relative z-20 h-full flex items-center p-8">
                <div className="scale-75 origin-left">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-accent" />
                        <span className="text-accent font-black text-xs uppercase tracking-[0.4em]">{localPromo.tagline}</span>
                    </div>

                    <h2 className="text-6xl font-black tracking-tighter leading-[0.85] mb-8 text-white uppercase italic">
                        {localPromo.title1} <span className="text-accent italic">{localPromo.titleAccent}</span> <br />{localPromo.title2}
                    </h2>
                    
                    <div className="flex items-center gap-6 mb-10">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">Code:</span>
                            <span className="text-white font-black bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-[10px] tracking-widest">{localPromo.code}</span>
                        </div>
                    </div>

                    <div className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] inline-block">
                        {localPromo.buttonText}
                    </div>
                </div>
            </div>
          </div>
          
          <div className="bg-zinc-50 p-6 rounded-[24px] border border-dashed border-zinc-300 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-accent">
                <Ticket className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                Use this to rotate seasonal offers or holiday discounts. Changes go live immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
