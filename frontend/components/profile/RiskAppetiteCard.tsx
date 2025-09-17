// frontend/components/profile/RiskAppetiteCard.tsx
import { useState } from "react";
import clsx from "clsx";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

const riskOptions = [
  {
    id: "low",
    label: "Low",
    description:
      "Prioritize capital preservation with lower, more stable returns.",
    icon: ShieldCheck,
  },
  {
    id: "moderate",
    label: "Moderate",
    description:
      "A balanced approach seeking steady growth with manageable risk.",
    icon: ShieldQuestion,
  },
  {
    id: "high",
    label: "High",
    description: "Aim for maximum growth, accepting higher volatility.",
    icon: ShieldAlert,
  },
];

export default function RiskAppetiteCard({ currentRisk, onUpdate }: any) {
  const [selectedRisk, setSelectedRisk] = useState(currentRisk);
  const hasChanged = selectedRisk !== currentRisk;

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">
        Investment Profile
      </h3>
      <div className="space-y-4 flex-grow">
        {riskOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedRisk(option.id)}
            className={clsx(
              "w-full text-left p-4 rounded-lg border-2 transition-all",
              selectedRisk === option.id
                ? "bg-blue-500/10 border-blue-500"
                : "bg-slate-800 border-slate-700 hover:border-slate-600",
            )}
          >
            <div className="flex items-center gap-3">
              <option.icon
                size={20}
                className={clsx(
                  selectedRisk === option.id
                    ? "text-blue-400"
                    : "text-gray-400",
                )}
              />
              <p className="font-semibold text-white">{option.label}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 pl-8">
              {option.description}
            </p>
          </button>
        ))}
      </div>
      <button
        onClick={() => onUpdate({ riskAppetite: selectedRisk })}
        disabled={!hasChanged}
        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Save Preferences
      </button>
    </div>
  );
}
