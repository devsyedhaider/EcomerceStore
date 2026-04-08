/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Plus, X, Star } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { Product } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { motion, AnimatePresence } from 'framer-motion';

import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
  showSaleBadge?: boolean;
  isWishlistPage?: boolean;
}

export default function ProductCard({ 
  product, 
  showNewBadge = true, 
  showSaleBadge = true,
  isWishlistPage = false 
}: ProductCardProps) {
  const router = useRouter();
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

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] cursor-pointer border border-zinc-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Remove from Wishlist button — only on wishlist page */}
      {isWishlistPage && (
        <button
          onClick={handleWishlist}
          title="Remove from wishlist"
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#6B7C3C] hover:bg-[#6B7C3C] hover:text-white shadow-md border border-zinc-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
      {/* Image Container */}
      <div className="block relative aspect-[4/3] md:aspect-square overflow-hidden bg-[#F8F8F8]">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-all duration-[1200ms] ease-[0.4, 0, 0.2, 1] absolute inset-0",
            isHovered && product.images[1] ? "opacity-0 scale-110" : "opacity-100 scale-100",
            isHovered && !product.images[1] ? "scale-110" : ""
          )}
        />
        
        {/* Secondary Image (Swap on Hover) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={cn(
              "object-cover w-full h-full transition-all duration-[1200ms] ease-[0.4, 0, 0.2, 1] absolute inset-0",
              isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"
            )}
          />
        )}

        {/* Action Buttons with Staggered Entrance */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center gap-3 transition-all duration-700 z-20",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <motion.button 
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              onClick={handleAddToCart}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white text-black rounded-full shadow-2xl hover:bg-accent hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={1.2} />
            </motion.button>
          <motion.div 
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               router.push(`/products/${product.id}`);
            }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white text-black rounded-full shadow-2xl hover:bg-accent hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Eye size={18} strokeWidth={1.2} />
          </motion.div>
          <motion.button 
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            onClick={handleWishlist}
            className={cn(
              "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer",
              isWishlisted ? "bg-accent text-white" : "bg-white text-black hover:bg-accent hover:text-white"
            )}
          >
            <Heart size={18} strokeWidth={1.2} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2 z-10 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">
          {mounted && product.isNew && showNewBadge && (
            <span className="bg-black/90 backdrop-blur-md text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg">
              New Arrival
            </span>
          )}
          {mounted && (product.price < 500 || product.isFeatured) && showSaleBadge && (
             <span className="bg-accent text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg shadow-accent/20">
              Sale
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
          {product.stock === 0 ? (
            <span className="bg-zinc-800/80 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-xl uppercase tracking-widest">
              Sold Out
            </span>
          ) : (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm border border-black/5">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-600 text-[9px] md:text-[10px] font-bold uppercase tracking-wide">In Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col p-4 md:p-6 flex-grow" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{categoryName}</span>
          <div className="flex items-center gap-0.5">
             {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-2.5 h-2.5", 
                    i < Math.floor(productRating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                  )} 
                />
             ))}
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
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center transition-all duration-500 group-hover/btn:bg-black group-hover/btn:scale-110 shadow-lg shadow-accent/20">
              <Plus size={14} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>


  );
}

