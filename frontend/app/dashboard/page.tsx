// frontend/app/(dashboard)/page.tsx
"use client";

import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <p>This is your protected dashboard.</p>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
        Logout
      </button>
    </div>
  );
}