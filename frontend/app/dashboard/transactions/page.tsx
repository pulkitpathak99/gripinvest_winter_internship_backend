// frontend/app/dashboard/transactions/page.tsx
"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

import AiSummaryCard from '@/components/transactions/AiSummaryCard';
import LogsTable from '@/components/transactions/LogsTable';

// Define the type for the data we expect from the backend
interface TransactionData {
  logs: any[]; // Define a stricter type if you have time
  aiErrorSummary: string;
}

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/transactions');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch transaction logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-300">Loading Transaction Logs...</div>;
  }

  if (!data) {
    return <div className="text-center text-red-400">Could not load transaction data.</div>;
  }

  return (
    <div className="space-y-6">
      <AiSummaryCard summary={data.aiErrorSummary} />
      {/* We can add filter components here in the future */}
      <LogsTable logs={data.logs} />
    </div>
  );
}