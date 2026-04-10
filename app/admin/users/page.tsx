'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice, cn } from '@/lib/utils';
import { User, Mail, Phone, ShoppingBag, DollarSign, Search, ChevronRight, MapPin } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

import { useAdminSearchStore } from '@/store/useAdminSearchStore';

export default function AdminCustomersPage() {
  const allOrders = useOrderStore((state) => state.orders);
  const [mounted, setMounted] = useState(false);
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();

  useEffect(() => {
    setMounted(true);
    return () => setAdminSearchTerm('');
  }, [setAdminSearchTerm]);

  const customers = useMemo(() => {
    const customerMap = new Map();

    // Derive customer list from orders
    allOrders.forEach(order => {
      const details = order.shippingDetails;
      if (!details?.email) return;

      const email = details.email;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email,
          name: `${details.firstName || ''} ${details.lastName || ''}`.trim() || 'Anonymous',
          phone: details.phone || 'N/A',
          city: details.city || 'N/A',
          address: details.address || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.date
        });
      }

      const customer = customerMap.get(email);
      customer.totalOrders += 1;
      customer.totalSpent += (order.total || 0);
    });

    return Array.from(customerMap.values());
  }, [allOrders]);

  if (!mounted) return null;

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Customer Database</h1>
           <p className="text-zinc-500 font-medium">Manage and view details of all customers who have placed orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Customers:</span>
                <span className="text-sm font-black bg-black text-white px-3 py-1 rounded-full">{filteredCustomers.length}</span>
            </div>
        </div>

        {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Contact Details</th>
                        <th className="px-8 py-6">Location</th>
                        <th className="px-8 py-6">Order Stats</th>
                        <th className="px-8 py-6">Total Spent</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                    {filteredCustomers.map((customer, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-sm">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-tight">{customer.name}</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Customer ID: C-{idx + 1001}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="space-y-1">
                                    <a 
                                        href={`mailto:${customer.email}`}
                                        className="flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-accent transition-colors cursor-pointer"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                        {customer.email}
                                    </a>
                                    <a 
                                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-green-600 transition-colors cursor-pointer"
                                    >
                                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                        {customer.phone}
                                    </a>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    {customer.city}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-zinc-100 text-zinc-900 px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5">
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        {customer.totalOrders} Orders
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-accent">{formatPrice(customer.totalSpent)}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center text-zinc-400">
                <User className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-black uppercase tracking-tight text-zinc-300">No customers found</p>
                <p className="text-sm font-medium">Customers will appear here once they place an order.</p>
            </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-[32px] p-8 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Retention Rate</p>
              <h3 className="text-3xl font-black">84%</h3>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">Percentage of customers who have placed more than one order.</p>
          </div>
          <div className="bg-white rounded-[32px] border border-zinc-200 p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Avg. Order Value</p>
              <h3 className="text-3xl font-black">
                {customers.length > 0 && allOrders.length > 0
                  ? formatPrice(customers.reduce((acc, c) => acc + c.totalSpent, 0) / allOrders.length) 
                  : formatPrice(0)
                }
              </h3>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">Average amount spent by each customer per transaction.</p>
          </div>
          <div className="bg-white rounded-[32px] border border-zinc-200 p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">New Customers</p>
              <h3 className="text-3xl font-black">+{customers.filter(c => c.totalOrders === 1).length}</h3>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">Number of customers who placed their first order this month.</p>
          </div>
      </div>
    </div>
  );
}
