'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCategoryStore } from '@/store/useCategoryStore';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const { categories, isLoading } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-32 pb-24">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-premium-subheading mb-4"
        >
          Curated Selection
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-6xl font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-8"
        >
          Our <span className="text-accent font-bold">Collections</span>
        </motion.h1>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-px bg-accent/30 mb-8"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-light max-w-lg mx-auto leading-relaxed px-4"
        >
          Discover a world of craftsmanship and style. From timeless classics to contemporary icons, find the perfect pair for every journey.
        </motion.p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            <Link 
              href={`/products?category=${category.id}`}
              className="group relative h-[210px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[450px] overflow-hidden flex flex-col justify-end p-5 sm:p-8 md:p-10 bg-zinc-100 rounded-[8px]"
            >
              {/* Background Image with Zoom */}
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover transition-premium group-hover:scale-110 duration-1000"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-premium group-hover:via-black/40" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Decorative Border */}
              <div className="absolute inset-4 sm:inset-6 border border-white/0 group-hover:border-white/20 transition-premium duration-700 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 transform transition-transform duration-700 group-hover:-translate-y-1">
                <span className="text-white/60 text-[6px] sm:text-[9px] uppercase tracking-[0.3em] mb-1 sm:mb-2 block">
                  Fine Piece
                </span>
                <h2 className="text-sm sm:text-xl md:text-xl lg:text-2xl font-light text-white uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-4 leading-tight">
                  {category.name}
                </h2>
                
                <div className="flex items-center gap-2 sm:gap-4 group/btn">
                  <span className="text-white text-[6px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium border-b border-white/30 pb-0.5 sm:pb-1 group-hover/btn:border-white group-hover/btn:pr-3 sm:group-hover/btn:pr-6 transition-all duration-500">
                    Explore
                  </span>
                  <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center -translate-x-1 sm:-translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-premium">
                    <ChevronRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_70%)] transition-opacity duration-1000 pointer-events-none" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-light">
          Quality Guaranteed &bull; Fast Delivery &bull; Premium Experience
        </p>
      </motion.div>
    </div>
  );
}
