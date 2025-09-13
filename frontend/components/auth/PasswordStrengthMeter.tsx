// frontend/components/auth/PasswordStrengthMeter.tsx
"use client";
import { useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const score = getStrength();

  const getAiFeedback = () => {
    if (!password) return { text: "Create a strong password.", color: "text-gray-400" };
    if (score < 2) return { text: "Weak. Try adding more character types.", color: "text-red-400" };
    if (score < 4) return { text: "Good. Add a special character for extra strength.", color: "text-yellow-400" };
    return { text: "Excellent! This is a strong password.", color: "text-green-400" };
  };

  const feedback = getAiFeedback();
  const strengthLevels = ['w-1/4', 'w-1/2', 'w-3/4', 'w-full'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div>
      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[score - 1] || ''} ${strengthLevels[score - 1] || 'w-0'}`}
        />
      </div>
      <p className={`text-xs font-medium ${feedback.color}`}>{feedback.text}</p>
    </div>
  );
};

export default PasswordStrengthMeter;