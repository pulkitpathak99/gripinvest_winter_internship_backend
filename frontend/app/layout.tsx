// frontend/app/layout.tsx
import type { Metadata } from 'next';
// CHANGED: Import 'localFont' instead of 'Inter'
import localFont from 'next/font/local';
import { AuthProvider } from '@/context/AuthContext';
import ToastProvider from '@/components/ToastProvider';
import './globals.css';

// CHANGED: Initialize the font from the local file
const inter = localFont({
  src: './fonts/Inter-VariableFont_opsz,wght.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Grip Invest Platform',
  description: 'Mini Investment Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}