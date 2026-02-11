'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Admin Credentials Check
    if (formData.email.trim() === 'admin1234' && formData.password === 'haider04') {
        setTimeout(() => {
            // Set admin cookie for middleware
            document.cookie = "auth_logged_in=true; path=/; max-age=86400"; // 1 day
            document.cookie = "admin_mode=true; path=/; max-age=86400"; 
            
            login({ 
                name: 'Admin User', 
                email: 'admin1234', 
                role: 'admin' 
            });
            router.push('/admin');
            setIsLoading(false);
        }, 1500);
        return;
    }

    // Regular User Login (Simulation)
    setTimeout(() => {
        document.cookie = "auth_logged_in=true; path=/; max-age=86400";
        login({ name: 'Aura User', email: formData.email, role: 'customer' });
        router.push('/dashboard');
        setIsLoading(false);
    }, 1500);
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-20">
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100">
        {/* Left Side - Image/Decoration */}
        <div className="w-full md:w-1/2 bg-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-10 blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10">
                <Link href="/" className="text-3xl font-black tracking-tighter">AURA FEET</Link>
                <div className="mt-20">
                    <h2 className="text-6xl font-black tracking-tighter leading-none mb-6 italic">WELCOME <br />BACK.</h2>
                    <p className="text-zinc-400 font-medium max-w-xs text-lg">Log in to your account to access your orders and saved favorites.</p>
                </div>
            </div>

            <div className="relative z-10 pt-12">
                <div className="flex -space-x-4 mb-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-black">U{i}</div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-black bg-accent flex items-center justify-center text-[10px] font-black">+10k</div>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Join 10,000+ happy customers</p>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 md:p-20">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">LOGIN</h1>
                <p className="text-zinc-500 font-bold mb-10 text-xs uppercase tracking-widest">Welcome back! Please enter your details.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email or Username</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                                required 
                                type="text" 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                placeholder="name@example.com or username" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</label>
                            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Forgot?</button>
                         </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                                required 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                placeholder="••••••••" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <input type="checkbox" className="w-5 h-5 accent-black rounded" id="remember" />
                        <label htmlFor="remember" className="text-xs font-bold text-zinc-500 cursor-pointer">Remember me for 30 days</label>
                    </div>

                    <button 
                        disabled={isLoading}
                        type="submit" 
                        className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>LOG IN <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Don&apos;t have an account?</p>
                    <Link href="/signup" className="text-sm font-black text-accent hover:underline uppercase tracking-widest mt-2 block">Create an account for free</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
