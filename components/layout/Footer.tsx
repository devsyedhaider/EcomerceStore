'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useState, useEffect } from 'react';

const footerLinks = [];

export default function Footer() {
  const { categories } = useCategoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shoppingLinks = mounted ? categories.map(cat => ({
    name: cat.name,
    href: `/products?category=${cat.id}`
  })) : [];

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <Link href="/" className="group flex flex-col">
              <span className="text-3xl font-lato font-black tracking-widest uppercase italic group-hover:text-accent transition-colors">
                ElvaEdit
              </span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-zinc-500 mt-1 uppercase font-lato">Boutique Jewellery</span>
            </Link>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Join our world</h4>
              <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 leading-relaxed max-w-xs">
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const { supabase } = await import('@/lib/supabase');
                  if (!supabase) return;
                  
                  const { error } = await supabase.from('newsletter_subs').insert([{ email }]);
                  if (error) {
                    if (error.code === '23505') {
                      alert('You are already subscribed!');
                    } else {
                      alert('Error subscribing. Please try again.');
                    }
                  } else {
                    alert('Thank you for subscribing!');
                    form.reset();
                  }
                }}
                className="flex border-b border-zinc-800 pb-2 max-w-sm group focus-within:border-accent transition-premium"
              >
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="bg-transparent border-none p-0 w-full text-[10px] uppercase tracking-[0.2em] focus:ring-0 outline-none placeholder:text-gray-600"
                />
                <button type="submit" className="p-2 hover:translate-x-1 transition-premium">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections - Boutique & Shop */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-12">
             
             {/* Brand Column */}
             <div className="flex flex-col gap-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white underline decoration-accent underline-offset-8 decoration-1">Boutique</h4>
               <ul className="flex flex-col gap-4">
                 <li><Link href="/about" className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-bold">About Us</Link></li>
                 <li><Link href="/contact" className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-bold">Contact Us</Link></li>
                 <li><Link href="/new-arrivals" className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-bold">New Arrivals</Link></li>
                 <li><Link href="/products" className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-accent transition-all font-bold">The Collection</Link></li>
               </ul>
             </div>

             {/* Collections Column */}
             <div className="flex flex-col gap-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white underline decoration-zinc-800 underline-offset-8 decoration-1">Shop</h4>
               <ul className="flex flex-col gap-4">
                 {shoppingLinks.slice(0, 5).map((link) => (
                   <li key={link.name}>
                     <Link
                       href={link.href}
                       className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all font-bold"
                     >
                       {link.name}
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          {/* Social Presence */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Social Muse</h4>
              <div className="flex items-center gap-8">
                <a href="#" className="text-zinc-500 hover:text-accent transition-all">
                  <Facebook className="w-5 h-5 stroke-[1.5]" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-accent transition-all">
                  <Instagram className="w-5 h-5 stroke-[1.5]" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-white group flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-accent">Youtube</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">support@elvaedit.com</p>
                <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-600 font-bold">+92 300 123 4567</p>
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
    </footer>
  );
}

