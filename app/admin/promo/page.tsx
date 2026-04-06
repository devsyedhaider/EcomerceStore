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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For local development/demo, we use public URL or a mock string
      // In a real app, this would upload to Supabase Storage/S3
      const videoBlobUrl = URL.createObjectURL(file);
      setLocalPromo(prev => ({ ...prev, videoUrl: videoBlobUrl }));
      alert('Video selected. Please note: blobs only persist in this session. For permanent storage, provide a public URL.');
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
                    placeholder="10% OFF"
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
                      placeholder="elvaediit10"
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
                  placeholder="Valid on all new arrivals - Get 10% OFF"
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
              <div className="flex flex-wrap gap-4">
                 <input type="file" id="promo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                 <label
                   htmlFor="promo-upload"
                   className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all cursor-pointer flex items-center gap-2"
                 >
                   <ImageIcon className="w-3 h-3" /> Change Image File
                 </label>

                 <input type="file" id="video-upload" className="hidden" accept="video/mp4" onChange={handleVideoUpload} />
                 <label
                   htmlFor="video-upload"
                   className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all cursor-pointer flex items-center gap-2"
                 >
                   <ImageIcon className="w-3 h-3" /> Select Promo Video
                 </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Background Image URL</label>
                <input
                  value={localPromo.backgroundImage}
                  onChange={e => setLocalPromo({...localPromo, backgroundImage: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Background Video URL (Optional)</label>
                <input
                  value={localPromo.videoUrl || ''}
                  onChange={e => setLocalPromo({...localPromo, videoUrl: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">Direct link to mp4 file recommended for best performance.</p>
              </div>

              <div className="pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-4 mb-6">
                  <Layout className="w-5 h-5 text-zinc-300" />
                  <h2 className="text-lg font-light uppercase tracking-[0.2em]">Secondary Cinematic Video</h2>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Hero Video URL (Below About Us)</label>
                  <input
                    value={localPromo.secondVideoUrl || ''}
                    onChange={e => setLocalPromo({...localPromo, secondVideoUrl: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-light"
                    placeholder="https://example.com/brand-video.mp4"
                  />
                  <p className="text-[8px] uppercase tracking-widest text-zinc-400 opacity-60">This video plays automatically below the 'About Us' section without text or buttons.</p>
                </div>
              </div>
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

          {/* Exact replica of the website's overhaul promo section */}
          <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-zinc-900 rounded-2xl border border-zinc-100 p-8">
            {/* Background Layer: Video or Image */}
            <div className="absolute inset-0 z-0">
              {localPromo.videoUrl ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  key={localPromo.videoUrl}
                  className="w-full h-full object-cover opacity-50"
                >
                  <source src={localPromo.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={localPromo.backgroundImage || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'}
                  alt="Promotion Background"
                  className="w-full h-full object-cover opacity-40 scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/50" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full text-center text-white">
               {/* Tagline */}
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="w-4 h-[1px] bg-accent" />
                  <span className="text-[8px] uppercase tracking-[0.4em] font-black text-accent">
                    {localPromo.tagline}
                  </span>
                  <div className="w-4 h-[1px] bg-accent" />
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-[0.9]">
                  {localPromo.title1} <br />
                  <span className="text-accent">{localPromo.titleAccent}</span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{localPromo.title2}</span>
                </h2>

                {/* Description */}
                <p className="text-[10px] uppercase tracking-[0.2em] font-light text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">
                  {localPromo.description}
                </p>

                {/* Promo Code - Glass Card */}
                {localPromo.code && (
                  <div className="mb-8 inline-block relative">
                    <div className="relative px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col items-center gap-1">
                       <span className="text-[7px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Coupon Code</span>
                       <span className="text-lg font-black tracking-[0.2em]">{localPromo.code}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                    <div className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] cursor-default opacity-80">
                      {localPromo.buttonText}
                    </div>
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
