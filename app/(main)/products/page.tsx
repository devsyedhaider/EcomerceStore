'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter as FilterIcon, X, ChevronRight, ShoppingBag } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const isNewParam = searchParams.get('isNew') === 'true';
  const isTrendingParam = searchParams.get('isTrending') === 'true';

  const products = useProductStore((state) => state.products);
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const priceRanges = [
    { label: 'Under Rs. 5,000', value: '0-5000' },
    { label: 'Rs. 5,000 - 15,000', value: '5000-15000' },
    { label: 'Above Rs. 15,000', value: '15000-999999' },
  ];

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Filter by params
        if (isNewParam && !p.isNew) return false;
        if (isTrendingParam && !p.isFeatured) return false;

        const categoryMatch = selectedCategory === 'all' || 
                            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
                            categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === p.category.toLowerCase();
        
        const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        
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
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery, products, categories, isNewParam, isTrendingParam]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-24 pb-24">
      {/* Page Header - Unified Premium Style */}
      <div className="mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-bold uppercase tracking-[0.1em]">
            {isNewParam ? 'New Arrivals' : isTrendingParam ? 'Trending Now' : 'The Collection'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">Boutique Experience</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] text-zinc-900">
              {isNewParam ? 'New Arrivals' : isTrendingParam ? 'Trending Now' : selectedCategory === 'all' ? 'All Pieces' : `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-4">
             <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 text-right">
               {filteredProducts.length} Curated Masterpieces Available
             </p>
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-all bg-zinc-50 px-6 py-2 rounded-full border border-zinc-100"
                >
                  <FilterIcon className="w-4 h-4" /> {isFilterOpen ? 'Hide' : 'Filter'}
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Sidebar Filters - New Arrivals Style */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full md:w-64 flex-shrink-0"
            >
              <div className="space-y-12 sticky top-32">
                {/* Search Hub */}
                <div className="relative border-b border-zinc-100 pb-4">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    placeholder="LOCATE PIECE..." 
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
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
                        selectedCategory === 'all' ? "font-black text-black" : "text-zinc-400 hover:text-black"
                      )}
                    >
                      All Pieces
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
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

                {/* Pricing Selection */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8">Price range</h3>
                  <div className="flex flex-col gap-5">
                    <button 
                      onClick={() => setSelectedPriceRange('all')}
                      className={cn(
                        "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
                        selectedPriceRange === 'all' ? "font-black text-black border-b border-accent w-fit" : "text-zinc-400 hover:text-black"
                      )}
                    >
                      Any Price
                    </button>
                    {priceRanges.map(range => (
                      <button 
                        key={range.value}
                        onClick={() => setSelectedPriceRange(range.value)}
                        className={cn(
                          "text-left text-[10px] uppercase tracking-[0.2em] transition-all",
                          selectedPriceRange === range.value ? "font-black text-black border-b border-accent w-fit" : "text-zinc-400 hover:text-black"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-8">Ordering</h3>
                  <div className="flex flex-col gap-5">
                    <button 
                      onClick={() => setSortBy('newest')}
                      className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'newest' ? "text-accent" : "text-zinc-400")}
                    >
                      Latest First
                    </button>
                    <button 
                      onClick={() => setSortBy('price-low')}
                      className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'price-low' ? "text-accent" : "text-zinc-400")}
                    >
                      Price: Asc
                    </button>
                    <button 
                      onClick={() => setSortBy('price-high')}
                      className={cn("text-left text-[10px] uppercase tracking-[0.2em] transition-all font-bold", sortBy === 'price-high' ? "text-accent" : "text-zinc-400")}
                    >
                      Price: Desc
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-rose-500 border-t border-zinc-100 flex items-center justify-between transition-colors"
                >
                  Reset Studio <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className={cn(
              "grid gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20",
              isFilterOpen ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-zinc-50 rounded-[40px] border border-dashed border-zinc-200">
               <Search className="w-12 h-12 text-zinc-200 mb-8" />
               <h3 className="text-xl font-light uppercase tracking-[0.4em] mb-4">No Mastery Found</h3>
               <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em]">Adjust your collection filters to discover more.</p>
               <button 
                 onClick={() => {
                   setSelectedCategory('all');
                   setSelectedPriceRange('all');
                   setSearchQuery('');
                 }}
                 className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-accent"
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Boutique Hub...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
