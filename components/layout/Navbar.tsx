/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Heart, Search, Menu, X, ChevronRight, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/useCategoryStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { categories } = useCategoryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const { user, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

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

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubMenu(null);
  };

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
        {/* Announcement Bar - Hides on Scroll or Auth Pages */}
        {!isAuthPage && (
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
        )}

        {/* Main Brand & Actions Bar */}
        <nav className={cn(
            "bg-white/95 backdrop-blur-md px-4 md:px-10 transition-all duration-500 border-none",
            isScrolled ? "h-20" : "h-24"
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
                    <span className="text-[6px] font-bold tracking-[0.4em] text-accent mt-0 uppercase font-lato opacity-80">Excellence in Craft</span>
                </Link>
            </div>

            {/* Right: Modern Actions */}
            <div className="flex-1 flex justify-end items-center gap-2 md:gap-6">
              <Link 
                href="/wishlist" 
                className="p-2 hover:bg-zinc-50 rounded-full transition-premium group relative"
                aria-label="Wishlist"
              >
                <Heart className="w-6 h-6 stroke-[1.2] group-hover:text-accent transition-colors" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce-subtle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

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
              transition={{ type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-0 top-0 bottom-0 w-full max-w-[400px] bg-white z-[80] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header inside Sidebar - Match Image style (X at top left) */}
              <div className="flex items-center justify-start p-6">
                 <button 
                  onClick={handleClose} 
                  className="p-2 hover:bg-zinc-50 rounded-full transition-all"
                >
                    <X className="w-8 h-8 stroke-[1]" />
                 </button>
              </div>

              <div className="relative flex-grow flex overflow-hidden">
                {/* Primary Menu */}
                <motion.div 
                  className="flex flex-col flex-grow w-full overflow-y-auto"
                  animate={{ x: activeSubMenu === 'shop' ? '-100%' : '0%' }}
                  transition={{ type: 'tween', duration: 0.4 }}
                >
                  {[
                      { name: 'Home', href: '/' },
                      { name: 'Shop All Products', type: 'trigger', id: 'shop' },
                      { name: 'New Arrivals', href: '/products?isNew=true' },
                      { name: 'Trending Now', href: '/trending' },
                      { name: 'The Collections', href: '/categories' },
                      { name: 'Our Craft', href: '#' },
                  ].map((item, i) => (
                      item.type === 'trigger' ? (
                        <button
                          key={i}
                          onClick={() => setActiveSubMenu(item.id || null)}
                          className="flex items-center justify-between px-8 py-6 border-b border-zinc-50 hover:bg-zinc-50 transition-colors w-full text-left group"
                        >
                          <span className="text-base font-normal text-zinc-800">
                                {item.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[1.5] group-hover:text-black transition-colors" />
                        </button>
                      ) : (
                        <Link
                            key={i}
                            href={item.href || '#'}
                            className="flex items-center px-8 py-6 border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                            onClick={handleClose}
                        >
                            <span className="text-base font-normal text-zinc-800">
                                {item.name}
                            </span>
                        </Link>
                      )
                  ))}
                </motion.div>

                {/* Sub-panel for Categories - Exact Image Match */}
                <motion.div
                   className="absolute inset-x-0 inset-y-0 bg-white flex flex-col w-full h-full"
                   initial={{ x: '100%' }}
                   animate={{ x: activeSubMenu === 'shop' ? '0%' : '100%' }}
                   transition={{ type: 'tween', duration: 0.4 }}
                >
                  <button 
                    onClick={() => setActiveSubMenu(null)}
                    className="flex items-center gap-4 px-8 py-4 bg-zinc-50 text-zinc-500 hover:text-black transition-colors w-full"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 stroke-[2]" />
                    <span className="text-sm font-medium">Shop</span>
                  </button>

                  <div className="flex-grow overflow-y-auto w-full">
                    <Link 
                        href="/products" 
                        onClick={handleClose}
                        className="flex items-center justify-between px-8 py-6 border-b border-zinc-50 hover:bg-zinc-50"
                    >
                      <span className="text-base font-normal text-zinc-800">All Products</span>
                    </Link>

                    {navCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.id}`}
                        onClick={handleClose}
                        className="flex items-center justify-between px-8 py-6 border-b border-zinc-50 hover:bg-zinc-50 group"
                      >
                        <span className="text-base font-normal text-zinc-800">
                          {cat.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[1.5] group-hover:text-black transition-colors" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
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
      <div className={cn(
        "transition-all duration-500",
        isAuthPage ? "h-[100px]" : "h-[110px] md:h-[130px]"
      )} /> {/* Proper spacer for fixed header */}
    </>
  );
}
