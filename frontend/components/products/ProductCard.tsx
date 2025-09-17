// frontend/components/ProductCard.tsx
import { ShieldCheck, Calendar, DollarSign } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/formatters";

interface ProductCardProps {
  product: Product;
  onInvestClick: (event: React.MouseEvent) => void;
}

const riskStyles = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  moderate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ProductCard({
  product,
  onInvestClick,
}: ProductCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-between transition-all hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1">
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-white pr-4">
            {product.name}
          </h2>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${riskStyles[product.riskLevel]}`}
          >
            {product.riskLevel.charAt(0).toUpperCase() +
              product.riskLevel.slice(1)}{" "}
            Risk
          </span>
        </div>
        <p className="text-sm text-blue-400 mt-1">
          {product.investmentType.toUpperCase()}
        </p>

        {/* Annual Yield */}
        <div className="my-6">
          <p className="text-5xl font-bold text-white">
            {product.annualYield}%
          </p>
          <p className="text-gray-400">Annual Yield (Per Annum)</p>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3 border-t border-slate-800 pt-4 text-sm">
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-2 text-gray-400">
              <Calendar size={16} /> Tenure
            </span>
            <span className="font-medium text-white">
              {product.tenureMonths} Months
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-2 text-gray-400">
              <DollarSign size={16} /> Min. Investment
            </span>
            <span className="font-medium text-white">
              {formatCurrency(Number(product.minInvestment))}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onInvestClick}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Invest Now
      </button>
    </div>
  );
}
