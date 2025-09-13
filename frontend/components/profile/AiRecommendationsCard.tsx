// frontend/components/profile/AiRecommendationsCard.tsx
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AiRecommendationsCard({ recommendations }: any) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-yellow-400" size={20} />
        <h3 className="text-lg font-semibold text-white">AI-Powered Recommendations</h3>
      </div>
      <p className="text-sm text-gray-300 mb-4">{recommendations.summary}</p>
      <div className="space-y-2">
        {recommendations.products.map((product: string) => (
          <Link href="/dashboard/products" key={product} className="block bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">{product}</span>
              <ArrowRight size={16} className="text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}