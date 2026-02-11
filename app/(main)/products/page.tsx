/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import ProductCard from '@/components/product/ProductCard';

import { cn } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
        return 0; // newest/default
      });
  }, [selectedCategory, selectedSize, selectedPriceRange, sortBy, searchQuery, products]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
          {selectedCategory === 'all' ? 'All Footwear' : `${selectedCategory} Collection`}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-zinc-500 font-medium">Showing {filteredProducts.length} results</p>
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-zinc-200 rounded-full text-sm focus:ring-1 focus:ring-black outline-none w-64 transition-all focus:w-80"
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all",
                        isFilterOpen ? "bg-black text-white border-black" : "bg-white text-black border-zinc-200 hover:border-black"
                    )}
                >
                    <Filter className="w-4 h-4" /> Filters
                </button>
                <div className="relative group">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-zinc-200 px-4 py-2 pr-10 rounded-full text-sm font-bold focus:ring-1 focus:ring-black outline-none cursor-pointer hover:border-black transition-all"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop Sidebar Filters */}
        <div className={cn(
            "w-72 flex-shrink-0 transition-all duration-300 overflow-hidden",
            isFilterOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 w-0 pointer-events-none"
        )}>
            <div className="space-y-10 sticky top-32">
                {/* Categories */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-4">Categories</h3>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setSelectedCategory('all')}
                            className={cn("text-left px-3 py-2 rounded-lg text-sm transition-colors", selectedCategory === 'all' ? "bg-zinc-100 font-bold" : "hover:bg-zinc-50")}
                        >
                            All Categories
                        </button>
                        {mounted && categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn("text-left px-3 py-2 rounded-lg text-sm transition-colors uppercase", selectedCategory === cat.id ? "bg-zinc-100 font-bold" : "hover:bg-zinc-50")}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-4">Price Range</h3>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setSelectedPriceRange('all')}
                            className={cn("text-left px-3 py-2 rounded-lg text-sm transition-colors", selectedPriceRange === 'all' ? "bg-zinc-100 font-bold" : "hover:bg-zinc-50")}
                        >
                            All Prices
                        </button>
                        {priceRanges.map(range => (
                            <button 
                                key={range.value}
                                onClick={() => setSelectedPriceRange(range.value)}
                                className={cn("text-left px-3 py-2 rounded-lg text-sm transition-colors", selectedPriceRange === range.value ? "bg-zinc-100 font-bold" : "hover:bg-zinc-50")}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-4">Size (UK/PK)</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['all', ...sizes].map(size => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "h-10 border text-xs font-bold rounded-lg transition-all",
                                    selectedSize === size ? "bg-black text-white border-black" : "border-zinc-200 hover:border-black"
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
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest border-t border-zinc-100 hover:text-accent transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                    <Search className="w-12 h-12 text-zinc-300 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter">No products found</h3>
                    <p className="text-zinc-500 font-medium">Try adjusting your filters or search query.</p>
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
