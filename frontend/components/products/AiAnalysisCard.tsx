// frontend/components/products/AiAnalysisCard.tsx
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface AiAnalysisCardProps {
  productId: string;
}

interface Analysis {
  pros: string[];
  cons: string[];
}

export default function AiAnalysisCard({ productId }: AiAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/products/${productId}/analysis`);
        setAnalysis(response.data);
      } catch (error) {
        console.error("Failed to fetch AI analysis:", error);
      }
    };
    fetchAnalysis();
  }, [productId]);

  if (!analysis) {
    return <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 text-center text-gray-400">Generating AI Analysis...</div>;
  }

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div>
          <h4 className="flex items-center gap-2 font-medium text-green-400 mb-2"><ThumbsUp size={16} /> Pros</h4>
          <ul className="space-y-2 list-disc list-inside text-gray-300 text-sm">
            {analysis.pros.map((pro, i) => <li key={i}>{pro}</li>)}
          </ul>
        </div>
        {/* Cons */}
        <div>
          <h4 className="flex items-center gap-2 font-medium text-red-400 mb-2"><ThumbsDown size={16} /> Cons</h4>
          <ul className="space-y-2 list-disc list-inside text-gray-300 text-sm">
            {analysis.cons.map((con, i) => <li key={i}>{con}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}