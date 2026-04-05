'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: loginError } = await login(formData.email, formData.password);
      
      if (loginError) {
        setError(loginError.message || 'Invalid login credentials');
        setIsLoading(false);
        return;
      }

      // Successful login - The store will update and we can redirect
      // We wait a tiny bit for the state to propagate
      setTimeout(() => {
        const user = useAuthStore.getState().user;
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      alert('An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="max-w-[450px] mx-auto text-center">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em] mb-16 text-zinc-900">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div className="text-left">
            <input 
              required 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-14 bg-white border border-zinc-300 px-6 outline-none focus:border-zinc-500 transition-colors text-zinc-600 placeholder:text-zinc-400 font-medium" 
              placeholder="Email" 
            />
          </div>

          {/* Password input */}
          <div className="text-left">
            <input 
              required 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-14 bg-white border border-zinc-300 px-6 outline-none focus:border-zinc-500 transition-colors text-zinc-600 placeholder:text-zinc-400 font-medium" 
              placeholder="Password" 
            />
          </div>

 

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-[#e11d48] text-[11px] font-bold uppercase tracking-widest py-3 px-4 border border-red-100"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign in button (Centered) */}
          <div className="pt-[-12px] flex flex-col items-center gap-4">
            <button 
                disabled={isLoading}
                type="submit" 
                className="w-40 h-14 bg-[#e194b8] text-white font-medium uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
            >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Sign in'}
            </button>

            <Link 
                href="/signup" 
                className="text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-500 underline underline-offset-4 hover:text-zinc-800 transition-colors"
            >
                Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

