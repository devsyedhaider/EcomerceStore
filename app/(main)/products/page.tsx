'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter as FilterIcon, X, ShoppingBag, ChevronRight } from 'lucide-react';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
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

  const currentCategoryName = categories.find(c => c.id === setSelectedCategory)?.name || 'The Full Collection';

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Cinematic Hero Header: 70vh Height */}
      <section className="h-[70vh] min-h-[500px] w-full flex flex-col items-center justify-center text-center px-6 bg-zinc-50 border-b border-zinc-100 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
         
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl space-y-10 relative z-10"
         >
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-accent animate-pulse" />
              <span className="text-[12px] uppercase tracking-[0.6em] font-black text-accent">The ElvaEdit Gallery</span>
            </div>
            
            <h1 className="text-4xl md:text-8xl font-light uppercase tracking-[0.15em] text-zinc-900 leading-[1.1]">
               {selectedCategory === 'all' ? 'All Pieces' : categories.find(c => c.id === selectedCategory)?.name || 'Collection'}
            </h1>
            
            <p className="text-zinc-500 text-xs md:text-sm font-medium max-w-xl mx-auto uppercase tracking-[0.4em] leading-[2]">
               Discover a curated archive of artisanal jewelry. From rare gemstones to masterfully forged metals, our entire collection is designed to be an extension of your individual narrative.
            </p>
         </motion.div>
         
         {/* Breadcrumb */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
            <Link href="/" className="hover:text-zinc-900">Home</Link>
            <ChevronRight className="w-3 h-3 text-accent" />
            <span className="text-zinc-900 font-bold uppercase tracking-[0.1em]">Collection Gallery</span>
         </div>
      </section>

      {/* 2. Collection Content Hub */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16">
        
        {/* Mobile Discovery Sub-bar */}
        <div className="flex md:hidden items-center justify-between py-6 border-b border-zinc-50 mb-12">
           <button 
             onClick={() => setIsMobileFilterOpen(true)}
             className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900"
           >
             <FilterIcon className="w-4 h-4 text-accent" /> Filter Explore
           </button>
           <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
             {filteredProducts.length} Items Found
           </span>
        </div>

        {/* Action Bar for Desktop */}
        <div className="hidden md:flex items-center justify-between mb-16 pb-8 border-b border-zinc-50">
           <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
             Currently Displaying <span className="text-zinc-900 font-bold">{filteredProducts.length}</span> Curated Masterpieces
           </p>
           <button 
              onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-accent transition-all bg-zinc-50 px-8 py-3 rounded-full border border-zinc-100"
            >
              <FilterIcon className="w-4 h-4" /> {isDesktopFilterOpen ? 'Hide Discovery Tools' : 'Explore Filters'}
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-20 relative">
          
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] md:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 bottom-0 w-[90%] bg-white z-[101] p-12 overflow-y-auto md:hidden shadow-3xl"
                >
                    <div className="flex items-center justify-between mb-16">
                       <h2 className="text-xs font-black uppercase tracking-[0.5em] text-accent">Discovery Suite</h2>
                       <button onClick={() => setIsMobileFilterOpen(false)} className="p-3 -mr-3">
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
                      onInteraction={() => setIsMobileFilterOpen(false)}
                    />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className={cn(
            "hidden md:block flex-shrink-0 transition-all duration-700 ease-in-out",
            isDesktopFilterOpen ? "w-72 opacity-100" : "w-0 opacity-0 pointer-events-none translate-x-[-20px]"
          )}>
            <div className="w-72 space-y-16 sticky top-32">
               <FilterContent 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className={cn(
              "grid gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24 transition-all duration-700",
              (isDesktopFilterOpen) ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-48 text-center bg-zinc-50 rounded-[48px] border border-dashed border-zinc-200">
                <Search className="w-16 h-16 text-zinc-200 mb-10" />
                <h3 className="text-2xl font-light uppercase tracking-[0.5em] mb-6">Discovery Empty</h3>
                <p className="text-zinc-400 text-[11px] uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose">The current refinement has left our gallery empty. Please adjust your discovery suite.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-14 px-12 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all duration-500"
                >
                  Return to Archive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Filter Suite
function FilterContent({ 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  onInteraction 
}: any) {
  const handleClick = (setter: any, val: any) => {
    setter(val);
    if(onInteraction) onInteraction();
  }

  return (
    <div className="space-y-16">
      <div className="relative border-b border-zinc-100 pb-6 group">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-hover:text-accent transition-colors" />
        <input 
          type="text" 
          placeholder="SEARCH ARCHIVE..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3 bg-transparent border-none text-[11px] uppercase tracking-[0.3em] font-bold focus:ring-0 outline-none w-full placeholder:text-zinc-200"
        />
      </div>

      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 mb-10 underline decoration-accent/40 underline-offset-[10px] decoration-1">Curated Series</h3>
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => handleClick(setSelectedCategory, 'all')}
            className={cn(
              "text-left text-[11px] uppercase tracking-[0.3em] transition-all",
              selectedCategory === 'all' ? "font-black text-accent" : "text-zinc-400 hover:text-black"
            )}
          >
            All Collections
          </button>
          {categories.map((cat: any) => (
            <button 
              key={cat.id}
              onClick={() => handleClick(setSelectedCategory, cat.id)}
              className={cn(
                "text-left text-[11px] uppercase tracking-[0.3em] transition-all",
                selectedCategory === cat.id ? "font-black text-accent" : "text-zinc-400 hover:text-black"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 mb-10">Sorting Strategy</h3>
        <div className="flex flex-col gap-6">
            <button 
              onClick={() => handleClick(setSortBy, 'newest')}
              className={cn("text-left text-[11px] uppercase tracking-[0.3em] transition-all font-bold", sortBy === 'newest' ? "text-accent" : "text-zinc-400")}
            >
              Most Recent Dispatches
            </button>
            <button 
              onClick={() => handleClick(setSortBy, 'price-low')}
              className={cn("text-left text-[11px] uppercase tracking-[0.3em] transition-all font-bold", sortBy === 'price-low' ? "text-accent" : "text-zinc-400")}
            >
              Price: Lowest First
            </button>
            <button 
              onClick={() => handleClick(setSortBy, 'price-high')}
              className={cn("text-left text-[11px] uppercase tracking-[0.3em] transition-all font-bold", sortBy === 'price-high' ? "text-accent" : "text-zinc-400")}
            >
              Price: Highest First
            </button>
        </div>
      </div>

      <button 
        onClick={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          if(onInteraction) onInteraction();
        }}
        className="w-full py-8 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-200 hover:text-rose-500 border-t border-zinc-100 flex items-center justify-between transition-all"
      >
        Clear Selection <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Boutique Archive...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
