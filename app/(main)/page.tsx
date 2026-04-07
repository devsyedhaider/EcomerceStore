/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Star, Quote } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useHeroStore } from '@/store/useHeroStore';
import { usePromoStore } from '@/store/usePromoStore';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
  const products = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);
  const hero = useHeroStore((state) => state.hero);
  const promo = usePromoStore((state) => state.promo);
  const [mounted, setMounted] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const handleClaimDiscount = () => {
    if (promo.code) {
      navigator.clipboard.writeText(promo.code);
      setShowPromoModal(true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, [mounted, categories]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 20);
  const newArrivals = products.filter(p => p.isNew).slice(0, 20);

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Full-width Hero Banner — Minimalists Premium */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.backgroundImage}
            alt="ElvaEdit Boutique"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-6 w-full max-w-[1400px] mx-auto pt-20">
          <div className="flex flex-col items-center">
            {/* 2. Premium Typographic Stack — Unbreakable Single-Line Fluid Scale */}
            <h1 className="flex flex-col items-center text-center">
              <div className="overflow-hidden py-1 w-full flex justify-center">
                <motion.span 
                  initial={{ opacity: 0, y: 120 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-3xl sm:text-7xl md:text-8xl lg:text-[120px] font-lato font-black uppercase tracking-[-0.01em] text-white leading-tight px-4 whitespace-nowrap"
                >
                  {hero.title}
                </motion.span>
              </div>

              <div className="overflow-hidden py-1 -mt-2 md:-mt-6 w-full flex justify-center">
                <motion.span 
                   initial={{ opacity: 0, y: 120 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="block text-3xl sm:text-7xl md:text-8xl lg:text-[120px] font-lato font-black uppercase tracking-[-0.01em] leading-tight text-[#2C3524] px-4 whitespace-nowrap"
                >
                   {hero.accentTitle}
                </motion.span>
              </div>
            </h1>
          </div>
        </div>
      </section>

      {/* Promo Success Modal */}
      <AnimatePresence>
        {mounted && showPromoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPromoModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white p-12 text-center"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                 <CheckCircle2 className="w-10 h-10 text-accent animate-bounce-subtle" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-zinc-900">Code Copied!</h3>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-10 leading-relaxed">
                Use code <span className="text-black font-black">{promo.code}</span> at checkout to get <span className="text-accent underline">10% OFF</span> your first order.
              </p>
              <Link 
                href="/products" 
                className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center hover:bg-zinc-800 transition-all"
                onClick={() => setShowPromoModal(false)}
              >
                GO TO PRODUCTS
              </Link>
              <button 
                onClick={() => setShowPromoModal(false)}
                className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 hover:text-black transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Boutique Collections Avatar Navigation - Full Screen Centered */}
      <section className="py-12 bg-white border-b border-zinc-50">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: false }}
            className="flex flex-wrap items-start justify-center gap-6 md:gap-14 lg:gap-20"
          >
            {/* 1. New Arrivals */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }}>
              <Link href="/products?isNew=true" className="group flex flex-col items-center gap-4">
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-zinc-100 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/10">
                  <img 
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop" 
                    alt="New Arrivals" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-accent transition-colors">New Arrivals</span>
              </Link>
            </motion.div>

            {/* 2. Best Sellers */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} viewport={{ once: false }}>
              <Link href="/products?isTrending=true" className="group flex flex-col items-center gap-4">
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-zinc-100 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/10">
                  <img 
                    src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=200&auto=format&fit=crop" 
                    alt="Best Sellers" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-accent transition-colors">Best Sellers</span>
              </Link>
            </motion.div>

            {/* 3-6. First 4 Database Categories */}
            {categories.slice(0, 4).map((category, idx) => (
              <motion.div 
                key={category.id} 
                initial={{ opacity: 0, scale: 0.8 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ delay: (idx + 2) * 0.1 }} 
                viewport={{ once: false }}
              >
                <Link 
                  href={`/products?category=${category.id}`}
                  className="group flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-zinc-100 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/10">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-accent transition-colors">{category.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* 7. Shop All Avatar */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} viewport={{ once: false }}>
              <Link href="/categories" className="group flex flex-col items-center gap-4">
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-zinc-200 flex items-center justify-center transition-all duration-500 group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:scale-105 group-hover:shadow-xl">
                   <ArrowRight className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-zinc-400 group-hover:text-white transition-all group-hover:-rotate-45" />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-accent transition-colors">Shop all</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* 3. Trending Now Grid (Previously Featured) */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-row items-end justify-between mb-10 md:mb-16 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-light uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap">Trending Now</h2>
            </div>
            <Link href="/trending" className="text-[10px] md:text-xs uppercase tracking-[0.05em] md:tracking-[0.2em] font-black flex items-center gap-1 md:gap-2 group border-b border-black pb-1 mb-1 whitespace-nowrap">
              View All <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {featuredProducts.slice(0, 20).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 4) * 0.1, duration: 0.6 }}
                viewport={{ once: false }}
              >
                <ProductCard 
                  product={product} 
                  showNewBadge={false} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner - Professional Overhaul */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-accent py-24">
        {/* Background Layer: Video or Image */}
        <div className="absolute inset-0 z-0">
          {promo.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-50"
            >
              <source src={promo.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={promo.backgroundImage || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'}
              alt="Promotion Background"
              className="w-full h-full object-cover opacity-40 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/50" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="flex flex-col items-center"
          >
            {/* Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 flex items-center gap-4"
            >
              <div className="w-8 h-[1px] bg-accent" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black text-accent">
                {promo.tagline}
              </span>
              <div className="w-8 h-[1px] bg-accent" />
            </motion.div>

            {/* Main Heading */}
            <div className="overflow-hidden mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                className="text-5xl md:text-8xl font-black uppercase tracking-[0.05em] leading-[1.1] text-center"
              >
                {promo.title1} <br />
                <span className="text-accent italic-none">{promo.titleAccent}</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{promo.title2}</span>
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-sm md:text-base uppercase tracking-[0.2em] font-light text-zinc-400 max-w-xl mb-12 leading-relaxed"
            >
              {promo.description}
            </motion.p>

            {/* Promo Code - Integrated Typography */}
            {promo.code && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-12 flex flex-col items-center"
              >
                <div className="flex flex-col items-center gap-2 group cursor-default">
                   <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black opacity-60">Exclusive Access Code</span>
                   <div className="relative">
                      <span className="text-3xl md:text-5xl font-black tracking-[0.3em] font-lato">{promo.code}</span>
                      <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={handleClaimDiscount}
              className="group relative px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:text-white"
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{promo.buttonText}</span>
            </motion.button>
          </motion.div>
        </div>
        
        {/* Subtle Bottom Elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
           <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
           <span className="text-[8px] uppercase tracking-widest">Seasonal Collection Vol. 01</span>
        </div>
      </section>

      {/* 5. New Arrivals Grid */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-row items-end justify-between mb-10 md:mb-16 gap-4">
            <div className="text-left md:text-left">
              <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.3em] text-accent block mb-2">The Latest Drop</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-light uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap">New Arrivals</h2>
            </div>
            <Link href="/new-arrivals" className="text-[10px] md:text-xs uppercase tracking-[0.05em] md:tracking-[0.2em] font-black flex items-center gap-1 md:gap-2 group border-b border-black pb-1 mb-1 whitespace-nowrap">
              View All <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {newArrivals.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 4) * 0.1, duration: 0.6 }}
                viewport={{ once: false }}
              >
                <ProductCard 
                  product={product} 
                  showSaleBadge={false} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Section - Exact UI Match with Mockup */}
      <section className="py-24 md:py-32 bg-[#F9F9F9]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-0 bg-white shadow-sm border border-zinc-50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left: Cinematic Image - Now even narrower (4/12 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              className="relative md:col-span-4 min-h-[420px] bg-zinc-100 overflow-hidden group"
            >
              <img 
                src="/images/about/brand-story.png"
                alt="Editeval Craftsmanship"
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
              
              {/* Pink Brand Insignia (Matches your accent color) */}
              <div className="absolute bottom-8 left-8 flex flex-col items-center">
                 <div className="relative flex flex-col items-center gap-1">
                    <div className="w-12 h-12 border border-accent/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                       <span className="text-xl font-light text-accent tracking-tighter">GB</span>
                    </div>
                    <div className="w-8 h-[1px] bg-accent/40" />
                 </div>
              </div>

              {/* Branding name overlay (Subtle top left) */}
              <div className="absolute top-8 left-8">
                 <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold opacity-80">ElvaEdit</span>
              </div>
            </motion.div>

            {/* Right: Narrative Content - Wider (8/12 columns) with Unified Font Sizes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: false }}
              className="md:col-span-8 flex flex-col justify-center p-10 md:p-14 lg:p-20"
            >
              <h2 className="text-3xl md:text-4xl font-normal text-zinc-900 mb-8 font-sans tracking-tight">About us</h2>
              
              <div className="space-y-6 max-w-lg">
                <p className="text-[16px] leading-relaxed text-zinc-500 font-medium opacity-80">
                  ElvaEdit is a Pakistan based jewellery brand which was founded in 2026. Committed to create trendy, luxury and timeless pieces at an affordable price without compromising the quality or sustainability.
                </p>
                
                <p className="text-[16px] leading-relaxed text-zinc-500 font-medium opacity-80">
                  We’ve got something to suit everyone. Each of our pieces has its own personality – just like our customers.
                </p>
                
                <p className="text-[16px] leading-relaxed text-zinc-500 font-medium opacity-80">
                  At ElvaEdit, we provide the highest quality jewelry. Every purchase is an experience, not just a transaction.
                </p>
              </div>

              <div className="mt-12">
                <Link href="/products" className="inline-block px-10 py-3.5 border border-accent/40 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-white transition-all duration-700">
                  Shop Now
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cinematic Brand Video Section (New) */}
      <AnimatePresence>
        {promo.secondVideoUrl && (
          <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden bg-zinc-950">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: false }}
              className="absolute inset-0 z-0 bg-zinc-950"
            >
              {/* Luxury Static Fallback/Poster */}
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=100&w=2560&auto=format&fit=crop" 
                alt="Jewelry Backdrop" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
              />
              
              <video
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={(e) => {
                  e.currentTarget.play();
                }}
                onPlaying={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                key={promo.secondVideoUrl}
                src={promo.secondVideoUrl}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-0"
              />
              {/* Luxury Vignette & Grain */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            </motion.div>

            {/* Subtle Text Over Video */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-white/60 mb-6"
              >
                The Art of Creation
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="text-4xl md:text-6xl font-light text-white uppercase tracking-[0.2em] mb-4"
              >
                Bespoke Mastery
              </motion.h2>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="w-24 h-[1px] bg-accent origin-center"
              />
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* 7. Testimonials Section - Auto Sliding Premium Experience */}
      <section className="py-24 md:py-32 bg-zinc-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent mb-4"
            >
              The ElvaEdit Experience
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em] text-zinc-900"
            >
              What Our Community Says
            </motion.h2>
          </div>

          <div className="relative max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {[
                {
                  name: "Sarah Masood",
                  location: "Lahore, Pakistan",
                  review: "The quality of the ring is absolutely stunning. It feels so premium and looks even better in person compared to the pictures. My new favorite shop!",
                  stars: 5
                },
                {
                  name: "Aisha Ahmed",
                  location: "Karachi, Pakistan",
                  review: "ElvaEdit has become my go-to for luxury jewelry. The craftsmanship is exceptional and the customer service was extremely helpful during checkout.",
                  stars: 5
                },
                {
                  name: "Zainab Rashid",
                  location: "Islamabad, Pakistan",
                  review: "I bought the frozen collection pieces and I'm obsessed. The aesthetic is so unique. Highly recommend for anyone looking for statement pieces!",
                  stars: 5
                }
              ].map((testimonial, i) => i === activeTestimonial && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white p-12 md:p-20 border border-zinc-100 border-t-accent shadow-premium relative flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="absolute top-10 right-10 opacity-5">
                     <Quote className="w-20 h-20 text-accent -rotate-12" />
                  </div>
                  
                  <div className="flex gap-1 mb-10">
                    {[...Array(testimonial.stars)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl lg:text-3xl text-zinc-700 font-light leading-relaxed italic mb-14 opacity-90 max-w-3xl">
                    "{testimonial.review}"
                  </p>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-[1px] bg-accent/30 mb-6" />
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] text-zinc-900">{testimonial.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mt-2">{testimonial.location}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
               {[0, 1, 2].map((i) => (
                 <button 
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i === activeTestimonial ? 'w-8 bg-accent' : 'bg-zinc-200 hover:bg-zinc-300'}`}
                 />
               ))}
            </div>
          </div>
          
          <div className="mt-40 flex justify-center opacity-30">
             <div className="flex items-center gap-10">
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Bespoke Design</span>
                <div className="w-1 h-1 rounded-full bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Verified Reviews</span>
                <div className="w-1 h-1 rounded-full bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Premium Craft</span>
             </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="py-32 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-8">Join the Community</h2>
          <p className="text-gray-400 text-sm uppercase tracking-[0.1em] mb-12 max-w-xl mx-auto">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              const { supabase } = await import('@/lib/supabase');
              if (!supabase) return;
              
              const { error } = await supabase.from('newsletter_subs').insert([{ email }]);
              if (error) {
                if (error.code === '23505') {
                  alert('You are already subscribed!');
                } else {
                  alert('Error subscribing. Please try again.');
                }
              } else {
                alert('Thank you for subscribing!');
                form.reset();
              }
            }}
            className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
          >
            <input 
              required
              name="email"
              type="email" 
              placeholder="YOUR EMAIL" 
              className="flex-grow bg-transparent border-b border-gray-700 py-4 px-2 outline-none focus:border-white transition-premium text-sm tracking-widest"
            />
            <button type="submit" className="px-12 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium transition-premium hover:bg-gray-200">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

