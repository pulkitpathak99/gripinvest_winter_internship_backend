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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setError("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/investments", {
        productId: product.id,
        amount: investmentAmount,
      });
      onSuccess(); // only call parent success
    } catch (error: unknown) {
      console.error('Investment error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred.");
      } else {
        setError("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Invest in {product.name}</h2>

        <p className="mb-1 text-gray-600">
          Annual Yield: <span className="font-semibold">{product.annualYield}%</span>
        </p>
        <p className="mb-4 text-gray-600">
          Min Investment:{" "}
          <span className="font-semibold">
            ${Number(product.minInvestment).toLocaleString()}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Investment Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Min $${Number(product.minInvestment).toLocaleString()}`}
            required
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Processing..." : "Confirm Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}