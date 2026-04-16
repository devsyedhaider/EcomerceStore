'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-24 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-zinc-100 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <Heart className="w-5 h-5 text-accent" fill="currentColor" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">Your Selection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] text-zinc-900">
            Wishlist
          </h1>
        </div>
        
        {items.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-rose-500 transition-colors border-b border-transparent hover:border-rose-500 pb-1"
          >
            Clear All Items
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-20">
          {items.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlistPage={true} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8">
            <Heart className="w-10 h-10 text-zinc-200" strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-light uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-12 max-w-xs mx-auto leading-relaxed">
            Save your favorite handcrafted pieces here to keep them in mind for later.
          </p>
          <Link
            href="/products"
            className="btn-premium flex items-center gap-4"
          >
            Explore Collections <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
