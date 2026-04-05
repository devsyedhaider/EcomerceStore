'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  PlusCircle, 
  Search, 
  Bell,
  ChevronRight,
  Layers,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminSearchStore } from '@/store/useAdminSearchStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initialized } = useAuthStore();
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialized) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    }
  }, [initialized, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isReady) return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Header Content', href: '/admin/header', icon: Edit3 },
    { name: 'Promo Banner', href: '/admin/promo', icon: Package },
  ];

  const getPlaceholder = () => {
    if (pathname.includes('/products')) return 'Search products...';
    if (pathname.includes('/categories')) return 'Search categories...';
    if (pathname.includes('/orders')) return 'Search orders...';
    if (pathname.includes('/users')) return 'Search customers...';
    if (pathname.includes('/header')) return 'Customize header...';
    if (pathname.includes('/promo')) return 'Customize promo banner...';
    return 'Search dashboard...';
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/admin" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-accent text-white px-2 py-0.5 rounded">AURIC</span>
            <span>ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                pathname === item.href 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-zinc-400 group-hover:text-black")} />
              {item.name}
              {pathname === item.href && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <p className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">System</p>

           <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2"
           >
              <LogOut className="w-5 h-5" />
              Logout from Admin
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-72">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder={getPlaceholder()}
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm outline-none focus:ring-1 focus:ring-black" 
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Cloud Sync Active</span>
              </div>
              <button className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 border-l pl-6 border-zinc-200">
                  <div className="text-right hidden md:block">
                      <p className="text-xs font-black uppercase tracking-tight">Admin User</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Store Manager</p>
                  </div>
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs">
                      AD
                  </div>
              </div>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
