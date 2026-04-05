/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter, X } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];
  const priceRanges = [
    { label: 'Under Rs. 5,000', value: '0-5000' },
    { label: 'Rs. 5,000 - 10,000', value: '5000-10000' },
    { label: 'Rs. 10,000 - 15,000', value: '10000-15000' },
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
        // Filter by params first
        if (isNewParam && !p.isNew) return false;
        if (isTrendingParam && !p.isFeatured) return false;

        const categoryMatch = selectedCategory === 'all' || 
                            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
                            categories.find(c => c.id === selectedCategory)?.name.toLowerCase() === p.category.toLowerCase();
        const sizeMatch = selectedSize === 'all' || p.sizes.includes(selectedSize);
        const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        let priceMatch = true;
        if (selectedPriceRange !== 'all') {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            priceMatch = p.price >= min && p.price <= max;
        }

        return categoryMatch && sizeMatch && priceMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'popular') return b.reviews - a.reviews;
        return 0;
      });
  }, [selectedCategory, selectedSize, selectedPriceRange, sortBy, searchQuery, products, categories]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-32 pb-12">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-8 text-center text-zinc-900">
          {isNewParam ? 'New Arrivals' : isTrendingParam ? 'Trending Now' : selectedCategory === 'all' ? 'The Collection' : `${selectedCategory} Collection`}
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-y border-gray-100 py-6 gap-6">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium hover:text-gray-light transition-premium"
            >
              <Filter className="w-4 h-4 stroke-[1.5]" /> {isFilterOpen ? 'Hide' : 'Show'} Filters
            </button>
            <p className="text-[10px] text-gray-light uppercase tracking-[0.2em] font-medium">
              {filteredProducts.length} Items
            </p>
          </div>

          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-light" />
              <input 
                type="text" 
                placeholder="SEARCH..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 bg-transparent border-none text-[10px] uppercase tracking-[0.2em] focus:ring-0 outline-none w-full md:w-48 transition-premium"
              />
            </div>
            
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border-none pr-8 py-2 text-[10px] uppercase tracking-[0.2em] font-medium focus:ring-0 outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full md:w-64 flex-shrink-0"
            >
              <div className="space-y-12 sticky top-32">
                {/* Category Group */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Category</h3>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        "text-left text-[11px] uppercase tracking-[0.1em] transition-premium",
                        selectedCategory === 'all' ? "font-bold border-b border-black w-fit" : "text-gray-light hover:text-black"
                      )}
                    >
                      All Collections
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "text-left text-[11px] uppercase tracking-[0.1em] transition-premium",
                          selectedCategory === cat.id ? "font-bold border-b border-black w-fit" : "text-gray-light hover:text-black"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Group */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Price</h3>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setSelectedPriceRange('all')}
                      className={cn(
                        "text-left text-[11px] uppercase tracking-[0.1em] transition-premium",
                        selectedPriceRange === 'all' ? "font-bold border-b border-black w-fit" : "text-gray-light hover:text-black"
                      )}
                    >
                      All Prices
                    </button>
                    {priceRanges.map(range => (
                      <button 
                        key={range.value}
                        onClick={() => setSelectedPriceRange(range.value)}
                        className={cn(
                          "text-left text-[11px] uppercase tracking-[0.1em] transition-premium",
                          selectedPriceRange === range.value ? "font-bold border-b border-black w-fit" : "text-gray-light hover:text-black"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Group */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['all', ...sizes].map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "h-10 text-[10px] uppercase font-medium transition-premium border",
                          selectedSize === size ? "bg-black text-white border-black" : "border-gray-100 hover:border-black text-gray-light"
                        )}
                      >
                        {size === 'all' ? 'All' : size}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="w-full py-4 text-[10px] uppercase tracking-[0.2em] font-bold border-t border-gray-100 mt-8 flex items-center justify-between hover:text-gray-light transition-premium"
                >
                  Reset Filters <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className={cn(
              "grid gap-x-8 gap-y-16",
              isFilterOpen ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Search className="w-12 h-12 text-gray-100 mb-6" />
              <h3 className="text-xl font-light uppercase tracking-[0.2em] mb-4">No results found</h3>
              <p className="text-gray-light text-xs uppercase tracking-[0.1em]">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSize('all');
                  setSelectedPriceRange('all');
                  setSearchQuery('');
                }}
                className="mt-8 btn-premium-outline px-8"
              >
                Clear All
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
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
