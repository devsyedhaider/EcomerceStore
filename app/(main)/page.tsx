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

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Full-width Hero Banner */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 text-premium-heading">
          <img 
            src={hero.backgroundImage} 
            alt="Aura Feet Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center text-white px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="text-xs uppercase tracking-[0.4em] font-medium mb-6 block">
              {hero.seasonText || 'New Season / 2024'}
            </span>
            <h1 className="text-5xl md:text-8xl font-light uppercase tracking-[0.2em] mb-10 leading-tight">
              {hero.title} <br />
              <span className="font-medium tracking-[0.1em]">{hero.accentTitle}</span>
            </h1>
            <p className="text-white/70 text-xs md:text-base font-light tracking-[0.15em] max-w-2xl mx-auto mb-12 leading-relaxed uppercase">
              {hero.subtitle}
            </p>
            <Link 
              href="/products" 
              className="btn-premium border-white bg-transparent hover:bg-white hover:text-black"
            >
              {hero.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Professional Category Drag Slider */}
      <section className="py-24 bg-white overflow-hidden select-none">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">Our Collections</h2>
            </div>
            <Link 
              href="/categories" 
              className="text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2 group border-b-2 border-black pb-2"
            >
              Discover All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
            </Link>
          </div>

          <div className="relative overflow-visible">
            <motion.div 
              ref={sliderRef}
              className="flex gap-16 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ right: 0, left: -sliderWidth }}
              dragElastic={0.1}
              initial={{ x: 0 }}
              whileTap={{ cursor: 'grabbing' }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
            >
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/products?category=${category.id}`}
                  className="flex-none group relative w-[300px] md:w-[420px] h-[280px] md:h-[380px] overflow-hidden bg-gray-100"
                  draggable={false}
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-premium group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-premium" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/30 backdrop-blur-[0px] group-hover:backdrop-blur-[4px] transition-premium opacity-0 group-hover:opacity-100">
                    <h3 className="text-xl md:text-3xl font-light text-white uppercase tracking-[0.5em] translate-y-4 group-hover:translate-y-0 transition-premium duration-500">
                      {category.name}
                    </h3>
                    <div className="mt-8 overflow-hidden">
                       <span className="text-white text-[9px] uppercase tracking-[0.5em] font-bold border border-white px-8 py-3 block translate-y-16 group-hover:translate-y-0 transition-premium duration-700">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          <div className="mt-20 flex justify-center">
            <Link href="/categories" className="btn-premium px-16 text-[10px]">
              Explore Complete Collections
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
            <Link href="/products" className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 group border-b border-black pb-1">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-premium" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="h-[500px] relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
          <img
            src={promo.backgroundImage || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'}
            alt="Promotion"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-xs uppercase tracking-[0.4em] mb-6">{promo.tagline}</span>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] mb-10 max-w-2xl leading-tight">
            {promo.title1} {promo.titleAccent && <span className="font-medium">{promo.titleAccent}</span>} {promo.title2}
          </h2>
          {promo.code && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs uppercase tracking-widest opacity-70">Code:</span>
              <span className="border border-current px-4 py-2 text-xs tracking-widest font-medium">{promo.code}</span>
            </div>
          )}
          <Link href="/products" className="btn-premium">
            {promo.buttonText}
          </Link>
          {promo.description && (
            <p className="mt-4 text-xs uppercase tracking-[0.15em] opacity-50">{promo.description}</p>
          )}
        </div>
      </section>

      {/* 5. New Arrivals Grid */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-premium-subheading block mb-4">The Latest Drop</span>
            <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">New Arrivals</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
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

