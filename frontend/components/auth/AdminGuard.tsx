// frontend/components/auth/AdminGuard.tsx
"use client";
import { toast } from "react-toastify";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      // If user is loaded and is not an admin, redirect them
      toast.error("Access Denied: Admin privileges required.");
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // While loading or if user is an admin, show the content
  if (isLoading || !user) {
    return <div className="text-center">Verifying access...</div>;
  }
  
  if (user.role === 'ADMIN') {
      return <>{children}</>;
  }

  // Fallback in case redirection fails
  return null;
}