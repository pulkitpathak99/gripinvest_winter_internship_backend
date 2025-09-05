// frontend/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to Grip Invest</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Sign Up
        </Link>
      </div>
    </main>
  );
}