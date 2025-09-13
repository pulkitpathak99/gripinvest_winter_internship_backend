// frontend/components/InvestmentModal.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import api from "@/lib/api";

interface Product {
  id: string;
  name: string;
  annualYield: number;
  minInvestment: number;
  maxInvestment?: number | null;
}

interface InvestmentModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InvestmentModal({ product, onClose, onSuccess }: InvestmentModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // This submission logic is perfect, no changes needed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount < product.minInvestment) {
      setError(`Amount must be at least $${product.minInvestment.toLocaleString()}`);
      setLoading(false);
      return;
    }

    try {
      await api.post("/investments", {
        productId: product.id,
        amount: investmentAmount,
      });
      onSuccess();
    } catch (error: unknown) {
      console.error('Investment error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- THIS IS THE NEW RENDERED OUTPUT ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-2">Invest in {product.name}</h2>
        <div className="flex items-center gap-6 mb-6 text-gray-300">
            <p>Yield: <span className="font-semibold text-green-400">{product.annualYield}%</span></p>
            <p>Min: <span className="font-semibold text-white">${Number(product.minInvestment).toLocaleString()}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
            Investment Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`e.g., ${Number(product.minInvestment).toLocaleString()}`}
            required
            step="100" // for easier increments
          />

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400/50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}