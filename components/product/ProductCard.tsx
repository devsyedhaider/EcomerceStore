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
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
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
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 font-bold uppercase tracking-widest text-[9px]">
          {mounted && product.isNew && showNewBadge && (
            <span className="bg-black/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg">
              New Arrival
            </span>
          )}
          {mounted && (product.price < 500 || product.isFeatured) && showSaleBadge && (
             <span className="bg-[#e194b8] text-white px-4 py-1.5 rounded-full shadow-lg shadow-[#e194b8]/20">
              Sale
            </span>
          )}
          {mounted && product.stock > 0 && product.stock <= 5 && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Removal Button (Corner) */}
        {isWishlistPage && (
          <div className="absolute top-4 right-4 z-30">
            <button 
              onClick={handleWishlist}
              className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md text-black rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all cursor-pointer group/remove"
              title="Remove from Wishlist"
            >
              <X className="w-5 h-5 stroke-[1.2] group-hover/remove:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        )}

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
               router.push(`/products/${product.id}`);
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
             <span className="text-zinc-400 text-[9px] font-bold ml-1">{productRating}</span>
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

