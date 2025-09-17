// frontend/components/portfolio/KpiCard.tsx
import { Icon as LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: typeof LucideIcon;
  change?: string;
  changeColor?: string;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  change,
  changeColor,
}: KpiCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div className="bg-slate-900 p-3 rounded-lg">
          <Icon className="text-blue-400" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      {change && (
        <p className={`text-sm mt-2 font-medium ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
