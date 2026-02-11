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

export default function AdminDashboard() {
  const allOrders = useOrderStore((state) => state.orders);
  const allProducts = useProductStore((state) => state.products);
  
  // Hydration fix for persisted stores
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = useMemo(() => {
    const revenue = allOrders.reduce((acc, order) => acc + order.total, 0);
    const uniqueCustomers = new Set(allOrders.map(o => o.shippingDetails?.email || 'unknown')).size;
    
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
    const categoryRevenue: Record<string, number> = {
      men: 0,
      women: 0,
      kids: 0,
      sports: 0,
    };

    allOrders.forEach(order => {
      order.items.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        const category = product?.category.toLowerCase() || 'other';
        const itemTotal = item.price * item.quantity;
        
        if (categoryRevenue[category] !== undefined) {
          categoryRevenue[category] += itemTotal;
        } else {
          categoryRevenue[category] = (categoryRevenue[category] || 0) + itemTotal;
        }
      });
    });

    const totalRevenue = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
    const goal = 2000000; // 2M goal
    const progress = totalRevenue > 0 ? Math.min(Math.round((totalRevenue / goal) * 100), 100) : 0;

    return {
      totalRevenue,
      progress,
      goal,
      categories: [
        { name: 'Men Category', value: categoryRevenue.men, color: 'bg-accent' },
        { name: 'Women Category', value: categoryRevenue.women, color: 'bg-blue-500' },
        { name: 'Kids Category', value: categoryRevenue.kids, color: 'bg-purple-500' },
        { name: 'Sports Category', value: categoryRevenue.sports, color: 'bg-green-500' },
      ].map(cat => ({
        ...cat,
        percentage: totalRevenue > 0 ? Math.round((cat.value / totalRevenue) * 100) : 0
      }))
    };
  }, [allOrders, allProducts]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
           <p className="text-zinc-500 font-medium">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary h-12 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> ADD PRODUCT
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col gap-4 hover:shadow-lg transition-shadow">
             <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-black">
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
           <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-black uppercase tracking-tight text-lg">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-black text-accent hover:underline uppercase tracking-widest">View All</Link>
           </div>
           
           {recentOrders.length > 0 ? (
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                           <th className="px-6 py-4">Order ID</th>
                           <th className="px-6 py-4">Customer</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Amount</th>
                           <th className="px-6 py-4">Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100">
                        {recentOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-zinc-50 transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-sm font-black text-zinc-500">#{order.id.slice(0, 8)}</td>
                              <td className="px-6 py-4 text-sm font-medium text-zinc-600">
                                {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                              </td>
                              <td className="px-6 py-4">
                                 <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    order.status === 'Delivered' ? "bg-green-100 text-green-700" : 
                                    order.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
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

        {/* Quick Actions / Activity - Kept static for visual appeal as requested */}
        <div className="bg-zinc-900 rounded-2xl p-8 text-white flex flex-col h-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-16 -mt-16" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 relative z-10">Revenue Analytics</h3>
            <div className="flex-grow flex flex-col justify-center gap-6 relative z-10">
                {analyticsData.categories.map((cat, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                            <span>{cat.name}</span>
                            <span>{cat.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", cat.color)} style={{ width: `${cat.percentage}%` }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 relative z-10">
                <p className="text-accent font-black text-[10px] uppercase tracking-widest border-b border-white/10 pb-2 mb-3">Goal Progress</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-black">{analyticsData.progress}%</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pb-1.5">to {formatPrice(analyticsData.goal)} Target</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

