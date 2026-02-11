'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signup = useAuthStore((state) => state.signup);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
        signup({ name: formData.name, email: formData.email, phone: formData.phone });
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
            
            <div className="relative z-10">
                <Link href="/" className="text-3xl font-black tracking-tighter">AURA FEET</Link>
                <div className="mt-20">
                    <h2 className="text-6xl font-black tracking-tighter leading-none mb-6 italic">JOIN THE <br />CLUB.</h2>
                    <p className="text-zinc-400 font-medium max-w-xs text-lg">Create your account to unlock exclusive offers, early access, and more.</p>
                </div>
            </div>

            <div className="relative z-10 pt-12 space-y-6">
                {[
                    { label: 'EXCLUSIVE DROPS', desc: 'Get early access to limited editions' },
                    { label: 'FREE SHIPPING', desc: 'On all orders over Rs. 5000' },
                    { label: 'POINTS SYSTEM', desc: 'Earn points on every purchase' }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div>
                            <p className="text-[10px] font-black tracking-[0.2em]">{item.label}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 md:p-16">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SIGN UP</h1>
                <p className="text-zinc-500 font-bold mb-8 text-xs uppercase tracking-widest">Start your journey with Aura Feet today.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                                required 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-12 pr-4 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                placeholder="Enter your full name" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input 
                                    required 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                    placeholder="name@email.com" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input 
                                    required 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                    placeholder="03XXXXXXXXX" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                                required 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 h-14 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all" 
                                placeholder="Create a strong password" 
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

                    <div className="flex items-start gap-3 px-1 pt-2">
                        <input required type="checkbox" className="w-5 h-5 accent-black rounded mt-0.5" id="terms" />
                        <label htmlFor="terms" className="text-[10px] font-bold text-zinc-500 leading-normal uppercase tracking-wider">
                            I agree to the <span className="text-black underline cursor-pointer">Terms of Service</span> and <span className="text-black underline cursor-pointer">Privacy Policy</span>.
                        </label>
                    </div>

                    <button 
                        disabled={isLoading}
                        type="submit" 
                        className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>CREATE ACCOUNT <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Already have an account?</p>
                    <Link href="/login" className="text-sm font-black text-accent hover:underline uppercase tracking-widest mt-2 block">Log in here</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
