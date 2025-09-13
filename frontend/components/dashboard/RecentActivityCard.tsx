// frontend/components/dashboard/RecentActivityCard.tsx
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface Activity {
    id: string;
    product: string;
    type: string;
    status: 'active' | 'pending' | 'matured';
    amount: number;
}

interface RecentActivityCardProps {
    activities: Activity[];
}

const statusStyles = {
    active: { icon: CheckCircle2, color: 'text-green-400', label: 'Active' },
    pending: { icon: AlertCircle, color: 'text-yellow-400', label: 'Pending' },
    matured: { icon: CheckCircle2, color: 'text-blue-400', label: 'Matured' },
};

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
    return (
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700">
                        <tr>
                            <th className="p-3 text-sm font-medium text-gray-400">Product</th>
                            <th className="p-3 text-sm font-medium text-gray-400">Type</th>
                            <th className="p-3 text-sm font-medium text-gray-400">Amount</th>
                            <th className="p-3 text-sm font-medium text-gray-400">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map(activity => {
                            const StatusIcon = statusStyles[activity.status].icon;
                            const statusColor = statusStyles[activity.status].color;
                            return (
                                <tr key={activity.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                    <td className="p-3 text-white font-medium">{activity.product}</td>
                                    <td className="p-3">{activity.type}</td>
                                    <td className="p-3">{formatCurrency(activity.amount)}</td>
                                    <td className={`p-3 flex items-center gap-2 ${statusColor}`}>
                                        <StatusIcon size={16} />
                                        <span>{statusStyles[activity.status].label}</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}