// frontend/components/portfolio/InvestmentRow.tsx
import { MoreVertical } from 'lucide-react';

interface Investment {
  id: string;
  currentValue: number;
  amount: number;
  investedAt: string;
  status: 'active' | 'matured' | 'cancelled';
  product: {
    name: string;
    investmentType: string;
  };
}

interface InvestmentRowProps {
  investment: Investment;
}

export default function InvestmentRow({ investment: inv }: InvestmentRowProps) {
  return (
    <tr key={inv.id} className="border-b border-slate-800 hover:bg-slate-800/50">
      <td className="p-3 text-white font-medium">{inv.product.name}</td>
      <td className="p-3 text-gray-400">${Number(inv.amount).toLocaleString()}</td>
      <td className="p-3 text-white font-semibold">${Number(inv.currentValue).toLocaleString()}</td>
      <td className="p-3 text-gray-400">{new Date(inv.investedAt).toLocaleDateString()}</td>
      <td className="p-3 text-green-400 font-medium capitalize">{inv.status}</td>
      <td className="p-3 text-gray-400"><MoreVertical size={18} className="cursor-pointer" /></td>
    </tr>
  );
}