'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCategoryStore } from '@/store/useCategoryStore';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-32 pb-24">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.3em] mb-6">Our Collections</h1>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-light max-w-xl mx-auto leading-relaxed">
          Explore our range of premium footwear, from performance sports gear to elegant formal classics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link 
              href={`/products?category=${category.id}`}
              className="group relative h-[500px] overflow-hidden flex flex-col justify-end p-12 bg-gray-50"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover transition-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-premium" />
              
              <div className="relative z-10">
                <h2 className="text-4xl font-light text-white uppercase tracking-[0.2em] mb-4">
                  {category.name}
                </h2>
                <div className="flex items-center gap-4 group/btn">
                  <span className="text-white text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white pb-1 group-hover/btn:pr-4 transition-all duration-500">
                    Discover Collection
                  </span>
                  <ChevronRight className="w-4 h-4 text-white transition-premium group-hover/btn:translate-x-2" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
