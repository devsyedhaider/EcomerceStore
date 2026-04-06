/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useHeroStore } from '@/store/useHeroStore';
import { usePromoStore } from '@/store/usePromoStore';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { hero } = useHeroStore();
  const { promo } = usePromoStore();
  const [mounted, setMounted] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, [mounted, categories]);

  if (!mounted) return null;

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 20);
  const newArrivals = products.filter(p => p.isNew).slice(0, 20);

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Full-width Hero Banner */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 text-premium-heading">
          <img 
            src={hero.backgroundImage} 
            alt="THE AURIC VAULT Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center text-white px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-[0.15em] mb-12 leading-none font-lato">
              ELEGANCE <br />
              <span className="font-normal tracking-[0.1em] text-accent-light">REDEFINED</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. Boutique Collections Avatar Navigation - Full Screen Centered */}
      <section className="py-12 bg-white border-b border-zinc-50">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-14 lg:gap-20">
            {/* 1. New Arrivals */}
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

            {/* 2. Best Sellers */}
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

            {/* 3-6. First 4 Database Categories */}
            {categories.slice(0, 4).map((category) => (
              <Link 
                key={category.id} 
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
            ))}

            {/* 7. Shop All Avatar */}
            <Link href="/categories" className="group flex flex-col items-center gap-4">
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-zinc-200 flex items-center justify-center transition-all duration-500 group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:scale-105 group-hover:shadow-xl">
                 <ArrowRight className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-zinc-400 group-hover:text-white transition-all group-hover:-rotate-45" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-accent transition-colors">Shop all</span>
            </Link>
          </div>
        </div>
      </section>


      {/* 3. Trending Now Grid (Previously Featured) */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">Trending Now</h2>
            </div>
            <Link href="/trending" className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 group border-b border-black pb-1">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {featuredProducts.slice(0, 20).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showNewBadge={false} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner - Professional Overhaul */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-900 py-24">
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
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {/* Tagline */}
            <div className="mb-6 flex items-center gap-4">
              <div className="w-8 h-[1px] bg-accent" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black text-accent">
                {promo.tagline}
              </span>
              <div className="w-8 h-[1px] bg-accent" />
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-8 leading-[0.9] italic-none">
              {promo.title1} <br />
              <span className="text-accent italic-none">{promo.titleAccent}</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{promo.title2}</span>
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base uppercase tracking-[0.2em] font-light text-zinc-400 max-w-xl mb-12 leading-relaxed">
              {promo.description}
            </p>

            {/* Promo Code - Glass Card */}
            {promo.code && (
              <div className="group mb-12 relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-accent to-accent-light opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                <div className="relative px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center gap-1 shadow-2xl">
                   <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Use Code at Checkout</span>
                   <span className="text-xl md:text-2xl font-black tracking-[0.2em]">{promo.code}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link 
              href="/products" 
              className="group relative px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:text-white"
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{promo.buttonText}</span>
            </Link>
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left md:text-left">
              <span className="text-premium-subheading block mb-4">The Latest Drop</span>
              <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">New Arrivals</h2>
            </div>
            <Link href="/new-arrivals" className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 group border-b border-black pb-1">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {newArrivals.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showSaleBadge={false} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Newsletter Section */}
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

