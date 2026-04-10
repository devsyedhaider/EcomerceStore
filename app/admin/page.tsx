/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  PlusCircle
} from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function AdminDashboard() {
  const allOrders = useOrderStore((state) => state.orders);
  const allProducts = useProductStore((state) => state.products);
  
  // Hydration fix for persisted stores
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = useMemo(() => {
    const revenue = allOrders.reduce((acc, order) => acc + order.total, 0);
    const uniqueCustomers = new Set(allOrders.map(o => o.shippingDetails?.email || o.id)).size;
    
    return [
        { label: 'Total Revenue', value: formatPrice(revenue), icon: DollarSign, trend: '+12.5%', isUp: true },
        { label: 'Orders', value: allOrders.length.toString(), icon: ShoppingBag, trend: '+5.2%', isUp: true },
        { label: 'Products', value: allProducts.length.toString(), icon: Package, trend: '+2.1%', isUp: true },
        { label: 'Customers', value: uniqueCustomers.toString(), icon: Users, trend: '+8.4%', isUp: true },
    ];
  }, [allOrders, allProducts]);

  const recentOrders = useMemo(() => {
    return [...allOrders].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    }).slice(0, 5);
  }, [allOrders]);

  const analyticsData = useMemo(() => {
    const categoryRevenue: Record<string, number> = {};
    
    // Initialize with real categories
    useCategoryStore.getState().categories.forEach(cat => {
      categoryRevenue[cat.id] = 0;
    });

    allOrders.forEach(order => {
      order.items.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        const categoryId = product?.category || 'other';
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        
        if (categoryRevenue[categoryId] !== undefined) {
          categoryRevenue[categoryId] += itemTotal;
        } else {
          categoryRevenue[categoryId] = (categoryRevenue[categoryId] || 0) + itemTotal;
        }
      });
    });

    const totalRevenue = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
    const goal = 2000000; // 2M target
    const progress = totalRevenue > 0 ? Math.min(Math.round((totalRevenue / goal) * 100), 100) : 0;

    const colors = ['bg-accent', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];

    return {
      totalRevenue,
      progress,
      goal,
      categories: useCategoryStore.getState().categories.slice(0, 5).map((cat, i) => {
        const value = categoryRevenue[cat.id] || 0;
        return {
          name: cat.name,
          value,
          percentage: totalRevenue > 0 ? Math.round((value / totalRevenue) * 100) : 0,
          color: colors[i % colors.length]
        };
      })
    };
  }, [allOrders, allProducts]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-accent">Live Cloud Sync</span>
              </div>
           </div>
           <p className="text-zinc-500 font-medium">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary h-12 flex items-center justify-center gap-2 px-8 w-full sm:w-auto flex-shrink-0">
            <PlusCircle className="w-5 h-5" /> ADD PRODUCT
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col gap-4 hover:shadow-lg transition-all group">
             <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-black group-hover:bg-accent group-hover:text-white transition-colors">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                   {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {stat.trend}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
           <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <h3 className="font-black uppercase tracking-tight text-lg">Recent Orders</h3>
                 <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[9px] font-black uppercase rounded">{allOrders.length} TOTAL</span>
              </div>
              <Link href="/admin/orders" className="text-xs font-black text-accent hover:underline uppercase tracking-widest">View All</Link>
           </div>
           
           {recentOrders.length > 0 ? (
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                           <th className="px-6 py-4 border-b border-zinc-100">Order ID</th>
                           <th className="px-6 py-4 border-b border-zinc-100">Customer</th>
                           <th className="px-6 py-4 border-b border-zinc-100">Status</th>
                           <th className="px-6 py-4 border-b border-zinc-100">Amount</th>
                           <th className="px-6 py-4 border-b border-zinc-100">Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100">
                        {recentOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-sm font-black text-zinc-900 leading-none">#{order.id.slice(0, 8)}</td>
                              <td className="px-6 py-4 text-sm font-medium text-zinc-600">
                                 {order.shippingDetails?.firstName || 'Guest'} {order.shippingDetails?.lastName || ''}
                               </td>
                              <td className="px-6 py-4">
                                 <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    order.status === 'Delivered' ? "bg-green-100/50 text-green-700" : 
                                    order.status === 'Pending' ? "bg-yellow-100/50 text-yellow-700" : "bg-blue-100/50 text-blue-700"
                                 )}>
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-black">{formatPrice(order.total)}</td>
                              <td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
           ) : (
                <div className="p-12 text-center text-zinc-400">
                    <p>No orders yet.</p>
                </div>
           )}
        </div>

        {/* Quick Actions / Activity - Revenue Analytics REAL TIME */}
        <div className="bg-zinc-900 rounded-2xl p-8 text-white flex flex-col h-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-20 blur-3xl -mr-24 -mt-24 pointer-events-none" />
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tighter">Revenue Analytics</h3>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Active</span>
                </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-center gap-8 relative z-10">
                {analyticsData.categories.map((cat, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-zinc-400">
                            <span className="text-[10px]">{cat.name}</span>
                            <span className="text-white font-black">{cat.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${cat.percentage}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className={cn("h-full rounded-full transition-colors", cat.color)} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 relative z-10 group overflow-hidden">
                <motion.div 
                    initial={false}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-accent pointer-events-none" 
                />
                <p className="text-accent font-black text-[10px] uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Goal Progress (Real-time)</p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-2 text-white">
                        <p className="text-4xl font-black leading-none">{analyticsData.progress}%</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pb-1">to {formatPrice(analyticsData.goal)} Target</p>
                    </div>
                    {/* Overall Progress Bar */}
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analyticsData.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-accent" 
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

