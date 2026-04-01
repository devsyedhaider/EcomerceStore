/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useHeroStore } from '@/store/useHeroStore';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { hero } = useHeroStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Full-width Hero Banner */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.backgroundImage} 
            alt="Aura Feet Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center text-white px-6">
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
            <Link 
              href="/products" 
              className="btn-premium border-white bg-transparent hover:bg-white hover:text-black"
            >
              {hero.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Category Sections (Men / Women / New Arrivals) */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {categories.slice(0, 3).map((category, index) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.id}`}
                className="group relative h-[600px] md:h-[700px] overflow-hidden"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-premium group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-premium" />
                <div className="absolute bottom-12 left-12">
                  <h3 className="text-3xl font-light text-white uppercase tracking-[0.2em] mb-6">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-white text-[10px] uppercase tracking-[0.3em] font-medium group-hover:translate-x-2 transition-premium">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-premium-subheading block mb-4">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em]">Featured Picks</h2>
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
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" 
            alt="Promotion" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-xs uppercase tracking-[0.4em] mb-6">Exclusive Offer</span>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] mb-10 max-w-2xl leading-tight">
            Elevate Your Style With <span className="font-medium">Premium Comfort</span>
          </h2>
          <Link href="/products" className="btn-premium">
            Explore Collection
          </Link>
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
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="flex-grow bg-transparent border-b border-gray-700 py-4 px-2 outline-none focus:border-white transition-premium text-sm tracking-widest"
            />
            <button className="px-12 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium transition-premium hover:bg-gray-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

