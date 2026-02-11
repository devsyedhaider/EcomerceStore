'use client';

/* eslint-disable @next/next/no-img-element */
import { useProductStore } from '@/store/useProductStore';
import { formatPrice, cn } from '@/lib/utils';
import { Package, Search, Plus, Trash2, Edit, MoreHorizontal, Layers, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminSearchStore } from '@/store/useAdminSearchStore';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setAdminSearchTerm(''); // Clear search when leaving page
  }, [setAdminSearchTerm]);

  if (!mounted) return null;

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Products Inventory</h1>
           <p className="text-zinc-500 font-medium">Manage your product catalog and stock.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary h-12 flex items-center gap-2">
            <Plus className="w-5 h-5" /> ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Products:</span>
                <span className="text-sm font-black bg-black text-white px-3 py-1 rounded-full">{filteredProducts.length}</span>
            </div>
        </div>

        {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <th className="px-8 py-6">Product</th>
                        <th className="px-8 py-6">Category</th>
                        <th className="px-8 py-6">Price</th>
                        <th className="px-8 py-6">Stock</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200">
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-tight">{product.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: {product.id.slice(0, 8)}</p>
                                        {product.isNew && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                                                New Arrival
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600 uppercase tracking-wide">
                                    <Layers className="w-3 h-3" />
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black">{formatPrice(product.price)}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500")} />
                                    <span className="text-sm font-medium text-zinc-600">{product.stock} in stock</span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link 
                                        href={`/admin/products/${product.id}`}
                                        className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black transition-all"
                                        title="Edit Product"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center text-zinc-400">
                <Archive className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-black uppercase tracking-tight text-zinc-300">No products found</p>
                <Link href="/admin/products/new" className="mt-6 btn-primary">Add Your First Product</Link>
            </div>
        )}
      </div>
    </div>
  );
}
