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
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
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
    for (let i = 0; i < quantity; i++) {
      addItem(product, 'One Size', 'Default');
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, 'One Size', 'Default');
    router.push('/checkout');
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          {/* Left: Image Gallery (Sticky on desktop) */}
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-6 lg:sticky lg:top-32 h-fit">
            {/* Thumbnails (Left side on desktop) */}
            <div className="hidden md:flex flex-col gap-4 order-2 md:order-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 aspect-[3/4] overflow-hidden border transition-premium cursor-pointer rounded-lg",
                    selectedImage === i ? "border-accent shadow-lg shadow-accent/20" : "border-gray-100 hover:border-accent/50"
                  )}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow h-[30rem] overflow-hidden bg-gray-50 order-1 md:order-2 rounded-2xl shadow-sm border border-gray-100 relative">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover bg-white lg:scale-105 transition-transform duration-1000" 
              />

            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-4 overflow-x-auto no-scrollbar pb-4 order-3">
               {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 aspect-[3/4] flex-shrink-0 overflow-hidden border transition-premium cursor-pointer rounded-lg",
                    selectedImage === i ? "border-accent" : "border-gray-100"
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
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-tight">
                {product.name}
              </h1>
              
              {/* Price Section as per screenshot */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-accent tracking-tighter">
                   Rs.{product.price.toLocaleString()}
                  </span>
                  <span className="text-xl text-zinc-400 line-through font-medium">
                    Rs.{(product.price * 2).toLocaleString()}
                  </span>
                  <span className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-sm">
                    50% OFF
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                  <div className="w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                  In stock
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quantity</p>
                  <div className="flex items-center bg-zinc-100 w-32 justify-between rounded-lg px-2 py-1 border border-zinc-200">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white rounded-md transition-all font-light"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white rounded-md transition-all font-light"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={cn(
                  "w-full h-16 bg-white border-2 border-zinc-200 text-black font-black uppercase tracking-widest hover:border-black transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2",
                  isAdded && "bg-gray-200 border-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-500 cursor-default"
                )}
              >
                {isAdded ? (
                  <><Check className="w-4 h-4" /> Added to Cart</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="w-full h-16 bg-black text-white font-black uppercase tracking-widest hover:bg-zinc-800 transition-all duration-300 transform active:scale-95 shadow-xl"
              >
                Buy Now
              </button>
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

