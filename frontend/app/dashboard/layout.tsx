// frontend/app/dashboard/layout.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { 
    LayoutDashboard, Briefcase, BarChart3, 
    FileText, User, LogOut, Bell, Shield 
} from 'lucide-react';
import Chatbot from '@/components/chatbot/Chatbot'; // <-- ADD
import ChatbotTrigger from '@/components/chatbot/ChatbotTrigger'; // <-- ADD
import Link from 'next/link';
import Image from 'next/image';

import clsx from 'clsx'; // Using clsx for cleaner conditional classes

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // --- NEW: A map to get the title from the current URL path ---
    const pageTitles: { [key: string]: string } = {
        '/dashboard': 'Main Dashboard',
        '/dashboard/products': 'Investment Products',
        '/dashboard/portfolio': 'My Portfolio',
        '/dashboard/transactions': 'Transaction Logs',
        '/dashboard/profile': 'User Profile',
    };
    
    // Get the current title or default to 'Dashboard'
    const currentTitle = pageTitles[pathname] || 'Dashboard';
    const breadcrumb = currentTitle.replace('Main ', ''); // For "Pages / Dashboard"

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;
    }
    
    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/products', icon: Briefcase, label: 'Products' },
        { href: '/dashboard/portfolio', icon: BarChart3, label: 'Portfolio' },
        { href: '/dashboard/transactions', icon: FileText, label: 'Transactions' },
        { href: '/dashboard/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-gray-300">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 flex flex-col border-r border-slate-800">
                <div className="p-6 flex items-center gap-3">
                    {/* Make sure you have a logo.svg in your /public folder */}
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 7L12 12L22 7" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12V22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-bold text-white">Grip Invest</span>
                </div>
                
<nav className="flex-1 px-4 py-2 space-y-2">
    {/* First, render all the regular nav items */}
    {navItems.map((item) => (
        <Link 
            key={item.href} 
            href={item.href} 
            className={clsx('flex items-center gap-3 px-4 py-3 rounded-lg transition-colors', {
                'bg-blue-600 text-white': pathname === item.href,
                'hover:bg-slate-800': pathname !== item.href
            })}
        >
            <item.icon size={20} />
            <span>{item.label}</span>
        </Link>
    ))}

    {/* THEN, after the loop, render the admin section if the user is an admin */}
    {user?.role === 'ADMIN' && (
      <>
        <div className="pt-4 mt-4 border-t border-slate-800">
            <span className="px-4 text-xs font-semibold text-gray-500 uppercase">Admin</span>
        </div>
        <Link 
            href="/dashboard/admin/products"
            className={clsx('flex items-center gap-3 px-4 py-3 rounded-lg transition-colors', {
                'bg-blue-600 text-white': pathname.startsWith('/dashboard/admin'),
                'hover:bg-slate-800': !pathname.startsWith('/dashboard/admin')
            })}
        >
            <Shield size={20} />
            <span>Manage Products</span>
        </Link>
      </>
    )}
</nav>
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 text-red-400 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header - NOW DYNAMIC */}
                <header className="bg-slate-950/50 backdrop-blur-sm border-b border-slate-800 p-4 flex items-center justify-between">
                   <div>
                        {/* --- DYNAMIC TITLE --- */}
                        <h1 className="text-xl font-semibold text-white">{currentTitle}</h1>
                   </div>
                   <div className="flex items-center gap-4">
                        <ChatbotTrigger />
                        <Bell size={20} className="cursor-pointer hover:text-white" />
                        <Link href="/dashboard/profile">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
                                {user?.firstName?.charAt(0).toUpperCase()}
                            </div>
                        </Link>
                   </div>
                </header>
                
                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
            <Chatbot />
        </div>
    );
}