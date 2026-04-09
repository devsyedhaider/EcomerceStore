'use client';

/* eslint-disable @next/next/no-img-element */
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice, cn } from '@/lib/utils';
import { ArrowLeft, Package, User, MapPin, Phone, Mail, Clock, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders, updateOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-16 h-16 text-zinc-200 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Order Not Found</h2>
        <Link href="/admin/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: any) => {
    if (order.status === newStatus) return;
    
    setIsUpdating(true);
    try {
      await updateOrder(order.id, newStatus);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Updating cloud failed, but local status changed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Order #{order.id}</h1>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        order.status === 'Delivered' ? "bg-green-100 text-green-700" : 
                        order.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : 
                        order.status === 'Shipped' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                    )}>
                        {order.status}
                    </span>
                </div>
                <p className="text-zinc-500 font-medium tracking-tight mt-1">
                    Placed on {new Date(order.date).toLocaleDateString()} • {order.items.length} Items
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Order Items */}
                <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden p-8">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5" /> Order Items
                    </h2>
                    <div className="space-y-6">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center border-b border-zinc-50 pb-6 last:border-0 last:pb-0">
                                <div className="w-20 h-20 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-black text-sm uppercase tracking-tight">{item.name}</h4>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                        {item.size && item.size !== 'One Size' && `SZ: ${item.size} • `}QTY: {item.quantity}
                                    </p>
                                    <p className="font-black text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-zinc-100">
                         <div className="flex justify-between items-center text-2xl font-black uppercase tracking-tighter">
                            <span>Order Total</span>
                            <span className="text-accent">{formatPrice(order.total)}</span>
                         </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden p-8">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" /> Buyer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Full Name</p>
                                    <p className="font-bold">{order.shippingDetails?.firstName || 'Guest'} {order.shippingDetails?.lastName || ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Email Address</p>
                                    <p className="font-bold">{order.shippingDetails?.email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Phone Number</p>
                                    <p className="font-bold">{order.shippingDetails?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Shipping Address</p>
                                    <p className="font-bold leading-relaxed">
                                        {order.shippingDetails?.address || 'N/A'}
                                        {order.shippingDetails?.apartment && <span className="block text-zinc-500 text-[10px] mt-0.5">{order.shippingDetails.apartment}</span>}
                                    </p>
                                    <p className="font-bold mt-1 text-zinc-600 uppercase text-xs">{order.shippingDetails?.city || ''}, {order.shippingDetails?.postalCode || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Management Sidebar */}
            <div className="space-y-6">
                <div className="bg-zinc-900 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-16 -mt-16" />
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-8 relative z-10">Manage Status</h2>
                    <div className="space-y-3 relative z-10">
                        {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={isUpdating}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-sm font-bold",
                                    order.status === status 
                                        ? "bg-white text-black border-white" 
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    {status === 'Pending' && <Clock className="w-4 h-4" />}
                                    {status === 'Shipped' && <Truck className="w-4 h-4" />}
                                    {status === 'Delivered' && <CheckCircle2 className="w-4 h-4" />}
                                    {status === 'Cancelled' && <Package className="w-4 h-4 opacity-50" />}
                                    {status}
                                </span>
                                {order.status === status && <CheckCircle2 className="w-4 h-4 text-accent" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-zinc-200 p-8">
                     <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Payment Method</h3>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center">
                            <Truck className="w-5 h-5 text-zinc-400" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-tight">
                            {order.shippingDetails?.paymentMethod === 'bank_deposit' ? 'Bank Deposit' : 
                             order.shippingDetails?.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             order.shippingDetails?.paymentMethod || 'N/A'}
                        </span>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}
