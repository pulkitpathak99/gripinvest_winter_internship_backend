// frontend/app/dashboard/investments/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

// Expanded type to include all details
interface InvestmentDetails {
  id: string;
  amount: number;
  status: string;
  expectedReturn: number;
  maturityDate: string;
  investedAt: string;
  product: {
    name: string;
    investmentType: string;
    tenureMonths: number;
    annualYield: number;
    riskLevel: string;
    description: string;
  };
}

export default function InvestmentDetailPage() {
  const { id } = useParams();
  const [investment, setInvestment] = useState<InvestmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchInvestment = async () => {
        try {
          const response = await api.get(`/investments/${id}`);
          setInvestment(response.data);
        } catch (error) {
          console.error("Failed to fetch investment details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInvestment();
    }
  }, [id]);

  if (loading) return <div>Loading investment details...</div>;
  if (!investment) return <div>Investment not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/portfolio" className="text-blue-400 hover:underline mb-6 block">&larr; Back to Portfolio</Link>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">{investment.product.name}</h1>
        <p className="text-md text-gray-400 mb-6 capitalize">{investment.product.investmentType} &bull; {investment.product.riskLevel} Risk</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-400">Invested Amount</p>
            <p className="text-xl font-semibold text-white">${Number(investment.amount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Expected Return</p>
            <p className="text-xl font-semibold text-green-400">+${Number(investment.expectedReturn).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Maturity Date</p>
            <p className="text-xl font-semibold text-white">{new Date(investment.maturityDate).toLocaleDateString()}</p>
          </div>
           <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-xl font-semibold text-white capitalize">{investment.status}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Product Details</h2>
          <p className="text-gray-300">{investment.product.description}</p>
        </div>
      </div>
    </div>
  );
}