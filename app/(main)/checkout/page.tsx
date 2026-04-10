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
import { usePromoStore } from '@/store/usePromoStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { addOrder, getOrdersByEmail } = useOrderStore();
  const { user } = useAuthStore();
  const total = typeof getTotal === 'function' ? getTotal() : 0;
  const shipping = (total || 0) > 5000 ? 0 : 350;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    paymentMethod: 'bank_deposit'
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (user) {
      const userOrders = getOrdersByEmail(user.email);
      const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

      if (lastOrder && lastOrder.shippingDetails) {
        setFormData(prev => ({
          ...prev,
          firstName: lastOrder.shippingDetails.firstName || '',
          lastName: lastOrder.shippingDetails.lastName || '',
          email: user.email || '',
          phone: lastOrder.shippingDetails.phone || '',
          address: lastOrder.shippingDetails.address || '',
          apartment: lastOrder.shippingDetails.apartment || '',
          city: lastOrder.shippingDetails.city || '',
          postalCode: lastOrder.shippingDetails.postalCode || '', 
        }));
      } else {
        const nameParts = (user.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email || '',
          phone: user.phone || '',
        }));
      }
    }
  }, [user, getOrdersByEmail]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && (step < 3)) {
      router.push('/cart');
    }
  }, [items.length, step, router]);

  const { promo } = usePromoStore();
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Reset discount if email changes to ensure valid first-timer status
  useEffect(() => {
    if (discountPercent > 0) {
        // Only reset if the email being checked actually changes
        const currentEmail = formData.email || user?.email || '';
        if (!currentEmail) {
            setDiscountPercent(0);
            setPromoError('Please re-enter your email');
        }
    }
  }, [formData.email, user?.email, discountPercent]);

  const applyPromoCode = () => {
    const trimmedInput = promoInput.trim().toLowerCase();
    const activeCode = (promo?.code || 'theelvaedit10').toLowerCase();
    const emailToCheck = formData.email || user?.email || '';
    
    if (!emailToCheck) {
      setPromoError('Please enter your email first to validate the offer');
      return;
    }

    if (trimmedInput === activeCode) {
      const userOrders = getOrdersByEmail(emailToCheck);
      if (userOrders.length > 0) {
        setPromoError('This code is only valid for your first order');
        setDiscountPercent(0);
      } else {
        setDiscountPercent(10);
        setPromoError('');
      }
    } else {
      setPromoError('Invalid promo code');
      setDiscountPercent(0);
    }
  };

  if (!mounted) return null;
  if (items.length === 0 && step < 3) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const discountAmount = total * (discountPercent / 100);
  const finalTotal = total - discountAmount + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order object
    const newOrder = {
      id: `EE-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...items],
      subtotal: total,
      discount: discountAmount,
      shipping: shipping,
      total: finalTotal,
      status: 'Pending' as const,
      shippingDetails: { ...formData },
      promoCode: discountPercent > 0 ? promoInput : null
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
        <p className="text-zinc-500 mb-2 font-black uppercase tracking-widest text-sm">Order ID: #EE-928374</p>
            Thank you for shopping with The Elva Edit. Your order has been placed successfully and will be delivered within 2-3 business days.
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/" className="h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] min-w-[240px] hover:bg-accent transition-all duration-500">BACK TO HOME</Link>
            <Link href="/products" className="h-14 border-2 border-zinc-900 text-zinc-900 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] min-w-[240px] hover:bg-black hover:text-white transition-all duration-500">KEEP SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-6 md:gap-12 mb-20 px-4 py-8 bg-zinc-50/50 rounded-2xl border border-zinc-100">
        <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl transition-premium", step >= 1 ? "text-accent bg-white shadow-sm" : "text-zinc-300")}>
            <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black", step >= 1 ? "bg-accent text-white" : "bg-zinc-100 text-zinc-400")}>1</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">Information</span>
        </div>
        <div className="w-8 h-px bg-zinc-200" />
        <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl transition-premium", step >= 2 ? "text-accent bg-white shadow-sm" : "text-zinc-300")}>
            <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black", step >= 2 ? "bg-accent text-white" : "bg-zinc-100 text-zinc-400")}>2</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">Payment</span>
        </div>
        <div className="w-8 h-px bg-zinc-200" />
        <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl transition-premium", step >= 3 ? "text-accent bg-white shadow-sm" : "text-zinc-300")}>
            <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black", step >= 3 ? "bg-accent text-white" : "bg-zinc-100 text-zinc-400")}>3</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">Success</span>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Form */}
        <div>
          <form ref={formRef} onSubmit={handlePlaceOrder} className="space-y-12">
            {step === 1 && (
              <div className="animate-in slide-in-from-left duration-500 space-y-10">

                {/* ── Unified Information Form ── */}
                <div className="bg-white border border-zinc-100 p-8 md:p-12 shadow-sm rounded-none">
                  <div className="border-b border-zinc-100 pb-8 mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Information</h2>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] mt-2 italic font-medium">Professional brand contact & delivery details</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                    {/* First Name */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">First Name</label>
                      <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="e.g. Sarah"
                      />
                    </div>
                    {/* Last Name */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Last Name</label>
                      <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="e.g. Ahmed"
                      />
                    </div>
                    
                    {/* Phone */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Phone Number</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="03XXXXXXXXX"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="name@example.com"
                      />
                    </div>

                    {/* Street Address */}
                    <div className="md:col-span-2 space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Street Address</label>
                      <input
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="House # and Street name"
                      />
                    </div>

                    {/* Apartment / Suite */}
                    <div className="md:col-span-2 space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Apartment, suite, etc. (optional)</label>
                      <input
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-300 font-medium"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">City</label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-50 px-6 text-sm outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all placeholder:text-zinc-200 font-medium"
                        placeholder="e.g. Lahore"
                      />
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-3 group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 group-focus-within:text-accent transition-colors">Postal Code</label>
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
                            "w-full h-14 bg-zinc-50 px-6 text-sm outline-none border transition-all placeholder:text-zinc-300 font-medium",
                            formData.postalCode.length === 5 ? "border-accent bg-white" : "border-transparent focus:border-zinc-200 focus:bg-white"
                          )}
                          placeholder="75500"
                        />
                        {formData.postalCode.length === 5 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                             Verified <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={formData.postalCode.length !== 5}
                  className="w-full h-14 bg-accent text-white text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                >
                  Continue to Payment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Payment</h2>
                <p className="text-xs text-zinc-500 font-medium mb-8">All transactions are secure and encrypted.</p>
                
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-12">
                  <div className="p-0 border-b border-zinc-200">
                    <label className={cn(
                      "flex items-center gap-4 p-5 cursor-pointer transition-all",
                      formData.paymentMethod === 'bank_deposit' ? "bg-zinc-50/50" : "hover:bg-zinc-50/30"
                    )}>
                      <input 
                        type="radio" 
                        checked={formData.paymentMethod === 'bank_deposit'} 
                        onChange={() => setFormData(p => ({ ...p, paymentMethod: 'bank_deposit' }))} 
                        className="w-4 h-4 accent-zinc-900" 
                      />
                      <span className="font-bold text-sm tracking-tight">Bank Deposit</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'bank_deposit' && (
                    <div className="bg-zinc-50/50 p-6 space-y-6 border-b border-zinc-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Make your payment directly into our bank account and send a screenshot to our WhatsApp number 
                        <span className="font-bold"> +92 312 6728122</span>. Please use your Order ID as the payment reference. 
                        Your order will not be shipped until the funds have cleared in our account.
                      </p>
                      
                      <div className="space-y-4 pt-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Title</p>
                          <p className="font-bold text-sm text-zinc-900">Alina Noman</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Bank</p>
                          <p className="font-bold text-sm text-zinc-900">Meezan Bank</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Account Number</p>
                            <p className="font-bold text-sm text-zinc-900">11500111983313</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">WhatsApp (Submit Proof)</p>
                            <a 
                              href="https://wa.me/923126728122" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-bold text-sm text-accent hover:underline flex items-center gap-2"
                            >
                              +92 312 6728122
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional: Add other methods here if needed, but user said remove COD */}
                </div>

                <div className="bg-white p-6 rounded-2xl flex gap-4 border border-blue-100 text-blue-800">
                    <Info className="w-6 h-6 flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                        By clicking &quot;Place Order&quot;, you agree to our Terms of Service and Privacy Policy. You will receive a confirmation call shortly to verify your order.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-12">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-full md:flex-grow h-16 border-2 border-accent rounded-2xl font-black text-sm text-accent hover:bg-accent hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer order-2 md:order-1"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="w-full md:flex-[2] h-16 bg-accent text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl uppercase tracking-[0.2em] cursor-pointer order-1 md:order-2"
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
          <div className="bg-white rounded-3xl p-10 border border-zinc-100 sticky top-32">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">YOUR ORDER</h3>
            
            <div className="max-h-[400px] overflow-auto no-scrollbar space-y-6 mb-8 pr-4">
              {(items || []).map((item) => {
                if (!item) return null;
                return (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 pb-6 border-b border-zinc-200 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-zinc-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image || ''} alt={item.name || 'Product'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-black text-sm uppercase tracking-tight">{item.name || 'Product'}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                      QTY: {item.quantity || 0}
                      {item.size && item.size !== 'One Size' && ` • SZ: ${item.size}`}
                    </p>
                    <p className="font-black text-sm mt-2">{formatPrice((item.price || 0) * (item.quantity || 0))}</p>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="mb-8 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
               <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Apply Token</label>
               <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PASTE TOKEN HERE..."
                    className="w-full h-12 bg-zinc-50 px-4 text-xs font-bold uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-accent/30 transition-all border border-zinc-50 focus:border-accent/20"
                  />
                  <button 
                    type="button"
                    onClick={applyPromoCode}
                    className="w-full sm:w-auto h-12 px-8 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all duration-500 shadow-lg flex-shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
               </div>
               {promoError && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-2 px-1">{promoError}</p>}
               {discountPercent > 0 && <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-2 px-1 animate-in slide-in-from-top-1">✓ 10% First Order Discount Applied</p>}
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-black">{formatPrice(total)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span className="uppercase tracking-widest">Discount (10%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-black text-green-600">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="h-px bg-zinc-200 mt-2" />
              <div className="flex justify-between text-2xl pt-2">
                <span className="font-black uppercase tracking-tighter">Total</span>
                <span className="font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
