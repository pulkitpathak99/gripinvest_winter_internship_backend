// frontend/app/(dashboard)/products/page.tsx
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import InvestmentModal from '@/components/InvestmentModal'; // <-- Import the modal
import { toast } from "react-toastify"; 

// Expanded Product type to include minInvestment
interface Product {
  id: string;
  name: string;
  investmentType: string;
  annualYield: number;
  riskLevel: 'low' | 'moderate' | 'high';
  tenureMonths: number;
  minInvestment: number;
  maxInvestment?: number | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // <-- State for the modal
  const router = useRouter(); // <-- Initialize router

  useEffect(() => {
    // ... (fetchProducts function remains the same)
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInvestmentSuccess = () => {
    setSelectedProduct(null); // close modal immediately
    toast.success("Investment successful! 🎉");

    // redirect after a short delay (so toast is visible)
    setTimeout(() => {
      router.push("/portfolio");
    }, 1200);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Investment Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600">Type: {product.investmentType.toUpperCase()}</p>
              <p className="text-gray-800 font-bold text-2xl my-3">{product.annualYield}% <span className="text-sm font-normal">p.a.</span></p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Risk: <span className="font-medium text-black">{product.riskLevel}</span></span>
                <span>Tenure: <span className="font-medium text-black">{product.tenureMonths} months</span></span>
              </div>
            </div>
            {/* --- THIS IS THE NEW BUTTON --- */}
            <button onClick={() => setSelectedProduct(product)} className="block mt-4 text-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Invest Now
            </button>
          </div>
        ))}
      </div>

      {/* --- RENDER THE MODAL CONDITIONALLY --- */}
      {selectedProduct && (
        <InvestmentModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
}