// frontend/components/dashboard/AiInsightsCard.tsx
import { Sparkles } from "lucide-react";

interface AiInsightsCardProps {
  insight: string;
}

export default function AiInsightsCard({ insight }: AiInsightsCardProps) {
  return (
    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-yellow-400" size={20} />
        <h3 className="font-semibold text-white">
          AI-Powered Portfolio Insights
        </h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{insight}</p>
    </div>
  );
}
