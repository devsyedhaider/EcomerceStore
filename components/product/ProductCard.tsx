/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Plus } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { Product } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { motion, AnimatePresence } from 'framer-motion';

import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = mounted ? isInWishlist(product.id) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryName = mounted ? (categories.find(c => c.id === product.category)?.name || product.category) : product.category;
  
  // Default rating to 4.5 if not provided
  const productRating = product.rating || 4.5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default';
    
    addItem(product, defaultSize, defaultColor);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/products/${product.id}`}
    >
      {/* Image Container */}
      <div className="block relative aspect-[4/5] overflow-hidden bg-[#F8F8F8]">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-all duration-1000 ease-out-expo absolute inset-0",
            isHovered && product.images[1] ? "opacity-0 scale-110" : "opacity-100 scale-100"
          )}
        />
        
        {/* Secondary Image (Swap on Hover) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={cn(
              "object-cover w-full h-full transition-all duration-1000 ease-out-expo absolute inset-0",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-black/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              New Arrival
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Low Stock
            </span>
          )}
          {product.price < 500 && (
             <span className="bg-[#e194b8] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#e194b8]/20">
              Promo
            </span>
          )}
        </div>

        {/* Status Badge (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10">
          {product.stock === 0 ? (
            <span className="bg-zinc-800/80 backdrop-blur-sm text-white text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest">
              Sold Out
            </span>
          ) : (
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-black/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-wide">In Stock</span>
            </div>
          )}
        </div>

        {/* Floating Actions */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500 z-20",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}>
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shadow-2xl hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="Quick Add"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </button>
          <div 
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               window.location.href = `/products/${product.id}`;
            }}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shadow-2xl hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="View Details"
          >
            <Eye size={20} strokeWidth={1.5} />
          </div>
          <button 
            onClick={handleWishlist}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer",
              isWishlisted ? "bg-rose-500 text-white" : "bg-white text-black hover:bg-rose-500 hover:text-white"
            )}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={20} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col p-6 flex-grow" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{categoryName}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs text-[10px] font-bold">★</span>
            <span className="text-zinc-500 text-[10px] font-medium">{productRating}</span>
          </div>
        </div>

        <Link 
          href={`/products/${product.id}`} 
          className="text-zinc-900 text-base md:text-lg font-bold leading-tight hover:text-accent transition-colors mb-3 block line-clamp-1"
        >
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {product.price > 0 && (
              <span className="text-zinc-400 line-through text-xs font-medium mb-0.5">
                {formatPrice(product.price * 1.5)}
              </span>
            )}
            <span className="text-black text-xl font-black tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:text-accent transition-colors duration-300 cursor-pointer"
          >
            Add
            <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white group-hover/btn:border-black transition-all">
              <Plus size={14} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>


  );
}

