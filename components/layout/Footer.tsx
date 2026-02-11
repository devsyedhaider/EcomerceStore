'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

import { useCategoryStore } from '@/store/useCategoryStore';
import { useState, useEffect } from 'react';

const footerLinks = [
  {
    title: 'Customer Service',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Policy', href: '/shipping' },
      { name: 'Return & Exchange', href: '/returns' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Store Locator', href: '/stores' },
    ],
  },
  {
    title: 'About Aura Feet',
    links: [
      { name: 'Our Story', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
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
    name: `${cat.name} Shoes`,
    href: `/products?category=${cat.id}`
  })) : [];
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Newsletter */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-3xl font-black tracking-tighter">
              AURA FEET
            </Link>
            <p className="text-zinc-400 max-w-xs">
              Experience ultimate comfort and style with Pakistan's premium footwear brand. Quality that speaks for itself.
            </p>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-300">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-zinc-800 border-none rounded px-4 py-2 w-full focus:ring-1 focus:ring-accent outline-none"
                />
                <button className="bg-accent hover:bg-red-700 transition-colors px-4 py-2 rounded font-bold text-sm">
                  JOIN
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-300">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Dynamic Shopping Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-300">Shopping</h4>
            <ul className="flex flex-col gap-3">
              {shoppingLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-zinc-800 mb-8 items-center">
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-col gap-1 items-start md:items-center">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Phone className="w-4 h-4" /> +92 300 1234567
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="w-4 h-4" /> help@aurafeet.pk
            </div>
          </div>

          <div className="flex justify-start md:justify-end items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 contrast-0 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 contrast-0 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 contrast-0 invert" />
          </div>
        </div>

        <div className="text-center text-zinc-500 text-xs">
          <p>© 2026 Aura Feet Pakistan. Designed with excellence.</p>
        </div>
      </div>
    </footer>
  );
}
