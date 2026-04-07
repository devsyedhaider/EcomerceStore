'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'already' | 'error'>('success');

  useEffect(() => {
    setMounted(true);
  }, []);

  const shoppingLinks = mounted ? categories.map(cat => ({
    name: cat.name,
    href: `/products?category=${cat.id}`
  })) : [];

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    try {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) return;
      
      const { error } = await supabase.from('newsletter_subs').insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          setModalType('already');
          form.reset();
        } else {
          setModalType('error');
        }
      } else {
        setModalType('success');
        form.reset();
      }
      setShowModal(true);
    } catch (err) {
      setModalType('error');
      setShowModal(true);
    }
  };

  const modalContent = {
    success: {
      title: "Welcome to our World",
      desc: "You've successfully joined the community. Prepare for exclusive access to our finest collections.",
      icon: <CheckCircle2 className="w-10 h-10 text-accent" />,
      btn: "Perfect"
    },
    already: {
      title: "Already Rooted",
      desc: "You're already part of our elite community. Check your inbox for our latest updates.",
      icon: <Mail className="w-10 h-10 text-accent" />,
      btn: "Understood"
    },
    error: {
      title: "Connection Lost",
      desc: "We couldn't process your request. Please try again or reach out to our support.",
      icon: <AlertCircle className="w-10 h-10 text-red-500" />,
      btn: "Retry"
    }
  }[modalType];

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-24">
          {/* Column 1: Brand & Newsletter Integrated */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col">
              <span className="text-4xl font-lato font-black tracking-widest uppercase italic text-white leading-none">
                ElvaEdit
              </span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-500 mt-2 uppercase underline decoration-accent underline-offset-8">Boutique Jewellery</span>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Join Our World</h4>
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 leading-relaxed max-w-[280px]">
                  Subscribe to receive updates, access to exclusive deals, and more.
                </p>
              </div>
              
              <form 
                onSubmit={handleSubscribe}
                className="flex flex-col gap-6 w-full"
              >
                <div className="border-b border-zinc-800 pb-3 group-focus-within:border-accent transition-all duration-500">
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="bg-transparent border-none p-0 w-full text-[10px] font-black uppercase tracking-[0.3em] focus:ring-0 outline-none placeholder:text-zinc-700 text-white selection:bg-accent/30"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-accent text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:border-white transition-all duration-500 shadow-xl cursor-pointer"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Boutique Links */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Boutique</h4>
            <ul className="flex flex-col gap-5">
              <li><Link href="/about" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-black">About Us</Link></li>
              <li><Link href="/contact" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-black">Contact Us</Link></li>
              <li><Link href="/new-arrivals" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-black">New Arrivals</Link></li>
              <li><Link href="/categories" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-black">Our Collection</Link></li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Shop</h4>
            <ul className="flex flex-col gap-5">
              {shoppingLinks.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-black"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social & Contact */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Social Muse</h4>
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-8">
                <a href="#" className="text-zinc-500 hover:text-accent transition-all">
                  <Facebook className="w-5 h-5 stroke-1" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-accent transition-all">
                  <Instagram className="w-5 h-5 stroke-1" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-white flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Youtube</span>
                </a>
              </div>
              
              <div className="flex flex-col gap-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold underline decoration-zinc-900 underline-offset-4">support@elvaedit.com</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-600 font-bold">+92 300 123 4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600">
          <div className="flex items-center gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 opacity-20 contrast-0 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-20 contrast-0 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-20 contrast-0 invert" />
          </div>
          
          <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
            © 2026 ElvaEdit. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Premium Subscription Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-sm bg-white p-12 text-center shadow-2xl"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                 {modalContent.icon}
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-zinc-900 leading-tight">
                {modalContent.title}
              </h3>
              
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-10 leading-relaxed">
                {modalContent.desc}
              </p>

              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all duration-500"
              >
                {modalContent.btn}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

