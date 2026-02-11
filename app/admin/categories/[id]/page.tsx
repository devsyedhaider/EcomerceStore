'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, X, Upload, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCategoryStore } from '@/store/useCategoryStore';

import { compressImage } from '@/lib/image-utils';

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { categories, updateCategory } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const category = categories.find(c => c.id === id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (category) {
        setName(category.name);
        setDescription(category.description || '');
        setImage(category.image);
    }
  }, [category]);

  if (!mounted) return null;
  if (!category) return <div>Category not found</div>;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const compressed = await compressImage(base64);
          setImage(compressed);
        } catch (error) {
          console.error('Error compressing image:', error);
          setImage(base64); // Fallback to original if compression fails
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {
        name,
        description,
        image,
    };

    try {
        await updateCategory(category.id, updatedData);
        setIsLoading(false);
        router.push('/admin/categories');
    } catch (error) {
        console.error('Failed to update category:', error);
        alert('Failed to update category. Even with our new optimized storage, something went wrong. Please try refreshing or using a different image URL.');
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Edit Category</h1>
           <p className="text-zinc-500 font-medium tracking-tight">Update {category.name} collection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight">Category Details</h2>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category Name</label>
                    <input 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input-field h-14 bg-zinc-50 border-none px-6 w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="e.g. Summer Sale 2026" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                    <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="input-field min-h-[150px] bg-zinc-50 border-none p-6 resize-none w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                        placeholder="What is this collection about?" 
                    />
                </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tight">Cover Image</h2>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recommended: 1200x800px</span>
                </div>
                
                <div className="space-y-6">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "relative aspect-video rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden",
                            image && !image.startsWith('http') ? "border-solid border-zinc-200" : "border-zinc-200 hover:border-black bg-zinc-50 hover:bg-zinc-100"
                        )}
                    >
                        {image && !image.startsWith('http') ? (
                            <>
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-black uppercase tracking-widest text-sm">Change Image</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-zinc-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black uppercase tracking-widest">Click to upload</p>
                                    <p className="text-xs text-zinc-400 font-bold mt-1">PNG, JPG or WebP (Max 2MB)</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black">
                            <span className="bg-white px-4 text-zinc-400 tracking-[0.3em]">OR USE URL</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Direct Image Link</label>
                        <input 
                            value={image.startsWith('http') ? image : ''}
                            onChange={e => setImage(e.target.value)}
                            className="input-field h-14 bg-zinc-50 border-none px-6 w-full rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" 
                            placeholder="https://images.unsplash.com/photo-..." 
                        />
                        {image.startsWith('http') && (
                            <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-zinc-100">
                                <img src={image} alt="URL Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-zinc-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-3xl -mr-16 -mt-16" />
                <h2 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">Status</h2>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Active & Visible</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
                <button 
                  disabled={isLoading || !name}
                  type="submit" 
                  className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> UPDATE CATEGORY</>}
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
