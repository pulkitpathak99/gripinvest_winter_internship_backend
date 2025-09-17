// frontend/components/products/ReturnsCalculator.tsx
"use client";

import { useState } from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/formatters";

interface ReturnsCalculatorProps {
  product: Product;
}

export default function ReturnsCalculator({ product }: ReturnsCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(
    product.minInvestment,
  );

  // Simple interest calculation for fixed-return products
  const interestEarned =
    investmentAmount *
    (product.annualYield / 100) *
    (product.tenureMonths / 12);
  const totalValue = investmentAmount + interestEarned;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(Number(e.target.value));
  };

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Returns Calculator
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400">
            Investment Amount
          </label>
          <input
            type="range"
            min={product.minInvestment}
            max={product.maxInvestment || product.minInvestment * 10}
            step={100}
            value={investmentAmount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(product.minInvestment)}</span>
            <span>
              {formatCurrency(
                product.maxInvestment || product.minInvestment * 10,
              )}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Your Investment</span>
            <span className="font-semibold text-white">
              {formatCurrency(investmentAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Projected Interest</span>
            <span className="font-semibold text-green-400">
              + {formatCurrency(interestEarned)}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-300">Total Value at Maturity</span>
            <span className="font-bold text-white">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center pt-2">
          *This is a projection for fixed-return assets. Returns for MFs and
          ETFs are not guaranteed.
        </p>
      </div>
    </div>
  );
}
