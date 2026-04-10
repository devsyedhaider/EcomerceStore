import { Metadata } from 'next';
import ProductClient from './ProductClient';
import { supabase } from '@/lib/supabase';
import { constructMetadata } from '@/lib/metadata';
import { ProductJsonLd } from '@/components/SEO';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!supabase) return constructMetadata({ title: 'Product' });

  const { data: product } = await supabase
    .from('products')
    .select('name, description, price, image')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return constructMetadata({
      title: 'Product Not Found',
      noIndex: true,
    });
  }

  // Handle image being an array or single string
  const imageUrl = Array.isArray(product.image) ? product.image[0] : product.image;

  return constructMetadata({
    title: product.name,
    description: `${product.description?.slice(0, 150)}... Buy ${product.name} online in Pakistan at The Elva Edit.`,
    image: imageUrl,
    canonical: `https://elva-edit.vercel.app/products/${params.slug}`,
  });
}

export default async function Page({ params }: Props) {
  if (!supabase) return <ProductClient />;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!product) return <ProductClient />;

  // Map DB fields to UI expected fields
  const uiProduct = {
    ...product,
    images: Array.isArray(product.image) ? product.image : [product.image],
    isNew: product.is_new,
    isFeatured: product.is_featured,
    isTopInCategory: product.is_top_in_category,
    warrantyPolicy: product.warranty_policy,
    shippingReturns: product.shipping_returns,
    careInstructions: product.care_instructions,
  };

  return (
    <>
      <ProductJsonLd product={uiProduct} />
      <ProductClient />
    </>
  );
}
