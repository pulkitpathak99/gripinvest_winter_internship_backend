// frontend/components/transactions/AiSummaryCard.tsx
import { AlertTriangle } from 'lucide-react';

interface AiSummaryCardProps {
  summary: string;
}

export default function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex gap-4">
      <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={24} />
      <div>
        <h3 className="text-lg font-semibold text-white">AI Error Summary (Last 24h)</h3>
        <p className="text-yellow-300/80 mt-1 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}