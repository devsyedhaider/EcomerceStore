'use client';

/* eslint-disable @next/next/no-img-element */
import { useCategoryStore } from '@/store/useCategoryStore';
import { useProductStore } from '@/store/useProductStore';
import { Plus, Search, Edit, Trash2, ExternalLink, Layers } from 'lucide-react';
import Link from 'next/link';
import { useAdminSearchStore } from '@/store/useAdminSearchStore';
import { useEffect } from 'react';

export default function AdminCategoriesPage() {
  const { categories, deleteCategory } = useCategoryStore();
  const { products } = useProductStore();
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();

  useEffect(() => {
    return () => setAdminSearchTerm('');
  }, [setAdminSearchTerm]);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Manage Categories</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Create and organize your product collections.</p>
        </div>
        <Link 
          href="/admin/categories/new" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> CREATE CATEGORY
        </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-50/50">
          <div className="flex items-center gap-4">
               <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{filteredCategories.length} Total Categories</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Products</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-tight text-zinc-900">{category.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID: {category.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-zinc-500 max-w-xs truncate">{category.description || 'No description provided.'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      {getProductCount(category.id)} Products
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                        href={`/products?category=${category.id}`}
                        target="_blank"
                        className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black transition-all"
                        title="View in Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/categories/${category.id}`}
                        className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-all"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this category? Products in this category will not be deleted but may become orphan.')) {
                            deleteCategory(category.id);
                          }
                        }}
                        className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:border-red-600 transition-all"
                        title="Delete Category"
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
      </div>
    </div>
  );
}
