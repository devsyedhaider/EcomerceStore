/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useHeroStore } from '@/store/useHeroStore';
import { usePromoStore } from '@/store/usePromoStore';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function Home() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { hero } = useHeroStore();
  const { promo } = usePromoStore();
  const [mounted, setMounted] = useState(false);
  const [featuredCategory, setFeaturedCategory] = useState('all');

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const filteredFeaturedProducts = products.filter(p => {
    const isFeatured = p.isFeatured;
    const categoryMatch = featuredCategory === 'all' || p.category.toLowerCase() === featuredCategory.toLowerCase();
    return isFeatured && categoryMatch;
  }).slice(0, 4);

  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const featuredTabs = [
    { id: 'all', name: 'All Picks' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'kids', name: 'Kids' },
    { id: 'sports', name: 'Performance' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.backgroundImage} 
            alt="Aura Feet Hero" 
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mb-8"
            >
                <span className="w-12 h-[2px] bg-accent" />
                <span className="text-accent font-black text-xs uppercase tracking-[0.4em]">{hero.seasonText}</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] mb-8 tracking-tighter uppercase italic">
              {hero.title} <br /> <span className="text-accent">{hero.accentTitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-xl leading-relaxed font-medium">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-black tracking-widest">
              <Link href="/products" className="bg-white text-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:bg-accent hover:text-white transition-all shadow-2xl group">
                {hero.buttonText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/products?category=sports" className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-2xl hover:bg-white hover:text-black transition-all backdrop-blur-sm">
                VIEW LOOKBOOK
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stat */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-12 right-12 hidden lg:flex items-center gap-6 bg-white/5 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 shadow-2xl"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-accent blur-xl opacity-40 animate-pulse" />
                <div className="relative bg-accent p-4 rounded-2xl">
                    <Star className="text-white w-8 h-8 fill-current" />
                </div>
            </div>
            <div>
                <p className="text-white font-black text-3xl">4.9/5</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Global Reviews</p>
            </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 -mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: 'Hyper Speed Delivery', desc: 'Arrives in 24-48 hours across Pakistan' },
            { icon: ShieldCheck, title: 'Certified Authentic', desc: '100% original Aura Feet performance gear' },
            { icon: RefreshCw, title: 'No-Questions Exchange', desc: 'Easy 15-day return policy for peace of mind' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl flex flex-col gap-6 border border-zinc-100 group hover:bg-black hover:scale-[1.02] transition-all duration-500"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-md uppercase tracking-widest group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed mt-2 group-hover:text-zinc-400 transition-colors uppercase tracking-tight">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Bento Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent font-black text-xs uppercase tracking-[0.4em]">Curated Series</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 uppercase italic leading-none">THE VOID <br />COLLECTIONS</h2>
          </div>
          <Link href="/categories" className="group flex items-center gap-3 text-sm font-black bg-zinc-100 hover:bg-black hover:text-white px-8 py-4 rounded-2xl transition-all w-fit uppercase tracking-widest">
            EXPLORE ALL <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 h-[800px] gap-6">
            {/* Main Big Category */}
            {categories[0] && (
              <Link 
                  href={`/products?category=${categories[0].id}`}
                  className="md:col-span-8 md:row-span-2 relative rounded-[40px] overflow-hidden group border border-zinc-100"
              >
                  <div className="absolute inset-0 z-0">
                      <img src={categories[0].image} alt={categories[0].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-12 left-12 z-10">
                      <span className="text-accent font-black text-xs uppercase tracking-widest mb-4 block">Engineered for Power</span>
                      <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter">{categories[0].name} SERIES</h3>
                      <div className="mt-8 bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest inline-flex group-hover:bg-accent group-hover:text-white transition-colors">
                          SHOP SERIES
                      </div>
                  </div>
              </Link>
            )}

            {/* Side Small Top */}
            {categories[1] && (
              <Link 
                  href={`/products?category=${categories[1].id}`}
                  className="md:col-span-4 relative rounded-[40px] overflow-hidden group border border-zinc-100"
              >
                  <img src={categories[1].image} alt={categories[1].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute bottom-10 left-10">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{categories[1].name} SERIES</h3>
                  </div>
              </Link>
            )}

            {/* Side Small Bottom */}
            {categories[2] && (
              <Link 
                  href={`/products?category=${categories[2].id}`}
                  className="md:col-span-4 relative rounded-[40px] overflow-hidden group border border-zinc-100"
              >
                  <img src={categories[2].image} alt={categories[2].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute bottom-10 left-10">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{categories[2].name} SERIES</h3>
                  </div>
              </Link>
            )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-32 relative overflow-hidden">
        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
            <h2 className="text-[25vw] font-black uppercase tracking-tighter italic">ELITE</h2>
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
                <span className="text-accent font-black text-xs uppercase tracking-[0.5em]">Selected for You</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mt-4 uppercase italic">FEATURED</h2>
                <div className="w-16 h-1 bg-black mt-6" />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {featuredTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFeaturedCategory(tab.id)}
                        className={cn(
                            "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                            featuredCategory === tab.id 
                                ? "bg-black text-white shadow-xl scale-110" 
                                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        )}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {filteredFeaturedProducts.length > 0 ? (
                    filteredFeaturedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No featured items in this category yet.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-24 flex justify-center">
                <Link href="/categories" className="group relative overflow-hidden bg-black text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                    <span className="relative z-10">VIEW ALL COLLECTIONS</span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
            </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] md:h-[550px] rounded-[48px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl group"
        >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-[#7a0d1a] z-10" />
                <img 
                    src={promo.backgroundImage} 
                    alt="Premium Promo" 
                    className="w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent opacity-20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 left-1/2 w-64 h-64 bg-accent/30 opacity-20 blur-[100px] rounded-full" />
            </div>
            
            <div className="relative z-20 h-full flex items-center p-12 md:p-24">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <span className="w-12 h-[2px] bg-accent" />
                        <span className="text-accent font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">{promo.tagline}</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 text-white uppercase italic">
                        {promo.title1} <span className="text-accent italic">{promo.titleAccent}</span> <br />{promo.title2}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-12">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">Use Code</span>
                            <span className="text-white font-black bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 text-xs tracking-widest">{promo.code}</span>
                        </div>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{promo.description}</p>
                    </div>

                    <Link href="/products" className="group/btn relative overflow-hidden bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
                        <span className="relative z-10">{promo.buttonText}</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </motion.div>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent font-black text-xs uppercase tracking-[0.4em]">The Latest Drop</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 uppercase italic">NEW ARRIVALS</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-2">Engineered for the future, ready for the streets.</p>
          </div>
          <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5 rotate-180" />
              </div>
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center cursor-pointer bg-black text-white hover:bg-accent hover:border-accent transition-all">
                  <ArrowRight className="w-5 h-5" />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
}
