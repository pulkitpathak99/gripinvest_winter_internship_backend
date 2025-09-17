// frontend/components/ProductFilters.tsx

import { Sparkles, X } from "lucide-react";
import clsx from "clsx";
import * as Slider from "@radix-ui/react-slider";

// The props interface remains the same
interface ProductFiltersProps {
  filters: {
    type: string;
    risk: string;
    yieldRange: number[];
  };
  onFilterChange: (key: "type" | "risk", value: string) => void;
  onYieldChange: (value: number[]) => void;
  onAiRecommend: () => void;
  onResetFilters: () => void;
  maxYield: number;
}

const productTypes = ["All", "Bond", "FD", "MF", "ETF", "Other"];
const riskLevels = ["All", "Low", "Moderate", "High"];

export default function ProductFilters({
  filters,
  onFilterChange,
  onYieldChange,
  onAiRecommend,
  onResetFilters,
  maxYield,
}: ProductFiltersProps) {
  const isFilterActive =
    filters.type !== "All" ||
    filters.risk.toLowerCase() !== "all" ||
    filters.yieldRange[0] !== 0 ||
    filters.yieldRange[1] !== maxYield;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-400">
            Investment Type
          </label>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange("type", type)}
                className={clsx(
                  "px-3 py-1.5 text-sm rounded-md transition-colors font-medium",
                  filters.type === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Group 2: Risk Level */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-400">
            Risk Level
          </label>
          <div className="flex flex-wrap gap-2">
            {riskLevels.map((risk) => (
              <button
                key={risk}
                onClick={() => onFilterChange("risk", risk.toLowerCase())}
                className={clsx(
                  "px-3 py-1.5 text-sm rounded-md transition-colors font-medium",
                  filters.risk === risk.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700",
                )}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Group 3: Annual Yield Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-400">
              Annual Yield
            </label>
            <span className="text-sm font-semibold text-white">
              {filters.yieldRange[0]}% - {filters.yieldRange[1]}%
            </span>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={filters.yieldRange}
            onValueChange={onYieldChange}
            min={0}
            max={maxYield}
            step={1}
          >
            <Slider.Track className="bg-gray-700 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer" />
            <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer" />
          </Slider.Root>
        </div>

        {/* Group 4: Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          {isFilterActive && (
            <button
              onClick={onResetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <X size={16} />
              <span className="font-medium text-sm">Reset</span>
            </button>
          )}
          <button
            onClick={onAiRecommend}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Sparkles size={16} />
            <span>AI Recommend</span>
          </button>
        </div>
      </div>
    </div>
  );
}
