// frontend/components/portfolio/InvestmentsTable.tsx
import { MoreVertical } from "lucide-react";
import InvestmentRow from "./InvestmentRow";

// Reusing your Investment type from the page
interface Investment {
  id: string;
  currentValue: number; // We can calculate this later if needed
  amount: number;
  investedAt: string;
  status: "active" | "matured" | "cancelled";
  expectedReturn: number; // <-- ADD THIS
  maturityDate: string; // <-- ADD THIS
  product: {
    name: string;
    investmentType: string;
  };
}

interface InvestmentsTableProps {
  investments: Investment[];
}

const typeStyles: Record<string, string> = {
  ETF: "bg-teal-500/10 text-teal-400",
  BOND: "bg-blue-500/10 text-blue-400",
  FD: "bg-orange-500/10 text-orange-400",
};

export default function InvestmentsTable({
  investments,
}: InvestmentsTableProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">My Investments</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Product Name
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Invested
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Current Value
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Expected Return
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Maturity Date
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Invested On
              </th>
              <th className="p-3 text-sm font-medium text-gray-400 whitespace-nowrap">
                Status
              </th>
              <th className="p-3 text-sm font-medium text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <InvestmentRow key={inv.id} investment={inv} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
