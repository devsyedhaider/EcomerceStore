'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter as FilterIcon, X, Sparkles, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function NewArrivalsContent() {
  const searchParams = useSearchParams();
  const products = useProductStore((state) => state.products);
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Closed by default on mobile, open on desktop via CSS
  const [searchQuery, setSearchQuery] = useState('');

  const priceRanges = [
    { label: 'Under Rs 5,000', value: '0-5000' },
    { label: 'Rs 5,000 - 10,000', value: '5000-10000' },
    { label: 'Above Rs 10,000', value: '10000-999999' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isNew)
      .filter((p) => {
        const categoryMatch = selectedCategory === 'all' || 
                            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
                            categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === p.category.toLowerCase();
        const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        let priceMatch = true;
        if (selectedPriceRange !== 'all') {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            priceMatch = p.price >= min && p.price <= max;
        }

        return categoryMatch && priceMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, selectedPriceRange, sortBy, searchQuery, categories]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-24 pb-24">
      {/* 1. New Desktop/Mobile Header Layout */}
      <div className="mb-12">
        {/* Breadcrumb - Hidden on very small screens for cleanliness */}
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-bold">New Arrivals</span>
        </div>

        {/* Heading Section: One line on mobile */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light uppercase tracking-[0.1em] md:tracking-[0.2em] text-zinc-900 leading-tight">
            New <span className="text-accent font-medium">Arrivals</span>
          </h1>
          
          {/* Desktop Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="hidden xl:flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-all bg-zinc-50 px-6 py-2 rounded-full border border-zinc-100"
          >
            <FilterIcon className="w-4 h-4" /> {isFilterOpen ? 'Hide' : 'Filter'}
          </button>
        </div>

        {/* 2. Mobile Specific Sub-heading bar */}
        <div className="flex xl:hidden items-center justify-between py-5 border-b border-zinc-50 mb-10">
           <button 
             onClick={() => setIsFilterOpen(true)}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900"
           >
             <FilterIcon className="w-3 h-3 text-accent" /> Filter
           </button>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
             {filteredProducts.length} Products
           </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-16 relative">
        
        {/* 3. Universal Filter Bar (Desktop Sidebar & Mobile Drawer) */}
        <AnimatePresence>
          {/* Desktop Sidebar OR Mobile Drawer */}
          {(isFilterOpen || (mounted && window.innerWidth >= 1280)) && (
            <>
              {/* Mobile Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] xl:hidden"
              />

              {/* Filter Content */}
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={cn(
                  "flex-shrink-0 z-[101]",
                  "fixed top-0 left-0 bottom-0 w-80 bg-white p-10 overflow-y-auto", // Mobile Drawer
                  "xl:relative xl:inset-auto xl:w-64 xl:bg-transparent xl:p-0 xl:z-0 xl:block" // Desktop Sidebar
                )}
              >
                {/* Mobile Header for Filter Drawer */}
                <div className="flex items-center justify-between xl:hidden mb-12">
                   <h2 className="text-sm font-black uppercase tracking-[0.3em]">Discovery Filters</h2>
                   <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2">
                      <X className="w-5 h-5 text-zinc-400" />
                   </button>
                </div>

                <div className="space-y-12 sticky top-32">
                  {/* Search */}
                  <div className="relative border-b border-zinc-100 pb-4">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input 
                      type="text" 
                      placeholder="FIND IN NEW..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-2 bg-transparent border-none text-[10px] uppercase tracking-[0.2em] focus:ring-0 outline-none w-full"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8 underline decoration-accent underline-offset-4 decoration-2">Category</h3>
                    <div className="flex flex-col gap-5">
                      <button 
                        onClick={() => { setSelectedCategory('all'); if(window.innerWidth < 768) setIsFilterOpen(false); }}
                        className={cn(
                          "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
                          selectedCategory === 'all' ? "font-black text-black" : "text-zinc-400 hover:text-black"
                        )}
                      >
                        All New Products
                      </button>
                      {categories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.id); if(window.innerWidth < 768) setIsFilterOpen(false); }}
                          className={cn(
                            "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
                            selectedCategory === cat.id ? "font-black text-black" : "text-zinc-400 hover:text-black"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Option */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8">Sort by Price</h3>
                    <div className="flex flex-col gap-5">
                        <button 
                          onClick={() => setSortBy('newest')}
                          className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all", sortBy === 'newest' ? "font-black text-accent" : "text-zinc-400")}
                        >
                          Default Order
                        </button>
                        <button 
                          onClick={() => setSortBy('price-low')}
                          className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all", sortBy === 'price-low' ? "font-black text-accent" : "text-zinc-400")}
                        >
                          Low to High
                        </button>
                        <button 
                          onClick={() => setSortBy('price-high')}
                          className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all", sortBy === 'price-high' ? "font-black text-accent" : "text-zinc-400")}
                        >
                          High to Low
                        </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedPriceRange('all');
                      setSearchQuery('');
                      if(window.innerWidth < 768) setIsFilterOpen(false);
                    }}
                    className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-rose-500 border-t border-zinc-100 flex items-center justify-between transition-colors"
                  >
                    Reset Curation <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 4. Product Grid */}
        <div className="flex-grow">
          <div className={cn(
            "grid gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20 grid-cols-2 sm:grid-cols-2",
            (isFilterOpen || (mounted && window.innerWidth >= 1280)) ? "xl:grid-cols-2 2xl:grid-cols-3" : "xl:grid-cols-3 2xl:grid-cols-4"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-zinc-50 rounded-[40px] border border-dashed border-zinc-200">
              <Search className="w-12 h-12 text-zinc-200 mb-8" />
              <h3 className="text-xl font-light uppercase tracking-[0.4em] mb-4">No Matches Found</h3>
              <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em]">Try refining your collection filters.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-12 btn-premium px-12"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing New Arrival Gallery...</div>}>
      <NewArrivalsContent />
    </Suspense>
  );
}
