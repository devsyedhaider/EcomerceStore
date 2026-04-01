/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
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
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (useAuthStore.persist.hasHydrated()) {
      setIsAuthHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setIsAuthHydrated(true);
      });
      return () => unsub();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = mounted ? categories : [];
  const showUser = mounted && isAuthHydrated && isAuthenticated;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 py-4 md:py-6 px-6 md:px-12 bg-white border-b border-gray-100"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-1 hover:text-gray-light transition-premium"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>

            <Link href="/" className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase">
              Aura<span className="font-medium">Feet</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navCategories.map((item) => (
              <Link
                key={item.id}
                href={`/products?category=${item.id}`}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-7">
            <button className="hidden md:block p-1 hover:text-gray-light transition-premium">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            
            <Link href={showUser ? "/dashboard" : "/login"} className="p-1 hover:text-gray-light transition-premium">
              {showUser ? (
                <div className="w-7 h-7 border border-black flex items-center justify-center text-[10px] font-medium uppercase tracking-widest">
                  {user?.name.charAt(0)}
                </div>
              ) : (
                <User className="w-5 h-5 stroke-[1.5]" />
              )}
            </Link>

            <Link href="/cart" className="p-1 hover:text-gray-light transition-premium relative">
              <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-16">
              <Link href="/" className="text-2xl font-light tracking-[0.3em] uppercase" onClick={() => setIsOpen(false)}>
                Aura<span className="font-medium">Feet</span>
              </Link>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-8 h-8 stroke-[1.2]" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {navCategories.map((item) => (
                <Link
                  key={item.id}
                  href={`/products?category=${item.id}`}
                  className="text-3xl font-light uppercase tracking-[0.2em] hover:translate-x-2 transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-px bg-gray-100 my-4" />
              
              <Link
                href={showUser ? "/dashboard" : "/login"}
                className="text-lg font-medium uppercase tracking-widest flex items-center gap-4"
                onClick={() => setIsOpen(false)}
              >
                {showUser ? `Account (${user?.name})` : 'Login / Register'}
              </Link>
            </div>

            <div className="mt-auto flex gap-6 text-sm uppercase tracking-widest text-gray-light">
              <Link href="/stores">Stores</Link>
              <Link href="/help">Help</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
