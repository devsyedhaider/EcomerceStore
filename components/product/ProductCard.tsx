/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { Product } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryName = mounted ? (categories.find(c => c.id === product.category)?.name || product.category) : product.category;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.sizes[0], product.colors[0].name);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-white transition-premium"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Tags */}
      <div className="absolute top-4 right-4 z-20">
        {product.stock === 0 ? (
          <span className="bg-zinc-800/80 backdrop-blur-sm text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Sold Out
          </span>
        ) : (
          <span className="bg-[#e194b8] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#e194b8]/20">
            Sale
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-zinc-50 border border-zinc-100 group mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-transform duration-[1200ms] ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
        
        {/* Subtle ID Overlay */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10">
          <span className="text-white text-[10px] md:text-sm font-medium opacity-80 tracking-widest drop-shadow-sm uppercase">
            {product.id.startsWith('AV-') ? product.id : `${product.name.split(' ')[0]}-${product.id.slice(0,4)}`}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col px-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1.5">{categoryName}</span>
        <Link 
          href={`/products/${product.id}`} 
          className="text-zinc-900 text-sm md:text-base font-medium leading-snug hover:text-zinc-500 transition-colors mb-2 block line-clamp-2"
        >
          {product.name}
        </Link>
        
        <div className="flex items-center gap-2.5">
          <span className="text-zinc-400 line-through text-[11px] md:text-sm font-medium">
            {formatPrice(product.price * 2)}
          </span>
          <span className="text-[#e11d48] text-sm md:text-lg font-bold">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
