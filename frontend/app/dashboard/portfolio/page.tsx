// frontend/app/dashboard/portfolio/page.tsx
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import React, { Dispatch, SetStateAction } from 'react';
import KpiCard from '@/components/portfolio/KpiCard';
import PerformanceChart from '@/components/portfolio/PerformanceChart';
import InvestmentsTable from '@/components/portfolio/InvestmentsTable';
import AssetAllocationChart from '@/components/portfolio/AssetAllocationChart';
import { TrendingUp, Landmark, Wallet, PlusCircle } from 'lucide-react';

// Define a stricter type for our data
interface PerformanceDataPoint { date: string; value: number; contributions: number; earnings: number; }
interface PortfolioDetails {
  kpis: { totalValue: number; totalInvested: number; overallGain: number; };
  performanceData: { [key: string]: PerformanceDataPoint[] };
  assetAllocation: { name: string; value: number }[];
  investmentList: any[];
}

type Timeframe = '1M' | '6M' | '1Y' | 'All';

interface PerformanceChartProps {
  data: { [key: string]: any[] };
  timeframe: Timeframe;
  setTimeframe: Dispatch<SetStateAction<Timeframe>>;
}


export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');

  useEffect(() => {
    const fetchPortfolioDetails = async () => {
      try {
        const response = await api.get('/portfolio/details');
        setPortfolio(response.data);
      } catch (error) {
        console.error('Failed to fetch portfolio details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioDetails();
  }, []);

  if (loading) return <div className="text-center text-gray-300">Loading Your Portfolio...</div>;
  if (!portfolio) return <div className="text-center text-red-400">Could not load portfolio data.</div>;

  // --- DYNAMIC KPI CALCULATIONS ---
  const timeData = portfolio.performanceData[timeframe];
  const beginningBalance = timeData[0]?.value - (timeData[0]?.value - timeData[0]?.contributions - timeData[0]?.earnings);
  const endingBalance = timeData[timeData.length - 1]?.value;
  const netContributions = timeData[timeData.length - 1]?.contributions - timeData[0]?.contributions;
  const earnings = endingBalance - beginningBalance - netContributions;
  const earningsColor = earnings >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Section 1: Dynamic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Beginning Balance" value={`$${beginningBalance.toLocaleString()}`} icon={Wallet} />
        <KpiCard title="Net Contributions" value={`$${netContributions.toLocaleString()}`} icon={PlusCircle} />
        <KpiCard title="Earnings" value={`$${earnings.toLocaleString()}`} icon={TrendingUp} changeColor={earningsColor} />
        <KpiCard title="Ending Balance" value={`$${endingBalance.toLocaleString()}`} icon={Landmark} />
      </div>

      {/* Section 2: Interactive Performance Chart */}
      <PerformanceChart
        data={portfolio.performanceData}
        timeframe={timeframe}
        setTimeframe={setTimeframe} // <-- Pass the state setter directly
      />

      {/* Section 3: Allocation and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AssetAllocationChart data={portfolio.assetAllocation} />
        </div>
        <div className="lg:col-span-2">
          <InvestmentsTable investments={portfolio.investmentList} />
        </div>
      </div>
    </div>
  );
}