// frontend/components/dashboard/PortfolioValueCard.tsx
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface PortfolioValueCardProps {
    totalValue: number;
    valueChange: number;
}

export default function PortfolioValueCard({ totalValue, valueChange }: PortfolioValueCardProps) {
    return (
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 shadow-md">
            <p className="text-sm text-gray-400">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white mt-2">
                {formatCurrency(totalValue)}
            </p>
            <div className="flex items-center mt-2 text-green-400">
                <ArrowUpRight size={18} className="mr-1" />
                <span>{valueChange}% today</span>
            </div>
        </div>
    );
}