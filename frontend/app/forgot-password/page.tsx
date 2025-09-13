// frontend/app/forgot-password/page.tsx
"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      toast.info("If an account exists, a reset link will be sent to your email.");
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="p-8 bg-slate-800 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input type="email" placeholder="Your Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 bg-slate-700 rounded mb-4" required />
        <button type="submit" className="w-full p-2 bg-blue-600 rounded">Send Reset Link</button>
      </form>
    </div>
  );
}