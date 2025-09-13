// frontend/app/auth/page.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import Link from 'next/link';

// Import the new password strength component we will create next
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  // State for all form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? '/auth/login' : '/auth/signup';
    const payload = isLoginMode 
      ? { email, password }
      : { email, password, firstName, lastName };

    try {
      const response = await api.post(endpoint, payload);
      toast.success(isLoginMode ? "Login Successful!" : "Signup Successful!");
      login(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Panel: Branding & Visual */}
        <div className="p-12 bg-slate-950/50 hidden md:flex flex-col justify-center items-center text-center">
            {/* You can replace this with a cool SVG graphic */}
            <div className="w-48 h-48 mb-8 border-4 border-blue-500/50 rounded-full flex items-center justify-center animate-pulse">
                <LogIn size={64} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Welcome to Grip Invest</h1>
            <p className="text-gray-400">Your journey to intelligent investing starts here. Secure, transparent, and powerful.</p>
        </div>

        {/* Right Panel: Form */}
        <div className="p-8 md:p-12 bg-slate-900">
          <div className="flex mb-6 border-b border-slate-800">
            <button onClick={() => setIsLoginMode(true)} className={clsx("w-1/2 py-3 font-semibold text-center transition-colors", isLoginMode ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-white")}>
              Sign In
            </button>
            <button onClick={() => setIsLoginMode(false)} className={clsx("w-1/2 py-3 font-semibold text-center transition-colors", !isLoginMode ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-white")}>
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">{isLoginMode ? "Sign in to your account" : "Create a new account"}</h2>
          
          <motion.form 
  layout // This makes the form smoothly animate its size changes
  onSubmit={handleSubmit} 
  className="space-y-5"
>
  <AnimatePresence>
    {!isLoginMode && (
      <motion.div
        key="nameFields"
        initial={{ opacity: 0, height: 0, y: -20 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-4 overflow-hidden"
      >
        <div>
          <label className="text-sm font-medium text-gray-400">First Name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400">Last Name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  
  <div>
    <label className="text-sm font-medium text-gray-400">Email Address</label>
    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
  <div>
    <label className="text-sm font-medium text-gray-400">Password</label>
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
  
  {!isLoginMode && <PasswordStrengthMeter password={password} />}
  
  <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 transition-colors">
    {isLoginMode ? <LogIn size={20} /> : <UserPlus size={20} />}
    {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
  </button>
  {isLoginMode && <Link href="/forgot-password" className="block text-center text-sm text-blue-400 hover:underline mt-4">Forgot Password?</Link>}
  </motion.form>
        </div>
      </div>
    </div>
  );
}