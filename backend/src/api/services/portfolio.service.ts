// backend/src/api/services/portfolio.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This detailed helper function creates the complete data your frontend needs
const generateDetailedPerformance = (investments: any[], totalValue: number) => {
  const history: { date: string; value: number; contributions: number; earnings: number }[] = [];
  const today = new Date();
  
  const sortedInvestments = [...investments].sort((a, b) => new Date(a.investedAt).getTime() - new Date(b.investedAt).getTime());

  let cumulativeContributions = 0;
  let runningValue = 0;

  for (let i = 11; i >= 0; i--) {
    const monthStartDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEndDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

    const monthlyContributions = sortedInvestments
      .filter(inv => {
        const investedDate = new Date(inv.investedAt);
        return investedDate >= monthStartDate && investedDate <= monthEndDate;
      })
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    cumulativeContributions += monthlyContributions;
    
    const marketFluctuation = (Math.random() - 0.45) * 0.05;
    runningValue = (runningValue + monthlyContributions) * (1 + marketFluctuation);
    
    if (i === 0) {
      runningValue = totalValue;
    }

    const earnings = runningValue - cumulativeContributions;

    history.push({
      date: monthStartDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      value: Math.max(0, parseFloat(runningValue.toFixed(2))),
      contributions: parseFloat(cumulativeContributions.toFixed(2)),
      earnings: parseFloat(earnings.toFixed(2)),
    });
  }
  return history;
};


export const getPortfolioDetails = async (userId: string) => {
  const investments = await prisma.investment.findMany({
    where: { userId, status: 'active' },
    include: { product: true },
    orderBy: { investedAt: 'desc' },
  });

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  
  const investmentsWithCurrentValue = investments.map(inv => {
      const simulatedGainLossFactor = 1 + (Math.random() - 0.4) * 0.2;
      return {
          ...inv,
          currentValue: parseFloat((Number(inv.amount) * simulatedGainLossFactor).toFixed(2)),
      };
  });

  const totalValue = investmentsWithCurrentValue.reduce((sum, inv) => sum + inv.currentValue, 0);
  const overallGain = totalValue - totalInvested;

  const distributionMap = new Map<string, number>();
  investmentsWithCurrentValue.forEach(inv => {
    const type = inv.product.investmentType.toUpperCase();
    const currentAmount = distributionMap.get(type) || 0;
    distributionMap.set(type, currentAmount + inv.currentValue);
  });
  
  const assetAllocation = Array.from(distributionMap.entries()).map(([name, value]) => ({ name, value }));
  
  const investmentList = investmentsWithCurrentValue.map(inv => ({
    id: inv.id,
    amount: Number(inv.amount),
    currentValue: inv.currentValue,
    investedAt: inv.investedAt,
    status: inv.status,
    product: { name: inv.product.name, investmentType: inv.product.investmentType },
  }));
  
  const fullHistory = generateDetailedPerformance(investments, totalValue);

  const performanceData = {
    '1M': fullHistory.slice(-2),
    '6M': fullHistory.slice(-7),
    '1Y': fullHistory,
    'All': fullHistory,
  };
  
  return {
    kpis: {
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      overallGain: parseFloat(overallGain.toFixed(2)),
      projectedReturn: 8.5, // Mocked
    },
    performanceData,
    assetAllocation,
    investmentList,
  };
};