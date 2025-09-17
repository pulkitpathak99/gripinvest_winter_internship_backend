"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types";
import { toast } from "react-toastify";

// Import our new components
import InvestmentModal from "@/components/products/InvestmentModal";
import ReturnsCalculator from "@/components/products/ReturnsCalculator";
import AiAnalysisCard from "@/components/products/AiAnalysisCard";
import { formatCurrency } from "@/lib/formatters";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          toast.error("Failed to fetch product details.");
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <div className="text-center">Loading product...</div>;
  }

  const handleInvestmentSuccess = () => {
    setIsModalOpen(false);
    toast.success("Investment successful!");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-blue-400 mb-6">
              {product.investmentType.toUpperCase()}
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              {product.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-slate-800 py-6 mb-8">
              {/* Key metrics here... */}
              <div>
                <p className="text-gray-400 text-sm">Annual Yield</p>
                <p className="text-2xl font-semibold text-green-400">
                  {product.annualYield}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-2xl font-semibold capitalize">
                  {product.riskLevel}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tenure</p>
                <p className="text-2xl font-semibold">
                  {product.tenureMonths} months
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Min. Investment</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(product.minInvestment)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-xs mx-auto bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Invest Now
            </button>
          </div>
          <ReturnsCalculator product={product} />
        </div>

        {/* Right Column: AI Analysis & Future Components */}
        <div className="lg:col-span-1">
          <AiAnalysisCard productId={product.id as string} />
          {/* You could add a historical performance chart here later */}
        </div>
      </div>

      {isModalOpen && (
        <InvestmentModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </>
  );
}
