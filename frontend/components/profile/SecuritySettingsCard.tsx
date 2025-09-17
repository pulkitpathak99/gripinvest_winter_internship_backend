// frontend/components/profile/SecuritySettingsCard.tsx
"use client";
import { useState } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySettingsCard() {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangePassword = () => {
    // In a real app, this would open a modal with fields for old and new passwords.
    toast.info("Password change functionality would be here!");
  };

  const handle2faToggle = () => {
    // In a real app, this would trigger a flow to scan a QR code.
    const newState = !is2faEnabled;
    setIs2faEnabled(newState);
    toast.success(
      `Two-Factor Authentication ${newState ? "Enabled" : "Disabled"}.`,
    );
  };

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Security Settings
      </h3>
      <div className="space-y-5">
        {/* Change Password */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Password</p>
            <p className="text-xs text-gray-400">
              Set a permanent password to access your account.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-sm text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Lock size={14} />
            Change
          </button>
        </div>
        {isModalOpen && (
          <ChangePasswordModal onClose={() => setIsModalOpen(false)} />
        )}

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-5">
          <div>
            <p className="font-medium text-white">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400">
              Add an extra layer of security to your account.
            </p>
          </div>
          <button
            onClick={handle2faToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              is2faEnabled ? "bg-blue-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                is2faEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
