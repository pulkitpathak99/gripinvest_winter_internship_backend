// frontend/components/dashboard/AssetDistributionCard.tsx
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface AssetDistributionCardProps {
    data: { name: string; value: number; color: string }[];
}

export default function AssetDistributionCard({ data }: AssetDistributionCardProps) {
    return (
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 shadow-md">
            <h3 className="font-semibold text-white">Asset Distribution</h3>
            <div style={{ width: '100%', height: 150 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}