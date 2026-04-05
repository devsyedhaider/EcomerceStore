/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, MapPin, User, Mail, CreditCard, ChevronRight, Truck, Info, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, cn } from '@/lib/utils';

import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { addOrder, getOrdersByEmail } = useOrderStore();
  const { user } = useAuthStore();
  const total = getTotal();
  const shipping = total > 5000 ? 0 : 250;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod'
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (user) {
      const userOrders = getOrdersByEmail(user.email);
      const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

      if (lastOrder) {
        setFormData(prev => ({
          ...prev,
          firstName: lastOrder.shippingDetails.firstName,
          lastName: lastOrder.shippingDetails.lastName,
          email: user.email,
          phone: lastOrder.shippingDetails.phone,
          address: lastOrder.shippingDetails.address,
          city: lastOrder.shippingDetails.city,
          postalCode: lastOrder.shippingDetails.postalCode || '', // Handle legacy orders without postalCode
        }));
      } else {
        const nameParts = (user.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email,
          phone: user.phone || '',
        }));
      }
    }
  }, [user, getOrdersByEmail]);

  if (items.length === 0 && step < 3) {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order object
    const newOrder = {
      id: `AV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(), // Use ISO string for database compatibility
      items: [...items],
      total: total + shipping,
      status: 'Pending' as const,
      shippingDetails: { ...formData }
    };

    try {
      await addOrder(newOrder);
      setStep(3);
      setTimeout(() => {
          clearCart();
      }, 100);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please check your connection.');
    }
  };

  const handleContinueToPayment = () => {
    if (formRef.current && formRef.current.checkValidity()) {
        setStep(2);
    } else {
        formRef.current?.reportValidity();
    }
  };

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Order Confirmed!</h1>
        <p className="text-zinc-500 mb-2 font-black uppercase tracking-widest text-sm">Order ID: #AV-928374</p>
        <p className="text-zinc-500 mb-12 max-w-md font-medium text-lg leading-relaxed">
            Thank you for shopping with THE AURIC VAULT. Your order has been placed successfully and will be delivered within 2-3 business days.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="btn-primary min-w-[200px]">BACK TO HOME</Link>
            <Link href="/products" className="btn-outline min-w-[200px]">KEEP SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <div className={cn("flex items-center gap-2", step >= 1 ? "text-black" : "text-zinc-300")}>
            <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black", step >= 1 ? "bg-black text-white" : "bg-zinc-100 text-zinc-400")}>1</span>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Information</span>
        </div>
        <div className="w-12 h-px bg-zinc-200" />
        <div className={cn("flex items-center gap-2", step >= 2 ? "text-black" : "text-zinc-300")}>
            <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black", step >= 2 ? "bg-black text-white" : "bg-zinc-100 text-zinc-400")}>2</span>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Payment</span>
        </div>
        <div className="w-12 h-px bg-zinc-200" />
        <div className={cn("flex items-center gap-2", step >= 3 ? "text-black" : "text-zinc-300")}>
            <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black", step >= 3 ? "bg-black text-white" : "bg-zinc-100 text-zinc-400")}>3</span>
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Success</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Form */}
        <div>
          <form ref={formRef} onSubmit={handlePlaceOrder} className="space-y-12">
            {step === 1 && (
              <div className="animate-in slide-in-from-left duration-500 space-y-10">

                {/* ── Contact Info ── */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-light uppercase tracking-[0.2em] leading-none">Contact Info</h2>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mt-1">Used for delivery updates</p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-100 p-8 space-y-6">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">First Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                          <input
                            required
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full h-12 bg-zinc-50 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                            placeholder="First name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                          <input
                            required
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full h-12 bg-zinc-50 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                        <input
                          required
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full h-12 bg-zinc-50 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full h-12 bg-zinc-50 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                          placeholder="03XXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Shipping Address ── */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-light uppercase tracking-[0.2em] leading-none">Shipping Address</h2>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mt-1">Where should we deliver?</p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-100 p-8 space-y-6">
                    {/* Street */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                        <input
                          required
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full h-12 bg-zinc-50 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                          placeholder="House #, Street name, Area"
                        />
                      </div>
                    </div>

                    {/* City + Postal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">City</label>
                        <input
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full h-12 bg-zinc-50 px-4 text-sm outline-none border border-transparent focus:border-black transition-all placeholder:text-zinc-300"
                          placeholder="Karachi, Lahore, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                          Postal Code <span className="text-zinc-300 ml-1">(5 digits)</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                              setFormData(prev => ({ ...prev, postalCode: val }));
                            }}
                            className={cn(
                              "w-full h-12 bg-zinc-50 px-4 pr-10 text-sm outline-none border transition-all placeholder:text-zinc-300",
                              formData.postalCode.length === 5 ? "border-green-400 bg-green-50/30" : "border-transparent focus:border-black"
                            )}
                            placeholder="75500"
                          />
                          {formData.postalCode.length === 5 && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={formData.postalCode.length !== 5}
                  className="w-full h-14 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  Continue to Payment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <CreditCard className="w-8 h-8" /> PAYMENT METHOD
                </h2>
                
                <div className="space-y-4 mb-12">
                   <label className={cn(
                       "flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all",
                       formData.paymentMethod === 'cod' ? "border-black bg-zinc-50 shadow-md" : "border-zinc-100 hover:border-zinc-300"
                   )}>
                       <div className="flex items-center gap-4">
                           <input type="radio" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData(p => ({ ...p, paymentMethod: 'cod' }))} className="w-5 h-5 accent-black" />
                           <div>
                               <p className="font-black uppercase tracking-tight">Cash on Delivery (COD)</p>
                               <p className="text-xs text-zinc-500 font-medium">Pay when you receive your order at your doorstep</p>
                           </div>
                       </div>
                       <Truck className="w-6 h-6 text-zinc-400" />
                   </label>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl flex gap-4 border border-blue-100 text-blue-800">
                    <Info className="w-6 h-6 flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                        By clicking &quot;Place Order&quot;, you agree to our Terms of Service and Privacy Policy. You will receive a confirmation call shortly to verify your order.
                    </p>
                </div>

                <div className="flex gap-4 mt-12">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="flex-grow h-16 border-2 border-black rounded-2xl font-black text-lg hover:bg-zinc-50 transition-all uppercase"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl uppercase"
                  >
                    Place Your Order
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-zinc-50 rounded-3xl p-10 border border-zinc-100 sticky top-32">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">YOUR ORDER</h3>
            
            <div className="max-h-[400px] overflow-auto no-scrollbar space-y-6 mb-8 pr-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 pb-6 border-b border-zinc-200 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-zinc-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-black text-sm uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">QTY: {item.quantity} • SZ: {item.size}</p>
                    <p className="font-black text-sm mt-2">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-black">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-black text-green-600">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="h-px bg-zinc-200 mt-2" />
              <div className="flex justify-between text-2xl pt-2">
                <span className="font-black uppercase tracking-tighter">Total</span>
                <span className="font-black">{formatPrice(total + shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

