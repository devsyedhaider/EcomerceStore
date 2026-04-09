/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Truck, ShieldCheck, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const total = useMemo(() => getTotal(), [items, getTotal]);
  const itemCount = useMemo(() => getItemCount(), [items, getItemCount]);
  const shipping = useMemo(() => total > 5000 ? 0 : 350, [total]);

  if (items.length === 0) {
    return (
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-8">
            <ShoppingBag className="w-8 h-8 text-gray-300 stroke-[1]" />
        </div>
        <h1 className="text-2xl font-light uppercase tracking-[0.2em] mb-4">Your bag is empty</h1>
        <p className="text-[10px] text-gray-light uppercase tracking-[0.1em] mb-12 max-w-xs leading-relaxed">
          It seems you haven't added anything to your selection yet.
        </p>
        <Link href="/products" className="btn-premium px-12">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-24 pb-16">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-4">Shopping Bag</h1>
        <p className="text-[10px] text-gray-light uppercase tracking-[0.2em] font-medium">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'} selected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-gray-100 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">
              <div className="col-span-6">Product Information</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={`${item.id}-${item.size}-${item.color}`} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-10 group"
                >
                  <div className="md:col-span-6 flex gap-6">
                    <div className="w-24 md:w-32 aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-premium group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${item.id}`} className="text-[12px] font-bold uppercase tracking-[0.1em] hover:text-gray-light transition-premium mb-2">
                        {item.name}
                      </Link>
                      <div className="flex flex-col gap-1">
                        {item.size && item.size !== 'One Size' && (
                          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-light font-medium">Size: {item.size}</span>
                        )}
                        {item.color && item.color !== 'Default' && (
                          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-light font-medium">Color: {item.color}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-accent transition-all mt-6 cursor-pointer group/remove"
                      >
                        <X className="w-3.5 h-3.5 group-hover/remove:rotate-90 transition-transform duration-300" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block col-span-2 text-center text-xs font-light tracking-wider">
                    {formatPrice(item.price)}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-100 h-10 px-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:text-gray-light transition-premium cursor-pointer"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-[11px] font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:text-gray-light transition-premium cursor-pointer"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-right text-[13px] font-medium tracking-wider">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-12">
            <Link href="/products" className="btn-premium">
               Return to Shop
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-100 p-10 lg:sticky lg:top-32">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-10 border-b border-gray-100 pb-4">Estimated Summary</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]">
                <span className="text-gray-light font-medium">Subtotal</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]">
                <span className="text-gray-light font-medium">Delivery</span>
                <span className={cn("font-bold", shipping === 0 ? "text-green-600" : "")}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="bg-white p-4">
                   <p className="text-[8px] text-gray-light font-medium uppercase tracking-[0.1em] leading-relaxed">
                    Add Rs. {formatPrice(5000 - total)} more to your bag and qualify for complimentary shipping.
                   </p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Estimated Total</span>
                  <span className="text-lg font-light tracking-wider">{formatPrice(total + shipping)}</span>
                </div>
                <p className="text-[8px] text-gray-light uppercase tracking-[0.1em] mt-2 italic">
                  Tax included. Shipping calculated at checkout.
                </p>
              </div>
            </div>

            <button 
                onClick={() => router.push('/checkout')}
                className="w-full h-16 bg-accent text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent-dark transition-all duration-300 transform active:scale-95 shadow-xl cursor-pointer"
            >
                Checkout Now
            </button>


            <div className="mt-10 space-y-6 pt-10 border-t border-gray-50">
                <div className="flex items-start gap-4">
                    <Truck className="w-4 h-4 stroke-[1.2] text-gray- light" />
                    <p className="text-[9px] uppercase tracking-[0.1em] text-gray- light leading-relaxed">
                       Standard delivery across Pakistan (2-4 working days)
                    </p>
                </div>
                <div className="flex items-start gap-4">
                    <ShieldCheck className="w-4 h-4 stroke-[1.2] text-gray- light" />
                    <p className="text-[9px] uppercase tracking-[0.1em] text-gray- light leading-relaxed">
                        Secure checkout with end-to-end encryption.
                    </p>
                </div>
            </div>

            <div className="mt-12 flex justify-center gap-6 opacity-20 grayscale grayscale-100 contrast-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-2" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

