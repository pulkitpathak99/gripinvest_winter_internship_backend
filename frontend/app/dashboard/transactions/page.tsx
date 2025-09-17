// frontend/app/dashboard/transactions/page.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

import AiSummaryCard from "@/components/transactions/AiSummaryCard";
import LogsTable from "@/components/transactions/LogsTable";

// NEW: Define the updated data structure
interface AiSummary {
  text: string;
  status: "success" | "warning";
}

interface TransactionData {
  logs: any[];
  aiErrorSummary: AiSummary; // This is now an object
}

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // NOTE: This assumes your backend at GET /transactions
        // now returns the aiErrorSummary as an object: { text: string, status: string }
        const response = await api.get("/transactions");
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
    return (
      <div className="text-center text-gray-300">
        Loading Transaction Logs...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-400">
        Could not load transaction data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* This now passes the entire summary object to the component */}
      <AiSummaryCard summary={data.aiErrorSummary} />
      <LogsTable logs={data.logs} />
    </div>
  );
}
