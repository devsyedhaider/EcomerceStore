/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

import { useCategoryStore } from '@/store/useCategoryStore';

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
    
    // Wait for Auth hydration
    if (useAuthStore.persist.hasHydrated()) {
      setIsAuthHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setIsAuthHydrated(true);
      });
      return () => unsub();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = mounted ? categories : [];
  const showUser = mounted && isAuthHydrated && isAuthenticated;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/80 backdrop-blur-md py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 group">
          <span className="bg-black text-white px-2 py-0.5 rounded group-hover:bg-accent transition-colors">AURA</span>
          <span>FEET</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navCategories.map((item) => (
            <Link
              key={item.id}
              href={`/products?category=${item.id}`}
              className="font-medium text-sm uppercase tracking-wider hover:text-accent transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden md:flex p-2 hover:bg-zinc-100 rounded-full transition-colors items-center gap-2">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href={showUser ? "/dashboard" : "/login"} className="p-2 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-2">
            {showUser ? (
                <>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black">
                        {user?.name.charAt(0)}
                    </div>
                </>
            ) : (
                <User className="w-5 h-5" />
            )}
          </Link>

          <Link href="/cart" className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] transition-transform duration-300 ease-out lg:hidden shadow-2xl px-6 py-8 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-black tracking-tighter" onClick={() => setIsOpen(false)}>
            AURA FEET
          </Link>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navCategories.map((item) => (
            <Link
              key={item.id}
              href={`/products?category=${item.id}`}
              className="text-lg font-bold border-b border-zinc-100 pb-2 flex items-center justify-between group hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
              <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
          <Link
            href={showUser ? "/dashboard" : "/login"}
            className="mt-4 flex items-center gap-3 text-lg font-bold hover:text-accent transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {showUser ? (
                <>
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">
                        {user?.name.charAt(0)}
                    </div>
                    {user?.name}
                </>
            ) : (
                <>
                    <User className="w-6 h-6" /> Login / Signup
                </>
            )}
          </Link>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <p className="text-zinc-500 text-sm">© 2026 Aura Feet Pakistan. All rights reserved.</p>
        </div>
      </div>
    </nav>
  );
}
