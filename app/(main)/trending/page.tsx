'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter as FilterIcon, X, TrendingUp, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function TrendingContent() {
  const searchParams = useSearchParams();
  const products = useProductStore((state) => state.products);
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const priceRanges = [
    { label: 'Under Rs. 5,000', value: '0-5000' },
    { label: 'Rs. 5,000 - 15,000', value: '5000-15000' },
    { label: 'Above Rs. 15,000', value: '15000-999999' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isFeatured) // ONLY TRENDING NOW
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
        if (sortBy === 'popular') return (b.reviews || 0) - (a.reviews || 0);
        return 0;
      });
  }, [products, selectedCategory, selectedPriceRange, sortBy, searchQuery, categories]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-24 pb-24">
      {/* 1. Header Section */}
      <div className="mb-12">
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-bold">Trending Now</span>
        </div>

        {/* Heading: One line on mobile */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
           <div className="flex items-center gap-4">
              <TrendingUp className="hidden md:block w-6 h-6 text-accent" />
              <h1 className="text-2xl md:text-6xl font-light uppercase tracking-[0.1em] md:tracking-[0.2em] text-zinc-900">
                Trending Now
              </h1>
           </div>
           
           <button 
              onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
              className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-all bg-zinc-50 px-6 py-2 rounded-full border border-zinc-100"
            >
              <FilterIcon className="w-4 h-4" /> {isDesktopFilterOpen ? 'Hide' : 'Filter'}
            </button>
        </div>

        {/* 2. Mobile Discovery Bar */}
        <div className="flex md:hidden items-center justify-between py-5 border-b border-zinc-50 mb-10">
           <button 
             onClick={() => setIsMobileFilterOpen(true)}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900"
           >
             <FilterIcon className="w-3 h-3 text-accent" /> Filter
           </button>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
             {filteredProducts.length} Trending Items
           </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-16 relative">
        
        {/* 3. Filter Drawer (Mobile) & Sidebar (Desktop) */}
        <AnimatePresence>
          {/* Mobile Drawer */}
          {isMobileFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[85%] bg-white z-[101] p-10 overflow-y-auto md:hidden shadow-2xl"
              >
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent">Studio Discovery</h2>
                     <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
                        <X className="w-6 h-6 text-zinc-400" />
                     </button>
                  </div>
                  <FilterContent 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setSelectedPriceRange={setSelectedPriceRange}
                    onInteraction={() => setIsMobileFilterOpen(false)}
                  />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className={cn(
          "hidden md:block flex-shrink-0 transition-all duration-500 overflow-hidden",
          isDesktopFilterOpen ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
        )}>
          <div className="w-64 space-y-12 sticky top-32">
             <FilterContent 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </div>
        </div>

        {/* 4. Product Grid */}
        <div className="flex-grow">
          <div className={cn(
            "grid gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20",
            (isDesktopFilterOpen) ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showNewBadge={false} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-zinc-50/50 rounded-[40px] border border-dashed border-zinc-200">
               <TrendingUp className="w-12 h-12 text-zinc-200 mb-8" />
               <h3 className="text-xl font-light uppercase tracking-[0.4em] mb-4">Discovery Empty</h3>
               <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em]">Try adjusting your trending filters.</p>
               <button 
                 onClick={() => {
                   setSelectedCategory('all');
                   setSearchQuery('');
                 }}
                 className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-accent hover:border-accent"
               >
                 View All Gallery
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Filter UI
function FilterContent({ 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  setSelectedPriceRange,
  onInteraction 
}: any) {
  const handleClick = (setter: any, val: any) => {
    setter(val);
    if(onInteraction) onInteraction();
  }

  return (
    <div className="space-y-12">
      {/* Search Hub */}
      <div className="relative border-b border-zinc-100 pb-4">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
        <input 
          type="text" 
          placeholder="SEARCH PIECES..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-4 py-2 bg-transparent border-none text-[10px] uppercase tracking-[0.2em] focus:ring-0 outline-none w-full"
        />
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8 underline decoration-accent underline-offset-4 decoration-2">Category</h3>
        <div className="flex flex-col gap-5">
          <button 
            onClick={() => handleClick(setSelectedCategory, 'all')}
            className={cn(
              "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
              selectedCategory === 'all' ? "font-black text-black" : "text-zinc-400 hover:text-black"
            )}
          >
            All Trending
          </button>
          {categories.map((cat: any) => (
            <button 
              key={cat.id}
              onClick={() => handleClick(setSelectedCategory, cat.id)}
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

      {/* Ordering Selection */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8">Arrangement</h3>
        <div className="flex flex-col gap-5">
          <button 
            onClick={() => handleClick(setSortBy, 'popular')}
            className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'popular' ? "text-accent" : "text-zinc-400")}
          >
            Most Celebrated
          </button>
          <button 
            onClick={() => handleClick(setSortBy, 'price-low')}
            className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'price-low' ? "text-accent" : "text-zinc-400")}
          >
            Investment: Asc
          </button>
          <button 
            onClick={() => handleClick(setSortBy, 'price-high')}
            className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'price-high' ? "text-accent" : "text-zinc-400")}
          >
            Investment: Desc
          </button>
        </div>
      </div>

      <button 
        onClick={() => {
          setSelectedCategory('all');
          setSelectedPriceRange('all');
          setSearchQuery('');
          if(onInteraction) onInteraction();
        }}
        className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-rose-500 border-t border-zinc-100 flex items-center justify-between transition-colors"
      >
        Reset Discovery <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Trends Hub...</div>}>
      <TrendingContent />
    </Suspense>
  );
}
