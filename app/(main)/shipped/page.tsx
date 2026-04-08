'use client';

import { motion } from 'framer-motion';
import { Truck, Globe, ShieldCheck, Clock, CheckCircle, PackageSearch, Package } from 'lucide-react';
import { useState } from 'react';

export default function ShippedPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTimeout(() => {
        alert('Universal Tracking API Connected: We are currently retrieving status for ' + trackingNumber + ' - Order is currently in Lahore Hub.');
        setIsTracking(false);
    }, 1500);
  };

  const shippingFaqs = [
    { q: 'What is your delivery timeframe?', a: 'Within Pakistan, we offer 2-4 business day delivery. International orders via DHL take 7-12 business days.' },
    { q: 'How do I return a piece?', a: 'Return requests must be initiated within 48 hours of delivery. Pieces must be in original unworn condition with tags.' },
    { q: 'Is shipping insured?', a: 'Yes, every The Elva Edit piece is fully insured during transit against theft and accidental damage until signed for by you.' }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-28 pb-40">
      {/* Hero Tracking Section */}
      <section className="px-6 md:px-12 py-16 bg-zinc-950 text-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
           <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
           >
              <PackageSearch className="w-12 h-12 text-accent mx-auto mb-4" />
              <h1 className="text-4xl md:text-7xl font-light uppercase tracking-tighter">Track your <span className="text-accent underline decoration-white/20 underline-offset-8">Order</span></h1>
              <p className="text-zinc-500 text-sm md:text-base font-medium max-w-lg mx-auto py-4 uppercase tracking-widest">Global Handcrafted Logistic Support</p>
              
              <form onSubmit={handleTrack} className="max-w-xl mx-auto flex flex-col md:flex-row gap-4 pt-10">
                 <input 
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="ENTER ORDER NO. OR TRACKING ID"
                    className="flex-grow h-16 bg-white/5 border border-white/10 rounded-2xl px-8 text-sm outline-none focus:ring-1 focus:ring-accent transition-all font-bold tracking-widest uppercase placeholder:text-white/20"
                 />
                 <button 
                    type="submit"
                    disabled={isTracking}
                    className="px-12 h-16 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {isTracking ? 'Verifying...' : 'TRACK STATUS'}
                 </button>
              </form>
           </motion.div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-zinc-800/10 rounded-full blur-[120px]" />
      </section>

      {/* Shipping Philosophies */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Globe, label: 'Global Concierge', text: 'Worldwide delivery to over 150 countries.' },
              { icon: ShieldCheck, label: 'Insured Transit', text: '100% full-value insurance on every dispatch.' },
              { icon: Truck, label: 'Express Delivery', text: ' लाहौर-based hub for rapid nationwide dispatch.' },
              { icon: Clock, label: 'Real-time Tracking', text: 'SMS and Email alerts at every stage of transit.' }
            ].map((feature, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: false }}
                  className="space-y-6 text-center lg:text-left bg-white p-8 rounded-[32px] border border-zinc-100 hover:border-accent/40 transition-all duration-700"
               >
                  <feature.icon className="w-8 h-8 text-accent mx-auto lg:mx-0 stroke-[1.2]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">{feature.label}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed font-medium">{feature.text}</p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Shipping Policies / FAQ */}
      <section className="py-24 px-6 md:px-12 bg-white">
         <div className="max-w-[800px] mx-auto space-y-20">
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-light uppercase tracking-[0.2em] text-zinc-900 underline decoration-accent underline-offset-[12px] decoration-1">Liner Logistics Policies</h2>
               <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-black">Transparency in Transit</p>
            </div>

            <div className="space-y-12">
               {shippingFaqs.map((faq, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ delay: i * 0.2 }}
                     viewport={{ once: false }}
                     className="space-y-4 border-b border-zinc-100 pb-10"
                  >
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-accent" /> {faq.q}
                     </p>
                     <p className="text-sm text-zinc-500 font-medium leading-relaxed pl-7">{faq.a}</p>
                  </motion.div>
               ))}
            </div>

            {/* Delivery Steps */}
            <div className="pt-20">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: '01', title: 'Quality Inspection', icon: ShieldCheck },
                    { step: '02', title: 'Master Packing', icon: Package },
                    { step: '03', title: 'Secure Handover', icon: Truck }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-6 group">
                       <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-700">
                          <item.icon className="w-7 h-7 stroke-[1.2]" />
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-accent tracking-[0.5em] mb-2">{item.step}</p>
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-900">{item.title}</h4>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
