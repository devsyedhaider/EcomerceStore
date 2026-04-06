'use client';

import { useMemo, useState, useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const products = useProductStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trendingProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-32 pb-24">
      {/* Page Header */}
      <div className="mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900">Trending Now</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Curated Selection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] text-zinc-900">
              Trending Now
            </h1>
          </div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 max-w-xs text-right">
            {trendingProducts.length} {trendingProducts.length === 1 ? 'piece' : 'pieces'} curated for you
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {trendingProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <TrendingUp className="w-16 h-16 text-zinc-100 mb-8" strokeWidth={1} />
          <h2 className="text-2xl font-light uppercase tracking-[0.3em] text-zinc-300 mb-4">
            No Trending Products Yet
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300 mb-12 max-w-xs">
            Mark products as trending in the admin panel to feature them here.
          </p>
          <Link
            href="/products"
            className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-zinc-900 pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      )}

      {/* Back to Shop */}
      {trendingProducts.length > 0 && (
        <div className="mt-24 pt-12 border-t border-zinc-100 flex justify-center">
          <Link
            href="/products"
            className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-zinc-900 pb-1 hover:text-accent hover:border-accent transition-colors flex items-center gap-2 group"
          >
            Browse All Products
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
