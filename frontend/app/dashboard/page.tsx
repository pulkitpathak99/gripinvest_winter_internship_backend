// frontend/app/dashboard/page.tsx

"use client";



import { useAuth } from '@/context/AuthContext';

import { useEffect, useState } from 'react';



// Import your new dashboard components

import WelcomeCard from '@/components/dashboard/WelcomeCard';

import PortfolioValueCard from '@/components/dashboard/PortfolioValueCard';

import AssetDistributionCard from '@/components/dashboard/AssetDistributionCard';

import AiInsightsCard from '@/components/dashboard/AiInsightsCard';

import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

import { fetchDashboardSummary } from '@/lib/api'; // This function now exists!



// The interface stays the same because it's our "contract"

export interface DashboardData {

totalValue: number;

valueChange: number;

assetDistribution: { name: string; value: number; color: string }[];

aiInsight: string;

recentActivity: { id: string; product: string; type: string; status: 'active' | 'pending' | 'matured'; amount: number }[];

}



export default function DashboardPage() {

const { user } = useAuth();

const [data, setData] = useState<DashboardData | null>(null);

const [isLoading, setIsLoading] = useState(true);



useEffect(() => {

const getDashboardData = async () => {

try {

// REMOVED: The mock data block


// ADDED: The real API call

const summaryData = await fetchDashboardSummary();

setData(summaryData);



} catch (error) {

console.error("Failed to fetch dashboard data on page", error);

// The UI will show the error message below

} finally {

setIsLoading(false);

}

};



getDashboardData();

}, []);



// ... the rest of your component's return statement remains unchanged

// It will now render real data from your backend.



if (isLoading) {

return <div className="text-center">Loading Dashboard...</div>;

}


if (!data) {

return <div className="text-center text-red-400">Failed to load dashboard data. Please try again later.</div>;

}



return (

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-3">

<WelcomeCard name={user?.firstName || 'User'} />

</div>

<PortfolioValueCard

totalValue={data.totalValue}

valueChange={data.valueChange}

/>

<AssetDistributionCard data={data.assetDistribution} />

<AiInsightsCard insight={data.aiInsight} />

<div className="lg:col-span-3">

<RecentActivityCard activities={data.recentActivity} />

</div>

</div>

);

} 