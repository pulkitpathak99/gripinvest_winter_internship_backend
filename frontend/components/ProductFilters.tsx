// frontend/components/ProductFilters.tsx
import { Sparkles } from 'lucide-react';
import clsx from 'clsx'; // A utility for constructing className strings conditionally

// Define the shape of the props this component expects
interface ProductFiltersProps {
  filters: {
    type: string;
    risk: string;
  };
  onFilterChange: (key: 'type' | 'risk', value: string) => void;
  onAiRecommend: () => void;
}

const productTypes = ['All', 'Bond', 'ETF', 'FD'];
const riskLevels = ['All', 'low', 'moderate', 'high'];

export default function ProductFilters({ filters, onFilterChange, onAiRecommend }: ProductFiltersProps) {
  return (
    <div className="mb-8 p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row w-full items-center gap-4">
        {/* Product Type Filters */}
        <div className="flex items-center gap-2">
          <div className="text-gray-300 font-medium text-sm">Type:</div>
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange('type', type)}
              className={clsx(
                "px-3 py-1 text-sm rounded-full transition-colors",
                filters.type === type 
                  ? "bg-blue-600 text-white font-semibold" 
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Risk Level Filters */}
        <div className="flex items-center gap-2">
          <div className="text-gray-300 font-medium text-sm">Risk:</div>
          {riskLevels.map((risk) => (
            <button
              key={risk}
              onClick={() => onFilterChange('risk', risk)}
              className={clsx(
                "px-3 py-1 text-sm rounded-full transition-colors",
                filters.risk === risk 
                  ? "bg-blue-600 text-white font-semibold" 
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              )}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* AI Recommendation Button */}
      <button 
        onClick={onAiRecommend}
        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2 bg-yellow-500/10 text-yellow-300 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
      >
        <Sparkles size={16} />
        <span className="font-semibold text-sm">Get AI Recommendation</span>
      </button>
    </div>
  );
}