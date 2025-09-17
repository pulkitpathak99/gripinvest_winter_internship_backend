// frontend/app/reset-password/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      toast.success("Password reset successfully! Please log in.");
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-slate-800 rounded-lg w-96">
      <h2 className="text-xl text-white font-bold mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 bg-slate-700 text-white rounded mb-4"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
