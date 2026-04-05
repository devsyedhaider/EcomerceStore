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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signup(formData.email, formData.password, { 
        full_name: formData.name,
        phone: formData.phone,
        role: 'customer' // Default role
      });

      if (error) {
        alert(error.message || 'Error creating account');
        setIsLoading(false);
        return;
      }

      alert('Account created successfully! You can now log in.');
      router.push('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      alert('An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="max-w-[450px] mx-auto text-center">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.2em] mb-16 text-zinc-900">
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name input */}
          <div className="text-left">
            <input 
              required 
              type="text" 
              value={formData.name.split(' ')[0] || ''}
              onChange={(e) => setFormData({ ...formData, name: `${e.target.value} ${formData.name.split(' ').slice(1).join(' ')}`.trim() })}
              className="w-full h-14 bg-white border border-zinc-300 px-6 outline-none focus:border-zinc-500 transition-colors text-zinc-600 placeholder:text-zinc-400 font-medium" 
              placeholder="First name" 
            />
          </div>

          {/* Last Name input */}
          <div className="text-left">
            <input 
              required 
              type="text" 
              value={formData.name.split(' ').slice(1).join(' ') || ''}
              onChange={(e) => setFormData({ ...formData, name: `${formData.name.split(' ')[0]} ${e.target.value}`.trim() })}
              className="w-full h-14 bg-white border border-zinc-300 px-6 outline-none focus:border-zinc-500 transition-colors text-zinc-600 placeholder:text-zinc-400 font-medium" 
              placeholder="Last name" 
            />
          </div>

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

          {/* Create button (Centered) */}
          <div className="pt-10 flex flex-col items-center gap-6">
            <button 
                disabled={isLoading}
                type="submit" 
                className="w-40 h-14 bg-[#e194b8] text-white font-medium uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
            >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Create'}
            </button>

            <Link 
                href="/login" 
                className="text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-500 underline underline-offset-4 hover:text-zinc-800 transition-colors"
            >
                Already have an account? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

