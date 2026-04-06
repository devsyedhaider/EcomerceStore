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
              <div className="py-1.5">
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
            isScrolled ? "h-16" : "h-20"
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
                <Link href="/" className="flex flex-col items-center group text-center">
                    <span className="text-lg md:text-xl font-lato font-black tracking-[0.2em] text-[#121212] group-hover:text-accent transition-colors duration-500 leading-tight uppercase">
                        EDITEVAL
                    </span>
                    <span className="text-[6px] font-bold tracking-[0.4em] text-accent mt-0 uppercase font-lato opacity-80">Boutique Jewellery</span>
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

        {/* 2nd Navbar: High-Impact Responsive Category Tabs */}
        {!isAuthPage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border-t border-zinc-50 shadow-sm"
          >
             <div className="max-w-7xl mx-auto px-4 md:px-0">
                <ul className="flex items-center justify-center gap-8 md:gap-14 h-12 overflow-x-auto no-scrollbar scroll-smooth">
                   {[
                      { name: 'Home', href: '/' },
                      { name: 'About us', href: '/#about-us' },
                      { name: 'Contact us', href: '/contact' },
                      { name: 'New Arrival', href: '/products?sort=new' },
                      { name: 'Trending', href: '/trending' },
                      { name: 'Shipped', href: '/account' }
                   ].map((tab) => (
                      <li key={tab.name}>
                         <Link 
                            href={tab.href}
                            className={cn(
                               "text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] whitespace-nowrap transition-all duration-500 py-3 block hover:text-accent relative group text-zinc-500",
                               pathname === tab.href ? "text-black" : ""
                            )}
                         >
                            {tab.name}
                            <span className={cn(
                               "absolute bottom-0 left-0 w-full h-[1.5px] bg-accent transition-transform duration-500 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left",
                               pathname === tab.href ? "scale-x-100 origin-left" : ""
                            )} />
                         </Link>
                      </li>
                   ))}
                </ul>
             </div>
          </motion.div>
        )}
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
                  className="flex flex-col flex-grow w-full overflow-y-auto custom-scrollbar"
                  animate={{ x: activeSubMenu === 'shop' ? '-100%' : '0%' }}
                  transition={{ type: 'tween', duration: 0.4 }}
                >
                  <motion.div 
                    initial="closed"
                    animate="open"
                    variants={{
                        open: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
                        closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                    }}
                    className="flex flex-col"
                  >
                    {[
                        { name: 'Home', href: '/' },
                        { name: 'Shop All Products', type: 'trigger', id: 'shop' },
                        { name: 'New Arrivals', href: '/products?isNew=true' },
                        { name: 'Trending Now', href: '/trending' },
                        { name: 'The Collections', href: '/categories' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                open: { opacity: 1, y: 0 },
                                closed: { opacity: 0, y: 20 }
                            }}
                            className="border-b border-zinc-50"
                        >
                            {item.type === 'trigger' ? (
                                <button
                                    onClick={() => setActiveSubMenu(item.id || null)}
                                    className="flex items-center justify-between px-8 py-8 w-full text-left group overflow-hidden"
                                >
                                    <div className="flex items-center gap-6">
                                       <span className="text-[10px] font-black text-accent tracking-widest">0{i + 1}</span>
                                       <span className="text-lg font-light uppercase tracking-[0.15em] text-zinc-900 group-hover:tracking-[0.25em] group-hover:text-accent transition-all duration-700">
                                          {item.name}
                                       </span>
                                    </div>
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                       <ChevronRight className="w-4 h-4 text-zinc-300 stroke-[1] group-hover:translate-x-2 transition-all duration-700" />
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href={item.href || '#'}
                                    className="flex items-center px-8 py-8 w-full group overflow-hidden"
                                    onClick={handleClose}
                                >
                                    <div className="flex items-center gap-6">
                                       <span className="text-[10px] font-black text-accent tracking-widest">0{i + 1}</span>
                                       <span className="text-lg font-light uppercase tracking-[0.15em] text-zinc-900 group-hover:tracking-[0.25em] group-hover:text-accent transition-all duration-700">
                                          {item.name}
                                       </span>
                                    </div>
                                </Link>
                            )}
                        </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Sub-panel for Categories - Staggered entrance */}
                <motion.div
                   className="absolute inset-x-0 inset-y-0 bg-white flex flex-col w-full h-full"
                   initial={{ x: '100%' }}
                   animate={{ x: activeSubMenu === 'shop' ? '0%' : '100%' }}
                   transition={{ type: 'tween', duration: 0.4 }}
                >
                  <button 
                    onClick={() => setActiveSubMenu(null)}
                    className="flex items-center gap-4 px-8 py-5 bg-zinc-50 text-zinc-500 hover:text-black transition-colors w-full border-b border-zinc-100"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 stroke-[2]" />
                    <span className="text-sm font-medium">Shop</span>
                  </button>

                  <motion.div 
                    initial={false}
                    animate={activeSubMenu === 'shop' ? "open" : "closed"}
                    variants={{
                        open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                        closed: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="flex-grow overflow-y-auto w-full custom-scrollbar"
                  >
                    <motion.div variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}>
                        <Link 
                            href="/products" 
                            onClick={handleClose}
                            className="flex items-center justify-between px-8 py-6 border-b border-zinc-50 hover:bg-zinc-50 group"
                        >
                        <span className="text-base font-normal text-zinc-900 group-hover:pl-4 transition-all duration-500">All Products</span>
                        </Link>
                    </motion.div>

                    {navCategories.map((cat, i) => (
                      <motion.div 
                        key={cat.id}
                        variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}
                      >
                        <Link
                            href={`/products?category=${cat.id}`}
                            onClick={handleClose}
                            className="flex items-center justify-between px-8 py-7 border-b border-zinc-50 hover:bg-zinc-50 group transition-all duration-500"
                        >
                            <div className="flex items-center gap-6">
                               <span className="text-[10px] font-black text-accent tracking-widest">0{i + 1}</span>
                               <span className="text-lg font-light uppercase tracking-[0.15em] text-zinc-900 group-hover:tracking-[0.25em] group-hover:text-accent transition-all duration-700">
                                  {cat.name}
                               </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-300 stroke-[1] group-hover:translate-x-2 transition-all duration-700" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
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
                    <p className="text-[8px] font-bold text-zinc-400 tracking-[0.3em] font-lato uppercase">© 2026 EDITEVAL</p>
                    <p className="text-[8px] font-medium text-zinc-300 tracking-[0.2em] font-lato uppercase">Boutique Jewellery</p>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className={cn(
        "transition-all duration-500",
        isAuthPage ? "h-[80px]" : "h-[90px] md:h-[110px]"
      )} /> {/* Proper spacer for fixed header */}
    </>
  );
}
