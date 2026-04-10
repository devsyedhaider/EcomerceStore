import { Metadata } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://elva-edit.vercel.app';

export const siteConfig = {
  name: 'The Elva Edit',
  description: 'Step into the world of Quiet Luxury. Handcrafted jewelry, premium watches, and exquisite accessories curated for the modern lifestyle in Pakistan.',
  url: DOMAIN,
  ogImage: `${DOMAIN}/og-image.jpg`,
  keywords: [
    'Buy jewelry online in Pakistan',
    'Best watches in Pakistan',
    'Luxury jewelry store Pakistan',
    'Handcrafted accessories Pakistan',
    'Quiet luxury fashion Pakistan',
    'Premium watches online',
    'Elva Edit Jewelry',
  ],
  links: {
    instagram: 'https://instagram.com/elvaedit',
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonical?: string;
} = {}): Metadata {
  return {
    title: {
        default: title,
        template: `%s | ${siteConfig.name}`
    },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: 'The Elva Edit' }],
    creator: 'The Elva Edit',
    openGraph: {
      type: 'website',
      locale: 'en_PK',
      url: canonical || DOMAIN,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@elvaedit',
    },
    icons,
    metadataBase: new URL(DOMAIN),
    ...(canonical && { alternates: { canonical } }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
