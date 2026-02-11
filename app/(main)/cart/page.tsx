/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();
  const shipping = total > 5000 ? 0 : 250;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-zinc-300" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Your cart is empty</h1>
        <p className="text-zinc-500 mb-10 max-w-sm font-medium">Looks like you haven&apos;t added anything to your cart yet. Explore our latest collection and find something you love!</p>
        <Link href="/products" className="btn-primary min-w-[240px]">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">SHOPPING BAG</h1>
      <p className="text-zinc-500 font-bold mb-12 uppercase tracking-widest text-sm">You have {itemCount} items in your bag</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <div className="col-span-3">Product Details</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center pb-8 border-b border-zinc-100 group">
              <div className="md:col-span-3 flex gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/products/${item.id}`} className="font-black text-lg uppercase tracking-tight hover:text-accent transition-colors leading-tight mb-1">
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Size: {item.size} • Color: {item.color}</p>
                  <button 
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors mt-2 uppercase tracking-widest"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="hidden md:block text-center font-black">{formatPrice(item.price)}</div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center border-2 border-zinc-100 rounded-full h-10 px-2">
                    <button 
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                    className="p-1 hover:text-accent transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <button 
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                    className="p-1 hover:text-accent transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
              </div>

              <div className="text-right font-black text-lg">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}

          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-black hover:text-accent transition-colors pt-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> CONTINUE SHOPPING
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-black">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-black text-green-600">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-zinc-400 font-medium italic">Add Rs. {formatPrice(5000 - total)} more for FREE shipping</p>
              )}
              <div className="h-px bg-zinc-200 mt-4" />
              <div className="flex justify-between text-xl pt-2">
                <span className="font-black uppercase tracking-tighter">Total</span>
                <span className="font-black">{formatPrice(total + shipping)}</span>
              </div>
            </div>

            <button 
                onClick={() => router.push('/checkout')}
                className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl mb-6 flex items-center justify-center gap-3"
            >
                PROCEED TO CHECKOUT
            </button>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-zinc-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fast 2-3 Days Delivery Across Pakistan</p>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-zinc-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secure Payments via SSL</p>
                </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale contrast-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
