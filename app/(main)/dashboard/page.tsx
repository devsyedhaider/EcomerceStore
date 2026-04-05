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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-8">
            <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mb-4">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">{user.name || user.email?.split('@')[0]}</h2>
                <p className="text-zinc-500 font-medium text-sm mb-6">{user.email}</p>
                <button 
                    onClick={() => {
                        logout();
                        router.push('/');
                    }}
                    className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-full transition-all"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <nav className="bg-white rounded-[32px] border border-zinc-100 shadow-xl overflow-hidden">
                <Link href="/dashboard" className="flex items-center gap-4 p-6 bg-zinc-50 border-l-4 border-black">
                    <Package className="w-5 h-5" />
                    <span className="font-black text-sm uppercase tracking-tight">Orders History</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>
                <Link href="/cart" className="flex items-center gap-4 p-6 hover:bg-zinc-50 transition-colors border-l-4 border-transparent">
                    <ShoppingBag className="w-5 h-5 text-zinc-400" />
                    <span className="font-bold text-sm uppercase tracking-tight">Shopping Bag</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-12">
            <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">MY ORDERS</h1>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                  Manage your recent purchases and tracking
                  {userOrders.length > 0 && <span className="ml-3 bg-black text-white px-3 py-1 rounded-full text-[10px]">{userOrders.length} order{userOrders.length > 1 ? 's' : ''}</span>}
                </p>
            </div>

            <div className="space-y-6">
                {userOrders.length > 0 ? (
                    userOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[32px] border border-zinc-100 shadow-lg overflow-hidden transition-all hover:shadow-2xl">
                            <div className="p-8 bg-zinc-50 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Order Placed</p>
                                        <p className="text-sm font-black">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Amount</p>
                                        <p className="text-sm font-black text-accent">{formatPrice(order.total)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Ship to</p>
                                        <p className="text-sm font-black">{order.shippingDetails?.city || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Order #</p>
                                    <p className="text-sm font-black">{order.id}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-accent/10 text-accent rounded-full">
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase leading-tight">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">SZ: {item.size} • QTY: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-2xl space-y-3">
                                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Shipping Address
                                        </h3>
                                        <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                                            {order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                        <Package className="w-16 h-16 text-zinc-200 mb-4" />
                        <h3 className="text-xl font-black uppercase tracking-tighter">No orders yet</h3>
                        <p className="text-sm font-medium text-zinc-500 mb-8">You haven&apos;t placed any orders yet. Start shopping!</p>
                        <Link href="/products" className="btn-primary">EXPLORE COLLECTION</Link>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
