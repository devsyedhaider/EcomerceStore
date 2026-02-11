'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice, cn } from '@/lib/utils';
import { Package, Search, Calendar, User, CreditCard, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminSearchStore } from '@/store/useAdminSearchStore';

export default function AdminOrdersPage() {
  const allOrders = useOrderStore((state) => state.orders);
  const [mounted, setMounted] = useState(false);
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setAdminSearchTerm('');
  }, [setAdminSearchTerm]);

  if (!mounted) return null;

  const filteredOrders = allOrders.filter(order => 
    order.id.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    order.shippingDetails?.email.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    order.shippingDetails?.firstName.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    order.shippingDetails?.lastName.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Orders Management</h1>
           <p className="text-zinc-500 font-medium">View and manage all customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Orders:</span>
                <span className="text-sm font-black bg-black text-white px-3 py-1 rounded-full">{filteredOrders.length}</span>
            </div>
        </div>

        {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <th className="px-8 py-6">Order ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Items</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                    {filteredOrders.map((order) => (
                        <tr 
                            key={order.id} 
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                        >
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-sm">#{order.id}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-zinc-900">
                                        {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">{order.shippingDetails?.email}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2",
                                    order.status === 'Delivered' ? "bg-green-100 text-green-700" : 
                                    order.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : 
                                    order.status === 'Shipped' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                )}>
                                    <span className={cn("w-2 h-2 rounded-full", 
                                       order.status === 'Delivered' ? "bg-green-500" : 
                                       order.status === 'Pending' ? "bg-yellow-500" : 
                                       order.status === 'Shipped' ? "bg-blue-500" : "bg-red-500"
                                    )} />
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-zinc-600">
                                {order.items.length} items
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-accent">{formatPrice(order.total)}</span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {new Date(order.date).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all ml-auto">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center text-zinc-400">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-black uppercase tracking-tight text-zinc-300">No orders found</p>
            </div>
        )}
      </div>
    </div>
  );
}
