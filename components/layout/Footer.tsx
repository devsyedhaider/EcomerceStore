'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useState, useEffect } from 'react';

const footerLinks = [
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

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
                EDITEVAL
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

          {/* Links Sections - Simplified to only Collections & Legal Info */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-12">
             {/* Shop Section */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Collections</h4>
              <ul className="flex flex-col gap-4">
                {shoppingLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[11px] uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-premium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Policies</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks[0].links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[11px] uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-premium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="lg:col-span-1 flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Follow Us</h4>
              <div className="flex items-center gap-6">
                <a href="#" className="text-zinc-500 hover:text-accent transition-premium">
                  <Facebook className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-accent transition-premium">
                  <Instagram className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-accent font-bold">
                  X
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4 opacity-50">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">help@editeval.com</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">+92 42 111 287 287</p>
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
            © 2026 EDITEVAL. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

