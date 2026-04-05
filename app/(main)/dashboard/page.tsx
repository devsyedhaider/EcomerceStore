/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/lib/utils';
import { Package, LogOut, ChevronRight, ShoppingBag, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, initialized } = useAuthStore();
  const { orders } = useOrderStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for OrderStore to finish reading from IndexedDB
    let ordersDone = useOrderStore.persist.hasHydrated();

    const tryReady = () => {
      // Auth is ready when initialized is true
      if (initialized && ordersDone) setIsReady(true);
    };

    tryReady();

    const unsubO = useOrderStore.persist.onFinishHydration(() => {
      ordersDone = true;
      tryReady();
    });

    return () => { unsubO(); };
  }, [initialized]);

  useEffect(() => {
    if (isReady && !user) {
      router.push('/login');
    }
  }, [isReady, user, router]);

  if (!isReady) return null;
  if (!user) return null;

  const currentEmail = user.email?.toLowerCase()?.trim();
  const userOrders = orders.filter(order => {
    const orderEmail = order.shippingDetails?.email?.toLowerCase()?.trim();
    return orderEmail && currentEmail && orderEmail === currentEmail;
  });

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-10">
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-10 flex flex-col items-center text-center">
                  <div className="relative group mb-6">
                    <div className="w-20 h-20 bg-black text-accent rounded-full flex items-center justify-center text-2xl font-black border-4 border-white shadow-xl ring-1 ring-zinc-100">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h2 className="text-xl font-medium uppercase tracking-[0.2em] font-lato mb-1">{user.name || user.email?.split('@')[0]}</h2>
                  <p className="text-zinc-400 font-medium text-[10px] uppercase tracking-widest mb-8">{user.email}</p>
                  
                  <button 
                      onClick={() => {
                          logout();
                          router.push('/');
                      }}
                      className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:text-red-500 transition-all duration-300"
                  >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out from Account
                  </button>
              </div>

              <nav className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden p-2">
                  <Link href="/dashboard" className="flex items-center gap-4 p-5 rounded-xl bg-accent/5 text-accent border border-accent/10">
                      <Package className="w-4 h-4" />
                      <span className="font-black text-[10px] uppercase tracking-[0.2em] font-lato">Orders History</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                  </Link>
                  <Link href="/cart" className="flex items-center gap-4 p-5 rounded-xl text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="font-bold text-[10px] uppercase tracking-[0.2em] font-lato">Shopping Bag</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30" />
                  </Link>
                  <Link href="/products" className="flex items-center gap-4 p-5 rounded-xl text-zinc-400 hover:bg-zinc-50 hover:text-black transition-all">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold text-[10px] uppercase tracking-[0.2em] font-lato">Store Locator</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30" />
                  </Link>
              </nav>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-12">
              <div className="border-b border-zinc-200 pb-10">
                  <h1 className="text-4xl font-light uppercase tracking-[0.3em] font-lato mb-4">Account Dashboard</h1>
                  <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Access your history and track open orders
                    {userOrders.length > 0 && <span className="ml-4 text-accent border-l border-zinc-200 pl-4">{userOrders.length} PURCHASE{userOrders.length > 1 ? 'S' : ''}</span>}
                  </p>
              </div>

              <div className="space-y-8">
                  {userOrders.length > 0 ? (
                      userOrders.map((order) => (
                          <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden group">
                              <div className="p-8 border-b border-zinc-50 flex flex-wrap items-center justify-between gap-8 bg-zinc-50/30">
                                  <div className="flex gap-10">
                                      <div>
                                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-2">Reference</p>
                                          <p className="text-xs font-black uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-2">Order Date</p>
                                          <p className="text-xs font-bold uppercase tracking-widest">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-2">Amount</p>
                                          <p className="text-xs font-black text-accent tracking-widest">{formatPrice(order.total)}</p>
                                      </div>
                                  </div>
                                  <div className="px-6 py-2 bg-white border border-zinc-100 rounded-full">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                        {order.status}
                                    </span>
                                  </div>
                              </div>

                              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                  <div className="space-y-6">
                                      {order.items.map((item, idx: number) => (
                                          <div key={idx} className="flex gap-6 items-center group/item">
                                              <div className="w-20 h-20 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.5] group-hover/item:grayscale-0 transition-all duration-500" />
                                              </div>
                                              <div>
                                                  <p className="text-[11px] font-black uppercase tracking-[0.1em] mb-1">{item.name}</p>
                                                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">QTY: {item.quantity} • UNIT PRICE: {formatPrice(item.price)}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  <div className="bg-zinc-50/50 p-8 rounded-2xl space-y-4 border border-zinc-100/50">
                                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
                                          <MapPin className="w-3.5 h-3.5" /> Destination
                                      </h3>
                                      <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                            {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 font-medium tracking-wide leading-relaxed">
                                            {order.shippingDetails?.address} <br />
                                            {order.shippingDetails?.city} {order.shippingDetails?.postalCode} <br />
                                            {order.shippingDetails?.phone}
                                        </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-zinc-200">
                          <ShoppingBag className="w-12 h-12 text-zinc-100 mb-6" />
                          <h3 className="text-lg font-light uppercase tracking-[0.3em] text-zinc-400 mb-2">No active orders</h3>
                          <p className="text-[10px] font-medium text-zinc-300 uppercase tracking-[0.2em] mb-10">Start your journey with us</p>
                          <Link href="/products" className="px-10 py-4 border border-accent text-accent text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-500">
                              Discover Collection
                          </Link>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
