'use client';

import { useState, useEffect } from 'react';
import { usePromoStore } from '@/store/usePromoStore';
import { Save, Image as ImageIcon, Layout, Type, Ticket, Video, Play, Link as LinkIcon, AlignLeft } from 'lucide-react';

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

  const uploadFile = async (file: File, path: string) => {
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) throw new Error('Supabase not initialized');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const url = await uploadFile(file, 'promo');
        setLocalPromo(prev => ({ ...prev, videoUrl: url }));
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('Failed to upload video to Supabase Storage. Make sure the "videos" bucket exists and is public.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSecondVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const url = await uploadFile(file, 'cinematic');
        setLocalPromo(prev => ({ ...prev, secondVideoUrl: url }));
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('Failed to upload video to Supabase Storage.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleVideoBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const url = await uploadFile(file, 'banner');
        setLocalPromo(prev => ({ ...prev, videoBannerUrl: url }));
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('Failed to upload video to Supabase Storage.');
      } finally {
        setIsSaving(false);
      }
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

                  <input type="file" id="second-video-upload" className="hidden" accept="video/mp4" onChange={handleSecondVideoUpload} />
                  <label
                    htmlFor="second-video-upload"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <ImageIcon className="w-3 h-3 text-accent" /> Select Second Video
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

          {/* ─── Video Promo Banner Editor ─── */}
          <div className="bg-white p-10 border border-zinc-100 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
              <div className="flex items-center gap-4">
                <Video className="w-5 h-5 text-accent" />
                <div>
                  <h2 className="text-lg font-light uppercase tracking-[0.2em]">Video Promo Banner</h2>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-1">Shown below New Arrivals section</p>
                </div>
              </div>
              <div>
                <input type="file" id="video-banner-upload" className="hidden" accept="video/mp4,video/webm" onChange={handleVideoBannerUpload} />
                <label
                  htmlFor="video-banner-upload"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-3 h-3" /> Upload Video
                </label>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Video URL (mp4 / webm direct link)</label>
                <input
                  value={localPromo.videoBannerUrl || ''}
                  onChange={e => setLocalPromo({...localPromo, videoBannerUrl: e.target.value})}
                  className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-light"
                  placeholder="https://example.com/promo-banner.mp4"
                />
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">Leave empty to hide this banner from the storefront.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Banner Heading</label>
                  <input
                    value={localPromo.videoBannerHeading || ''}
                    onChange={e => setLocalPromo({...localPromo, videoBannerHeading: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-bold uppercase"
                    placeholder="Crafted for the Bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Subtext</label>
                  <input
                    value={localPromo.videoBannerSubtext || ''}
                    onChange={e => setLocalPromo({...localPromo, videoBannerSubtext: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-light"
                    placeholder="Discover the new season collection"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">CTA Button Text</label>
                  <input
                    value={localPromo.videoBannerCta || ''}
                    onChange={e => setLocalPromo({...localPromo, videoBannerCta: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-bold uppercase tracking-widest"
                    placeholder="Shop Now"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">CTA Link</label>
                  <input
                    value={localPromo.videoBannerCtaLink || ''}
                    onChange={e => setLocalPromo({...localPromo, videoBannerCtaLink: e.target.value})}
                    className="w-full h-12 bg-zinc-50 border-none px-6 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-light"
                    placeholder="/products"
                  />
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
                  onLoadedData={(e) => e.currentTarget.play()}
                  key={localPromo.videoUrl}
                  src={localPromo.videoUrl}
                  className="w-full h-full object-cover opacity-50"
                />
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

          {/* New: Second Cinematic Video Preview */}
          <div className="space-y-6 pt-12 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                <Layout className="w-4 h-4 text-accent" /> Cinematic Banner Preview
              </h3>
            </div>

            <div className="relative min-h-[300px] flex items-center justify-center overflow-hidden bg-black rounded-2xl border border-zinc-100">
              {localPromo.secondVideoUrl ? (
                <>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={(e) => e.currentTarget.play()}
                    key={localPromo.secondVideoUrl}
                    src={localPromo.secondVideoUrl}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  <div className="relative z-10 text-center">
                     <span className="text-[8px] uppercase tracking-[0.5em] text-white/60 mb-2 block">The Art of Creation</span>
                     <h4 className="text-xl font-light text-white uppercase tracking-[0.2em]">Bespoke Mastery</h4>
                  </div>
                </>
              ) : (
                <div className="text-center p-12 text-zinc-500 uppercase tracking-widest text-[10px]">
                  No Cinematic Video Selected
                </div>
              )}
            </div>
          </div>

          {/* Video Promo Banner Live Preview */}
          <div className="space-y-4 pt-12 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                <Video className="w-4 h-4 text-accent" /> Video Promo Banner Preview
              </h3>
              <span className="px-2 py-1 bg-accent/10 text-accent text-[8px] font-bold uppercase tracking-widest rounded">
                Below New Arrivals
              </span>
            </div>

            <div className="relative min-h-[320px] flex items-center justify-center overflow-hidden bg-zinc-950 rounded-2xl border border-zinc-800">
              {localPromo.videoBannerUrl ? (
                <video
                  key={localPromo.videoBannerUrl}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  onLoadedData={(e) => e.currentTarget.play()}
                  src={localPromo.videoBannerUrl}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/50" />

              <div className="relative z-10 flex flex-col items-center text-center px-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-[1px] bg-accent" />
                  <span className="text-[8px] uppercase tracking-[0.5em] font-black text-accent">New Season</span>
                  <div className="w-6 h-[1px] bg-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3 leading-tight">
                  {localPromo.videoBannerHeading || 'Crafted for the Bold'}
                </h3>
                <p className="text-[9px] uppercase tracking-[0.25em] font-light text-white/50 mb-6 max-w-xs">
                  {localPromo.videoBannerSubtext || 'Discover the new season collection'}
                </p>
                <div className="px-7 py-2.5 border border-white/30 text-white text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  {localPromo.videoBannerCta || 'Shop Now'} <span>→</span>
                </div>
                {!localPromo.videoBannerUrl && (
                  <p className="mt-5 text-[8px] uppercase tracking-widest text-zinc-600">
                    Add a video URL above to activate on storefront
                  </p>
                )}
              </div>

              {/* Corner marks */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
