/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Share2, ShieldCheck, Truck, RefreshCw, Star, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { products } from '@/lib/data';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const { categories } = useCategoryStore();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const storeProducts = useProductStore((state) => state.products);
  const [productsList, setProductsList] = useState(products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // When store loads (client-side), update local list including new added products
    if (storeProducts.length > 0) {
        setProductsList(storeProducts);
    }
  }, [storeProducts]);

  const product = productsList.find((p) => p.id === id);
  const categoryName = mounted && product ? (categories.find(c => c.id === product.category)?.name || product.category) : product?.category;
  const addItem = useCartStore((state) => state.addItem);


  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-4">PRODUCT NOT FOUND</h1>
        <button onClick={() => router.push('/products')} className="btn-primary">
          BACK TO SHOP
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, selectedColor);
    router.push('/cart');
  };

  const relatedProducts = productsList
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-12">
          <button onClick={() => router.push('/')} className="hover:text-black transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => router.push('/products')} className="hover:text-black transition-colors">Products</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button className="absolute top-6 right-6 p-3 bg-white shadow-xl rounded-full text-zinc-400 hover:text-accent transition-all transform hover:scale-110">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === i ? "border-black scale-[0.98]" : "border-transparent hover:border-zinc-200"
                  )}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-4">
                <span className="bg-accent/10 py-1 px-3 rounded-full">{categoryName}</span>
                {product.isNew && <span>• NEW ARRIVAL</span>}
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-[0.9]">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-zinc-100 px-3 py-1 rounded-full gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-black">{product.rating}</span>
                </div>
                <span className="text-zinc-500 text-sm font-bold">({product.reviews} customer reviews)</span>
              </div>
              <p className="text-4xl font-black text-black">{formatPrice(product.price)}</p>
            </div>

            <p className="text-zinc-600 leading-relaxed mb-10 text-lg font-medium">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-10 mb-12">
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-sm uppercase tracking-widest">Select Size (UK)</h3>
                  <button className="text-xs font-bold text-zinc-500 underline uppercase tracking-widest hover:text-black">Size Guide</button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 border-2 text-sm font-black rounded-xl transition-all",
                        selectedSize === size ? "bg-black text-white border-black shadow-lg" : "border-zinc-100 hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-4">Color: <span className="text-zinc-500">{selectedColor}</span></h3>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                        selectedColor === color.name ? "border-black scale-110 shadow-md" : "border-transparent"
                      )}
                    >
                      <div className="w-full h-full rounded-full border border-zinc-200" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className={cn(
                        "flex-grow h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3",
                        isAdded ? "bg-green-600 text-white" : "bg-black text-white hover:bg-zinc-800 shadow-xl"
                    )}
                  >
                    {isAdded ? (
                        <><Check className="w-6 h-6" /> ADDED TO CART</>
                    ) : (
                        <><ShoppingBag className="w-6 h-6" /> ADD TO CART</>
                    )}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-grow h-16 rounded-2xl font-black text-lg border-2 border-black hover:bg-black hover:text-white transition-all shadow-xl"
                  >
                    BUY IT NOW
                  </button>
              </div>
              <p className="text-center text-xs font-bold text-zinc-500 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 100% Guaranteed Transaction
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-accent" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Free Shipping</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Over Rs. 5000</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-accent" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Easy Returns</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">15 Days Policy</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Genuine</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">100% Original</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="container mx-auto px-4 mt-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">YOU MAY ALSO LIKE</h2>
            <div className="w-16 h-1 bg-accent mt-2" />
          </div>
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
