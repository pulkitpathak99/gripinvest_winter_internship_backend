// frontend/components/profile/ChangePasswordModal.tsx
"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await api.put('/profile/change-password', { oldPassword, newPassword });
      toast.success("Password changed successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-2 bg-slate-700 rounded" required />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 bg-slate-700 rounded" required />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 bg-slate-700 rounded" required />
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}