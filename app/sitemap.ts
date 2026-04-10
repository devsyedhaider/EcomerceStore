import { MetadataRoute } from 'next';
import { useOrderStore } from '@/store/useOrderStore'; // Wait, this is client side. 
// Actually sitemap.ts is server side usually, but in Next.js App router it can be dynamic.

// I need to fetch categories and products for a real sitemap.
// Since I can't easily access the Zustand store from the server without explicit API, 
// I'll create a static + semi-dynamic sitemap for now.

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://elva-edit.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/products',
    '/categories',
    '/new-arrival',
    '/trending',
    '/about',
    '/contact',
    '/cart',
    '/checkout',
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
