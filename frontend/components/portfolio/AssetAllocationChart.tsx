// frontend/components/portfolio/AssetAllocationChart.tsx
"use client";

import { formatCurrency } from '@/lib/formatters';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Define the shape of the data prop
interface ChartData {
  name: string;
  value: number;
}

interface AssetAllocationChartProps {
  data: ChartData[];
}

// Pre-defined, vibrant colors for chart segments
const COLORS = ['#3b82f6', '#14b8a6', '#f97316', '#ef4444', '#8b5cf6'];

export default function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  return (
    // The card container, consistent with your other components
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
      
      {/* Responsive container makes the chart fit its parent div */}
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%" // Center X
            cy="50%" // Center Y
            innerRadius={65} // This creates the donut hole
            outerRadius={95} // The outer edge of the donut
            fill="#8884d8"
            paddingAngle={5} // Adds a nice gap between segments
            labelLine={false} // Hides the lines pointing to labels
          >
            {/* Map over the data to apply a unique color to each segment */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* Tooltip that appears on hover, formatted as a dollar amount */}
          <Tooltip 
            formatter={(value: number) => `${formatCurrency(value)}`}
            contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '0.5rem' 
            }}
          />

          {/* The legend that explains each color */}
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}