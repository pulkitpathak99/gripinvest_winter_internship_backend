// frontend/app/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}