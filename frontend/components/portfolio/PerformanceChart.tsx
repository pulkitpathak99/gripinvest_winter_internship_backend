// frontend/components/portfolio/PerformanceChart.tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react'; // Import React types

// Define the shape of the data it will receive
interface PerformanceData {
  date: string;
  value: number;
  contributions?: number; // Make contributions optional
  earnings?: number;     // Make earnings optional
}

type Timeframe = '1M' | '6M' | '1Y' | 'All';

interface PerformanceChartProps {
  data: { [key: string]: PerformanceData[] };
  timeframe: Timeframe;
  setTimeframe: Dispatch<SetStateAction<Timeframe>>; // Correct type for the state setter
}

// A custom tooltip to show our detailed data safely
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg text-sm">
        <p className="label text-gray-400">{`${label}`}</p>
        {payload[0] && <p className="intro text-blue-400 font-semibold">{`Portfolio Value : $${payload[0].value.toLocaleString()}`}</p>}
        {payload[1] && <p className="intro text-teal-400">{`Net Contributions : $${payload[1].value.toLocaleString()}`}</p>}
        {dataPoint.earnings !== undefined && <p className="intro text-gray-300">{`Earnings : $${dataPoint.earnings.toLocaleString()}`}</p>}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data, timeframe, setTimeframe }: PerformanceChartProps) {
  const chartData = data[timeframe] || [];

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Performance Analysis</h3>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
          {(['1M', '6M', '1Y', 'All'] as Timeframe[]).map(t => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t)}
              className={clsx('px-3 py-1 text-xs font-semibold rounded-md transition-colors', {
                'bg-blue-600 text-white': timeframe === t,
                'text-gray-400 hover:bg-slate-700': timeframe !== t
              })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value/1000)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            {chartData[0]?.contributions !== undefined && (
              <Area type="monotone" dataKey="contributions" name="Net Contributions" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorContributions)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}