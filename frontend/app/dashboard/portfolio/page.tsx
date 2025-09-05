// frontend/app/(dashboard)/portfolio/page.tsx
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define types for portfolio data
interface Investment {
  id: string;
  amount: number;
  investedAt: string;
  product: {
    name: string;
    investmentType: string;
  };
}

// Type for chart data
interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/investments/portfolio');
        const data: Investment[] = response.data;
        setInvestments(data);

        // Calculate total portfolio value
        const total = data.reduce((acc, curr) => acc + Number(curr.amount), 0);
        setTotalValue(total);

        // Process data for the pie chart
        const distribution = data.reduce((acc, curr) => {
          const type = curr.product.investmentType.toUpperCase();
          acc[type] = (acc[type] || 0) + Number(curr.amount);
          return acc;
        }, {} as Record<string, number>);

        const formattedChartData = Object.keys(distribution).map(key => ({
          name: key,
          value: distribution[key],
        }));
        setChartData(formattedChartData);

      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading portfolio...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
      <p className="text-gray-600 mb-6">Total Value: <span className="font-bold text-xl">${totalValue.toLocaleString()}</span></p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <h2 className="text-xl font-semibold mb-4">Asset Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Investments List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Investments</h2>
          <div className="space-y-4">
            {investments.map(inv => (
              <div key={inv.id} className="border-b pb-2">
                <div className="flex justify-between font-semibold">
                  <span>{inv.product.name}</span>
                  <span>${Number(inv.amount).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Invested on: {new Date(inv.investedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}