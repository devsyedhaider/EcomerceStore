'use client';

/* eslint-disable @next/next/no-img-element */
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatPrice, cn } from '@/lib/utils';
import { ArrowRight, Star, ShoppingCart, Tag, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // For each category, find the "Top Product"
  const categoriesWithTopProduct = categories.map(cat => {
    const catProducts = products.filter(p => 
        p.category.toLowerCase() === cat.id.toLowerCase() || 
        p.category.toLowerCase() === cat.name.toLowerCase()
    );
    // Find top product: designated first, then highest rating
    const topProduct = catProducts.sort((a, b) => {
        if (a.isTopInCategory !== b.isTopInCategory) {
            return a.isTopInCategory ? -1 : 1;
        }
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews - a.reviews;
    })[0];

    return {
        ...cat,
        topProduct,
        count: catProducts.length
    };
  });

  return (
    <div className="flex flex-col gap-24 pb-32">
        {/* Header Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop" 
                    alt="Categories Hero" 
                    className="w-full h-full object-cover opacity-50 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-zinc-950" />
            </div>
            
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <span className="text-accent font-black text-xs uppercase tracking-[0.6em] block">The Complete Archive</span>
                    <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">
                        ALL <br /> <span className="text-accent">CATEGORIES</span>
                    </h1>
                </motion.div>
            </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4">
            <div className="space-y-32">
                {categoriesWithTopProduct.map((category, index) => (
                    <motion.div 
                        key={category.name}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={cn(
                            "flex flex-col md:flex-row gap-16 items-center",
                            index % 2 === 1 ? "md:flex-row-reverse" : ""
                        )}
                    >
                        {/* Category Visual */}
                        <div className="w-full md:w-1/2 relative group">
                            <Link href={`/products?category=${category.id}`}>
                                <div className="relative aspect-[4/5] md:aspect-square rounded-[40px] overflow-hidden bg-zinc-100 border border-zinc-200">
                                    <img 
                                        src={category.image} 
                                        alt={category.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    
                                    <div className="absolute inset-0 flex flex-col justify-end p-12">
                                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                                            {category.name}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <span className="bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest">
                                                EXPLORE {category.count} ITEMS
                                            </span>
                                            <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-accent group-hover:border-accent transition-all">
                                                <ArrowRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Top Product Showcase */}
                        <div className="w-full md:w-1/2 space-y-10">
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest">
                                    <Zap className="w-4 h-4 fill-current" /> CHAMPION OF THE WEEK
                                </span>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic">BEST IN {category.name}</h3>
                            </div>

                            {category.topProduct ? (
                                <Link 
                                    href={`/products/${category.topProduct.id}`}
                                    className="block group/card"
                                >
                                    <div className="bg-white rounded-[40px] border border-zinc-100 p-8 shadow-2xl hover:shadow-accent/10 transition-all flex gap-8 items-center border-b-4 border-b-zinc-200">
                                        <div className="w-40 h-40 md:w-56 md:h-56 bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 flex-shrink-0">
                                            <img 
                                                src={category.topProduct.images[0]} 
                                                alt={category.topProduct.name} 
                                                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                        <div className="flex-grow space-y-4">
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={cn("w-4 h-4", i < Math.floor(category.topProduct.rating) ? "text-accent fill-current" : "text-zinc-200")} 
                                                    />
                                                ))}
                                                <span className="text-[10px] font-black uppercase text-zinc-400">({category.topProduct.reviews} Verified Reviews)</span>
                                            </div>
                                            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight group-hover/card:text-accent transition-colors">
                                                {category.topProduct.name}
                                            </h4>
                                            <p className="text-4xl font-black text-zinc-900 tracking-tighter italic">
                                                {formatPrice(category.topProduct.price)}
                                            </p>
                                            <div className="pt-4 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-400 group-hover/card:text-black transition-colors">
                                                VIEW PRODUCT <ArrowRight className="w-5 h-5 group-hover/card:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="bg-zinc-50 rounded-[40px] p-20 flex flex-col items-center justify-center text-center gap-4">
                                    <Tag className="w-12 h-12 text-zinc-300" />
                                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No products in this category yet</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Availability</span>
                                    <p className="font-bold text-sm uppercase">Quick Shipping Across Pakistan</p>
                                </div>
                                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quality</span>
                                    <p className="font-bold text-sm uppercase">100% Authentic Aura Series</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
            <div className="bg-black text-white rounded-[50px] p-12 md:p-24 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-full h-full opacity-30">
                    <img 
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop" 
                        alt="Join Aura" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                    />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-12">
                        STILL <br /> <span className="text-accent">UNDECIDED?</span>
                    </h2>
                    <Link href="/products" className="bg-white text-black px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-accent hover:text-white transition-all inline-flex items-center gap-4 group/cta">
                        VIEW ALL PRODUCTS <ArrowRight className="w-6 h-6 group-hover/cta:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    </div>
  );
}
