//backend/src/api/services/dashboard.service.ts

import prisma  from '../utils/prismaClient';
import { generateContentWithFallback } from '../utils/aiHelper';


async function getAiInsight(distribution: any[]): Promise<string> {
  if (distribution.length === 0) {
    return "You haven't made any investments yet. Explore our products to get started!";
  }

  const portfolioSummary = distribution.map(d => `${d.value}% in ${d.name}`).join(', ');
  const prompt = `
      Analyze the following investment portfolio distribution: ${portfolioSummary}.
      Provide a concise, encouraging, and actionable insight in 1-2 sentences. 
      Focus on diversification or potential opportunities. Do not use markdown.
  `;
  
  // Use the imported helper function for resilient AI calls
  try {
    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("AI insight generation failed after fallback:", error);
    return "Your portfolio is looking good! Keep an eye on market trends for new opportunities.";
  }
}

// The fetchDashboardSummary function remains the same and correctly calls the updated getAiInsight
export const fetchDashboardSummary = async (userId: string) => {
  const investments = await prisma.investment.findMany({
    where: { userId: userId, status: 'active' },
    include: { product: true },
  });

  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);

  if (totalValue === 0) {
    return {
        totalValue: 0,
        valueChange: 0,
        assetDistribution: [],
        aiInsight: "You haven't made any investments yet. Explore our products to get started!",
        recentActivity: [],
    };
  }
  
  const distributionMap = new Map<string, number>();
  investments.forEach(inv => {
    const type = inv.product.investmentType;
    const currentAmount = distributionMap.get(type) || 0;
    distributionMap.set(type, currentAmount + Number(inv.amount));
  });

  const assetDistribution = Array.from(distributionMap.entries()).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: parseFloat(((value / totalValue) * 100).toFixed(2)),
    color: name === 'bond' ? '#3b82f6' : name === 'etf' ? '#14b8a6' : '#f97316',
  }));
  
  const recentActivity = investments
    .sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime())
    .slice(0, 5)
    .map(inv => ({
        id: inv.id,
        product: inv.product.name,
        type: inv.product.investmentType.toUpperCase(),
        status: inv.status,
        amount: Number(inv.amount),
    }));

  const aiInsight = await getAiInsight(assetDistribution);
  // This is a placeholder; in a real app, this would be a real calculation
  const valueChange = parseFloat((Math.random() * 2 - 1).toFixed(2));

  return {
    totalValue,
    valueChange,
    assetDistribution,
    aiInsight,
    recentActivity,
  };
};