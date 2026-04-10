import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://elva-edit.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
