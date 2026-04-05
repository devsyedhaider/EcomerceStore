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
      <div className="fixed top-0 left-0 right-0 z-[60]">
        {/* Announcement Bar */}
        <div className="bg-accent text-white py-2.5 overflow-hidden whitespace-nowrap border-b border-white/10 shadow-sm">
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

        {/* Desktop & Mobile Navbar */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-100 py-6 px-4 md:px-10 transition-all">
          <div className="max-w-[1900px] mx-auto flex items-center justify-between relative">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex-1 flex justify-start">
              <button
                className="p-2 hover:bg-zinc-50 rounded-full transition-premium group"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6 stroke-[1.2] group-hover:text-accent transition-colors" />
              </button>
            </div>

            {/* Center: Luxury Brand Logo */}
            <div className="flex-grow flex justify-center py-2">
                <Link href="/" className="flex flex-col items-center group">
                    <span className="text-3xl md:text-4xl font-lato font-black tracking-widest text-[#121212] group-hover:text-accent transition-colors duration-500 leading-tight uppercase">
                        THE AURIC VAULT
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.5em] text-accent mt-1 uppercase font-lato opacity-80">Excellence in Craft</span>
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
              transition={{ type: 'spring', damping: 35, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-full max-w-[450px] bg-white z-[80] shadow-[10px_0_40px_rgba(0,0,0,0.1)] flex flex-col pt-16 border-r border-accent/10"
            >
              <div className="flex items-center justify-between px-12 mb-20">
                 <button onClick={() => setIsOpen(false)} className="p-3 bg-zinc-50 hover:bg-[#121212] hover:text-white rounded-full transition-all group">
                    <X className="w-7 h-7 stroke-[1.5] group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-[0.3em] font-lato text-zinc-300">EST. 2026</span>
                 </div>
              </div>

              <div className="flex flex-col flex-grow px-4">
                {[
                    { name: 'HOME', href: '/' },
                    { name: 'SHOP ALL', href: '/products', hasArrow: true },
                    { name: 'NEW ARRIVALS', href: '/products?isNew=true' },
                    { name: 'BEST SELLERS', href: '/products' },
                    { name: 'COLLECTIONS', href: '/categories' },
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="px-10 py-6 text-2xl font-lato font-black text-[#121212] hover:text-accent hover:translate-x-4 transition-all duration-500 flex items-center justify-between group rounded-xl uppercase"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="relative">
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
                        </span>
                        {item.hasArrow && <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                ))}
              </div>

              {/* Sidebar Bottom Fine Print */}
              <div className="p-12 border-t border-zinc-100 flex flex-col gap-8">
                  <div className="flex items-center gap-8 text-zinc-400">
                      <Link href="#" className="hover:text-accent transition-colors scale-125"><Facebook className="w-5 h-5" /></Link>
                      <Link href="#" className="hover:text-accent transition-colors scale-125"><Instagram className="w-5 h-5" /></Link>
                      <Link href="#" className="hover:text-accent transition-colors scale-125 font-bold">X</Link>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-400 tracking-[0.2em] font-lato">© 2026 THE AURIC VAULT. ALL RIGHTS RESERVED.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-[140px] md:h-[160px]" /> {/* Proper spacer for fixed header */}
    </>
  );
}
