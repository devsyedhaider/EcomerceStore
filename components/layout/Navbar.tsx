/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, ChevronRight, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/useCategoryStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { categories } = useCategoryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = mounted ? categories : [];
  const showUser = mounted && initialized && !!user;

  const announcementItems = [
    "FREE WORLDWIDE SHIPPING ON ALL ORDERS",
    "HANDCRAFTED WITH PRECISION",
    "FREE WORLDWIDE SHIPPING ON ALL ORDERS",
    "HANDCRAFTED WITH PRECISION",
    "FREE WORLDWIDE SHIPPING ON ALL ORDERS",
    "HANDCRAFTED WITH PRECISION",
    "FREE WORLDWIDE SHIPPING ON ALL ORDERS",
    "HANDCRAFTED WITH PRECISION"
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] transition-all duration-700">
        {/* Announcement Bar - Hides on Scroll */}
        <motion.div 
            initial={false}
            animate={{ height: isScrolled ? 0 : 'auto', opacity: isScrolled ? 0 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="bg-accent text-white overflow-hidden whitespace-nowrap"
        >
            <div className="py-2.5">
                <div className="inline-block animate-marquee-fast">
                    {announcementItems.map((text, i) => (
                        <span key={i} className="text-[10px] font-bold tracking-[0.3em] uppercase mx-12 font-lato">
                            {text}
                        </span>
                    ))}
                </div>
                <div className="inline-block animate-marquee-fast" aria-hidden="true">
                    {announcementItems.map((text, i) => (
                        <span key={i} className="text-[10px] font-bold tracking-[0.3em] uppercase mx-12 font-lato">
                            {text}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>

        {/* Desktop & Mobile Navbar - Always Sticky */}
        <nav className={cn(
            "bg-white/95 backdrop-blur-md h-24 px-4 md:px-10 transition-all duration-500 border-none mt-[-1px]",
            isScrolled ? "shadow-md h-20" : ""
        )}>

          <div className="max-w-[1900px] mx-auto h-full flex items-center justify-between relative">


            {/* Left: Mobile Menu Trigger */}
            <div className="flex-1 flex justify-start items-center">
              <button
                className="p-2 hover:bg-zinc-50 rounded-full transition-premium group"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6 stroke-[1.2] group-hover:text-accent transition-colors" />
              </button>
            </div>

            {/* Center: Luxury Brand Logo */}
            <div className="flex-grow flex justify-center items-center">
                <Link href="/" className="flex flex-col items-center group">
                    <span className="text-lg md:text-xl font-lato font-black tracking-[0.2em] text-[#121212] group-hover:text-accent transition-colors duration-500 leading-tight uppercase">
                        THE AURIC VAULT
                    </span>
                    <span className="text-[6px] font-bold tracking-[0.4em] text-accent mt-0.5 uppercase font-lato opacity-80">Excellence in Craft</span>
                </Link>
            </div>

            {/* Right: Modern Actions */}
            <div className="flex-1 flex justify-end items-center gap-2 md:gap-6">
              <Link 
                href={showUser ? "/dashboard" : "/login"} 
                className="p-2 hover:bg-zinc-50 rounded-full transition-premium group"
                aria-label="User Account"
              >
                {showUser ? (
                  <div className="w-8 h-8 bg-[#121212] text-accent rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest border border-accent/30">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                ) : (
                  <User className="w-6 h-6 stroke-[1.2] group-hover:text-accent transition-colors" />
                )}
              </Link>

              <Link 
                href="/cart" 
                className="p-2 hover:bg-zinc-50 rounded-full transition-premium group relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6 stroke-[1.2] group-hover:text-accent transition-colors" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce-subtle">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Luxury Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-full max-w-[500px] bg-white z-[80] shadow-[10px_0_60px_rgba(0,0,0,0.05)] flex flex-col border-r border-[#e194b8]/10"
            >
              {/* Header inside Sidebar */}
              <div className="flex items-center justify-between p-10 md:p-12">
                 <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-zinc-50 hover:bg-[#121212] hover:text-white rounded-full transition-all group duration-500"
                >
                    <X className="w-5 h-5 stroke-[1.5] group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black tracking-[0.4em] font-lato text-zinc-300">SINCE 2026</span>
                    <span className="text-[8px] font-bold tracking-[0.2em] font-lato text-accent mt-0.5">COLLECTION N° 01</span>
                 </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col flex-grow px-10 md:px-12 mt-4">
                {[
                    { name: 'Home', href: '/' },
                    { name: 'Shop All Products', href: '/products' },
                    { name: 'New Arrivals', href: '/products?isNew=true' },
                    { name: 'The Collections', href: '/categories' },
                    { name: 'Our Craft', href: '#' },
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="group flex items-baseline gap-6 py-5 border-b border-zinc-50 transition-all duration-500"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="text-[10px] font-black text-accent tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
                          0{i + 1}
                        </span>
                        <span className="text-lg md:text-xl font-lato font-medium tracking-[0.3em] text-[#121212] group-hover:translate-x-3 group-hover:text-accent transition-all duration-500 uppercase italic-none">
                            {item.name}
                        </span>
                    </Link>
                ))}
              </div>

              {/* Sidebar Bottom Fine Print */}
              <div className="p-10 md:p-12 border-t border-zinc-50 bg-zinc-50/30">
                  <div className="flex items-center gap-10 mb-10">
                      <Link href="#" className="text-zinc-400 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></Link>
                      <Link href="#" className="text-zinc-400 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></Link>
                      <Link href="#" className="text-zinc-400 hover:text-accent transition-colors font-bold text-sm">𝕏</Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[8px] font-bold text-zinc-400 tracking-[0.3em] font-lato uppercase">© 2026 THE AURIC VAULT</p>
                    <p className="text-[8px] font-medium text-zinc-300 tracking-[0.2em] font-lato uppercase">Refining the art of high jewelry</p>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-[140px] md:h-[160px]" /> {/* Proper spacer for fixed header */}
    </>
  );
}
