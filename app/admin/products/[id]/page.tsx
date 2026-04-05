'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, X, Upload, Check, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';

import { compressImage } from '@/lib/image-utils';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Find the product
  const product = products.find(p => p.id === id);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'men');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [isTopInCategory, setIsTopInCategory] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];
  const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Green', hex: '#008000' },
    { name: 'Sand', hex: '#C2B280' },
  ];

  useEffect(() => {
    setMounted(true);
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategory(product.category);
      setSelectedSizes(product.sizes);
      setImages(product.images);
      setSelectedColors(product.colors || []);
      setIsTopInCategory(product.isTopInCategory || false);
      setIsFeatured(product.isFeatured || false);
      setIsNew(product.isNew || false);
    }
  }, [product]);

  if (!mounted) return null;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ArrowLeft className="w-16 h-16 text-zinc-200 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Product Not Found</h2>
        <Link href="/admin/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const compressed = await compressImage(base64, 1000, 1000, 0.7);
          setImages(prev => [...prev, compressed]);
        } catch (error) {
          console.error('Error compressing image:', error);
          setImages(prev => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
        setSelectedSizes(prev => prev.filter(s => s !== size));
    } else {
        setSelectedSizes(prev => prev.concat(size));
    }
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    if (selectedColors.some(c => c.hex === color.hex)) {
        setSelectedColors(prev => prev.filter(c => c.hex !== color.hex));
    } else {
        setSelectedColors(prev => [...prev, color]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {
        name,
        description,
        price: Number(price),
        category: category.toLowerCase(),
        images,
        sizes: selectedSizes,
        colors: selectedColors,
        stock: Number(stock),
        isTopInCategory: isTopInCategory,
        isFeatured: isFeatured,
        isNew: isNew,
    };

    try {
        await updateProduct(product.id, updatedData);
        setIsLoading(false);
        router.push('/admin/products');
    } catch (error) {
        console.error('Failed to update product:', error);
        alert('Failed to update product. Even with our new optimized storage, something went wrong. Please try using fewer images or direct URLs.');
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Edit Product</h1>
           <p className="text-zinc-500 font-medium tracking-tight">Modify {product.name} details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight">General Information</h2>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Name</label>
                    <input 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input-field h-14 bg-zinc-50 border-none px-6 w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="e.g. Aura Air Max 2026" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                    <textarea 
                        required 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="input-field min-h-[150px] bg-zinc-50 border-none p-6 resize-none w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="Describe the product features, material, and comfort..." 
                    />
                </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Product Images</h2>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Use URLs to save space</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-400">{images.length} images added</span>
                </div>
                
                <div className="space-y-6">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 hover:border-black cursor-pointer transition-all bg-zinc-50 hover:bg-zinc-100"
                        >
                            <Upload className="w-6 h-6 text-zinc-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center px-2">Upload Files</span>
                        </div>
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square rounded-2xl border border-zinc-200 relative group overflow-hidden bg-white">
                                <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black">
                            <span className="bg-white px-4 text-zinc-400 tracking-[0.3em]">OR ADD BY URL</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input 
                            placeholder="Enter image URL (e.g. from Unsplash)"
                            className="flex-grow h-14 bg-zinc-50 border-none px-6 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.target as HTMLInputElement).value;
                                    if (val) {
                                        setImages(prev => [...prev, val]);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }
                            }}
                        />
                        <button 
                            type="button"
                            onClick={(e) => {
                                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                if (input.value) {
                                    setImages(prev => [...prev, input.value]);
                                    input.value = '';
                                }
                            }}
                            className="bg-black text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all"
                        >
                            ADD
                        </button>
                    </div>
                </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Pricing & Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price (PKR)</label>
                        <input 
                            required 
                            type="number" 
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="input-field h-14 bg-zinc-50 border-none px-6 w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                            placeholder="0.00" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Stock Quantity</label>
                        <input 
                            required 
                            type="number" 
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            className="input-field h-14 bg-zinc-50 border-none px-6 w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                            placeholder="0" 
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
            <div className="bg-zinc-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-16 -mt-16" />
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10">Organization</h2>
                <div className="space-y-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label>
                        <select 
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer text-white"
                        >
                            {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Available Colors</label>
                        <div className="flex flex-wrap gap-3">
                            {availableColors.map(color => (
                                <button 
                                    key={color.hex} 
                                    type="button" 
                                    onClick={() => toggleColor(color)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                                        selectedColors.some(c => c.hex === color.hex) 
                                            ? "border-accent scale-110 shadow-lg shadow-accent/20" 
                                            : "border-white/10 hover:border-white/30"
                                    )}
                                    title={color.name}
                                >
                                    <div 
                                        className="w-5 h-5 rounded-full" 
                                        style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }} 
                                    />
                                    {selectedColors.some(c => c.hex === color.hex) && (
                                        <div className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-0.5">
                                            <Check className="w-2 h-2" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map(s => (
                                <button 
                                    key={s} 
                                    type="button" 
                                    onClick={() => toggleSize(s)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg text-xs font-black transition-colors border",
                                        selectedSizes.includes(s) 
                                            ? "bg-accent text-zinc-900 border-accent" 
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-6">
                        <label onClick={() => setIsNew(!isNew)} className="flex items-center gap-3 cursor-pointer group">
                            <div className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                isNew ? "bg-accent border-accent" : "border-white/10 group-hover:border-white/30"
                            )}>
                                {isNew && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">New Arrival</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Tag as latest collection item</p>
                            </div>
                        </label>

                        <label onClick={() => setIsFeatured(!isFeatured)} className="flex items-center gap-3 cursor-pointer group">
                            <div className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                isFeatured ? "bg-accent border-accent" : "border-white/10 group-hover:border-white/30"
                            )}>
                                {isFeatured && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">Trending Now</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Show in global Trending section</p>
                            </div>
                        </label>


                        <label onClick={() => setIsTopInCategory(!isTopInCategory)} className="flex items-center gap-3 cursor-pointer group">
                            <div className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                isTopInCategory ? "bg-accent border-accent" : "border-white/10 group-hover:border-white/30"
                            )}>
                                {isTopInCategory && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">Top in Category</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Feature this product in category page</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> UPDATE PRODUCT</>}
                </button>
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="w-full h-16 border-2 border-zinc-100 rounded-2xl font-black text-sm hover:bg-zinc-50 transition-all text-zinc-400"
                >
                    CANCEL
                </button>
            </div>
        </div>
      </form>
    </div>
  );
}
