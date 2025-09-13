// frontend/components/transactions/AiSummaryCard.tsx

import { AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface AiSummary {
  text: string;
  status: 'success' | 'warning';
}

interface AiSummaryCardProps {
  summary: AiSummary;
}

const cardStyles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
    textColor: 'text-green-300/80',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-300/80',
  },
};

export default function AiSummaryCard({ summary }: AiSummaryCardProps) {
  // CORRECTED: Add a fallback to the 'warning' style for any unknown status
  const styles = cardStyles[summary.status] || cardStyles.warning;
  const Icon = summary.status === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className={clsx('rounded-xl p-6 flex gap-4', styles.bg, styles.border)}>
      <Icon className={clsx('mt-1 flex-shrink-0', styles.iconColor)} size={24} />
      <div>
        <h3 className="text-lg font-semibold text-white">AI Error Summary (Last 24h)</h3>
        <p className={clsx('mt-1 leading-relaxed', styles.textColor)}>
          {summary.text}
        </p>
      </div>
    </div>
  );
}