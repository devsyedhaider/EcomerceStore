'use client';

import { useState, useEffect } from 'react';
import { usePromoStore } from '@/store/usePromoStore';
import { Save, Image as ImageIcon, Layout, Type, Ticket } from 'lucide-react';

export default function AdminPromoPage() {
  const { promo, updatePromo } = usePromoStore();
  const [mounted, setMounted] = useState(false);
  const [localPromo, setLocalPromo] = useState(promo);
  const [isSaving, setIsSaving] = useState(false);

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
        } catch {
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
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light uppercase tracking-[0.3em]">Promo Management</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Customize your mid-page promotional banner.</p>
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
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Tagline / Eyebrow Text</label>
                <input
                  value={localPromo.tagline}
                  onChange={e => setLocalPromo({...localPromo, tagline: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light uppercase tracking-widest"
                  placeholder="EXCLUSIVE OFFER"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Main Heading</label>
                  <input
                    value={localPromo.title1}
                    onChange={e => setLocalPromo({...localPromo, title1: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light uppercase"
                    placeholder="GET"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Accent / Offer Text</label>
                  <input
                    value={localPromo.titleAccent}
                    onChange={e => setLocalPromo({...localPromo, titleAccent: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-medium uppercase"
                    placeholder="20% OFF"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Sub Heading</label>
                <input
                  value={localPromo.title2}
                  onChange={e => setLocalPromo({...localPromo, title2: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light uppercase"
                  placeholder="YOUR FIRST ORDER"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Coupon Code</label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      value={localPromo.code}
                      onChange={e => setLocalPromo({...localPromo, code: e.target.value})}
                      className="w-full h-12 bg-zinc-50 border-none pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-bold tracking-widest uppercase"
                      placeholder="AURAFEET20"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Button Text</label>
                  <input
                    value={localPromo.buttonText}
                    onChange={e => setLocalPromo({...localPromo, buttonText: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-bold uppercase tracking-widest"
                    placeholder="CLAIM DISCOUNT"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Disclaimer Text</label>
                <input
                  value={localPromo.description}
                  onChange={e => setLocalPromo({...localPromo, description: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                  placeholder="Valid on all new arrivals"
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
              <input type="file" id="promo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label
                htmlFor="promo-upload"
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 border border-zinc-200 hover:border-black transition-all cursor-pointer"
              >
                Change Media
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Media Source URL</label>
              <input
                value={localPromo.backgroundImage}
                onChange={e => setLocalPromo({...localPromo, backgroundImage: e.target.value})}
                className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 bg-black text-white text-xs uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 transition-all hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Deploy Promo Updates
          </button>
        </div>

        {/* Live Preview — matches actual website promo section style */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
              <Layout className="w-4 h-4" /> Live Preview
            </h3>
            <span className="px-3 py-1 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest">As Seen on Website</span>
          </div>

          {/* Exact replica of the website's promo section */}
          <div className="relative h-[500px] overflow-hidden bg-gray-100">
            <div className="absolute inset-0">
              <img
                src={localPromo.backgroundImage}
                alt="Preview"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <span className="text-xs uppercase tracking-[0.4em] mb-6 text-white">{localPromo.tagline}</span>
              <h2 className="text-3xl md:text-5xl font-light uppercase tracking-[0.2em] mb-10 max-w-2xl leading-tight text-white">
                {localPromo.title1} {localPromo.titleAccent && <span className="font-medium">{localPromo.titleAccent}</span>} {localPromo.title2}
              </h2>
              <div className="flex flex-col items-center gap-4">
                {localPromo.code && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-white/70">Code:</span>
                    <span className="text-white font-medium border border-white/30 px-4 py-2 text-xs tracking-widest backdrop-blur-sm bg-white/10">{localPromo.code}</span>
                  </div>
                )}
                <div className="inline-flex items-center justify-center px-10 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] transition-all border border-black">
                  {localPromo.buttonText}
                </div>
                {localPromo.description && (
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mt-2">{localPromo.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 p-6 border border-dashed border-zinc-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-zinc-100 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
              Changes deploy immediately — this preview matches the exact live website layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
