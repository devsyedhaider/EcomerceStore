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
      {/* Badge */}
      {product.isNew && (
        <span className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-medium px-3 py-1 uppercase tracking-[0.2em] pointer-events-none">
          New
        </span>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-premium duration-1000",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
        
        {/* Quick Add Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-sm"
            >
              <button 
                onClick={handleAddToCart}
                className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium transition-premium hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="absolute top-4 right-4 p-2 text-black hover:text-gray-light transition-premium z-20">
          <Heart className="w-5 h-5 stroke-[1.2]" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow text-center px-2">
        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-light mb-2">{categoryName}</span>
        <Link href={`/products/${product.id}`} className="block text-black text-sm uppercase tracking-widest font-medium mb-3 hover:text-gray-light transition-premium">
          {product.name}
        </Link>
        <span className="text-sm font-medium text-black">{formatPrice(product.price)}</span>
        
        {/* Color Indicators (Subtle) */}
        <div className="flex items-center justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-premium">
          {product.colors.map((color) => (
            <span 
              key={color.name}
              className="w-2.5 h-2.5 rounded-full border border-gray-200"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
