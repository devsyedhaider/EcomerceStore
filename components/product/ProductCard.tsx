/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';

import { Product } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';

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
      className="group relative flex flex-col h-full bg-white rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-zinc-100/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.isNew && (
        <span className="absolute top-6 left-6 z-10 bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
          New Drop
        </span>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-transform duration-[1500ms] ease-out",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        {/* Quick Actions overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/10 transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        <div className={cn(
          "absolute inset-x-6 bottom-6 transition-all duration-500 transform z-20",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-2xl active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Quick Buy
          </button>
        </div>

        <button className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-accent hover:text-white transition-all transform hover:scale-110 border border-white/20 z-20">
          <Heart className="w-4 h-4" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{categoryName}</span>
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
            <Star className="w-2.5 h-2.5 fill-accent text-accent" />
            <span className="text-[10px] font-black text-zinc-700">{product.rating}</span>
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block text-zinc-900 font-black text-lg group-hover:text-accent transition-colors mb-3 tracking-tighter uppercase italic">
          {product.name}
        </Link>
        
        <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter text-black">{formatPrice(product.price)}</span>
          <div className="flex -space-x-1.5">
            {product.colors.map((color) => (
              <span 
                key={color.name}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
