import React from 'react';

interface JsonLdProps {
  data: any;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const OrganizationJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Elva Edit",
    "url": "https://elva-edit.vercel.app",
    "logo": "https://elva-edit.vercel.app/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-XXX-XXXXXXX",
      "contactType": "customer service",
      "areaServed": "PK",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.instagram.com/theelvaedit?igsh=MWxxanZzdWF4NmZ0eA%3D%3D&utm_source=qr"
    ]
  };

  return <JsonLd data={data} />;
};

export const ProductJsonLd = ({ product }: { product: any }) => {
  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "The Elva Edit"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://elva-edit.vercel.app/products/${product.id}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return <JsonLd data={data} />;
};
