/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Share2, ShieldCheck, Truck, RefreshCw, Star, ArrowLeft, ChevronRight, Check, Sparkles, Info } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/store/useWishlistStore';

export default function ProductDetailPage() {
  const { categories } = useCategoryStore();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const storeProducts = useProductStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = storeProducts.find((p) => p.id === id);
  const categoryName = mounted && product ? (categories.find(c => c.id === product.category)?.name || product.category) : product?.category;
  
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = mounted && product ? isInWishlist(product.id) : false;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes.length > 0 ? product.sizes[0] : 'One Size');
      setSelectedColor(product.colors.length > 0 ? product.colors[0].name : 'Default');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-light uppercase tracking-[0.2em] mb-8">Product Not Found</h1>
        <button onClick={() => router.push('/products')} className="btn-premium-outline cursor-pointer">
          Back to Collection
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedSize || 'One Size', selectedColor || 'Default');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleItem(product);
  };

  const relatedProducts = storeProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productRating = product.rating || 4.5;

  return (
    <div className="pb-32 bg-white pt-24 md:pt-32">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-light mb-12">
          <Link href="/" className="hover:text-black transition-premium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-black transition-premium">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Left: Image Gallery (Thumbs + Main) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Thumbnails (Left side on desktop) */}
            <div className="hidden md:flex flex-col gap-4 order-2 md:order-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 aspect-[3/4] overflow-hidden border transition-premium cursor-pointer",
                    selectedImage === i ? "border-black" : "border-gray-100 hover:border-gray-300"
                  )}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow aspect-[3/4] overflow-hidden bg-gray-50 order-1 md:order-2">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-4 overflow-x-auto no-scrollbar pb-4 order-3">
               {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 aspect-[3/4] flex-shrink-0 overflow-hidden border transition-premium cursor-pointer",
                    selectedImage === i ? "border-black" : "border-gray-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-10">
              <span className="text-premium-subheading block mb-4">{categoryName}</span>
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-[0.15em] mb-6 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-6 mb-8">
                <span className="text-2xl font-light tracking-wider text-black">{formatPrice(product.price)}</span>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span className="text-xs font-medium uppercase tracking-widest">{productRating}</span>
                  <span className="text-[10px] text-gray-light uppercase tracking-widest ml-1">({product.reviews || 0} Reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-dark leading-relaxed mb-12 text-sm uppercase tracking-[0.05em] font-light">
              {product.description}
            </p>

            {/* Product Details Accordions */}
            <div className="mb-16 border-t border-gray-100">
                {[
                  { id: 'materials', title: 'Materials', content: product.materials, icon: <Sparkles className="w-4 h-4" /> },
                  { id: 'warranty', title: 'Warranty Policy', content: product.warrantyPolicy, icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'shipping', title: 'Shipping & Returns', content: product.shippingReturns, icon: <Truck className="w-4 h-4" /> },
                  { id: 'care', title: 'Care Instructions', content: product.careInstructions, icon: <Info className="w-4 h-4" /> }
                ].map((item) => item.content && (
                  <div key={item.id} className="border-b border-gray-100 py-6">
                    <button 
                      onClick={() => {
                        const el = document.getElementById(`content-${item.id}`);
                        const icon = document.getElementById(`icon-${item.id}`);
                        if (el) {
                          el.classList.toggle('hidden');
                          icon?.classList.toggle('rotate-90');
                        }
                      }}
                      className="w-full flex items-center justify-between text-sm uppercase tracking-[0.1em] font-bold group cursor-pointer hover:text-gray-light transition-premium"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-accent">{item.icon}</div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight id={`icon-${item.id}`} className="w-4 h-4 transition-transform duration-300" />
                    </button>
                    <div id={`content-${item.id}`} className="hidden mt-4 text-sm uppercase tracking-wider leading-relaxed text-gray-500 font-light animate-fade-in">
                      {item.content}
                    </div>
                  </div>
                ))}
            </div>

            {/* Selectors */}
            <div className="space-y-12 mb-16">
              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && product.colors[0].name !== 'Standard' && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Color: <span className="font-light text-gray-light">{selectedColor}</span></h3>
                  <div className="flex gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-8 h-8 rounded-full border transition-premium p-0.5 cursor-pointer",
                          selectedColor === color.name ? "border-black" : "border-transparent"
                        )}
                      >
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Select Size</h3>
                    <button className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-light border-b border-gray-200 hover:text-black transition-premium cursor-pointer">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "h-12 border text-[10px] uppercase tracking-widest font-medium transition-premium cursor-pointer",
                          selectedSize === size ? "bg-black text-white border-black" : "border-gray-100 hover:border-black text-gray-light"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-20">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={cn(
                  "btn-premium w-full h-16 text-sm cursor-pointer",
                  isAdded && "bg-gray-200 border-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-500 cursor-default"
                )}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Added to Cart</span>
                ) : (
                  <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Add to Cart</span>
                )}
              </button>
              
              <button 
                onClick={handleWishlist}
                className={cn(
                  "btn-premium-outline w-full h-16 text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300",
                  isWishlisted ? "bg-rose-50 text-rose-500 border-rose-100" : ""
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-500")} /> 
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-gray-100">
                <div className="flex items-start gap-4">
                    <Truck className="w-5 h-5 stroke-[1.2]" />
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Fast Delivery</p>
                        <p className="text-[9px] text-gray-light uppercase tracking-[0.1em]">2-4 Working Days</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <RefreshCw className="w-5 h-5 stroke-[1.2]" />
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Returns Policy</p>
                        <p className="text-[9px] text-gray-light uppercase tracking-[0.1em]">15 Days Easy Returns</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="max-w-[1800px] mx-auto px-6 md:px-12 mt-32 border-t border-gray-100 pt-24">
        <div className="text-center mb-16">
          <span className="text-premium-subheading block mb-4">Complete the Look</span>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em]">Related Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}

