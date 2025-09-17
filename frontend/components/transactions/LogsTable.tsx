// frontend/components/transactions/LogsTable.tsx
import clsx from "clsx";

interface Log {
  id: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  createdAt: string;
  user: {
    email: string;
  } | null; // The user object can be null for unauthenticated logs
}

interface LogsTableProps {
  logs: Log[];
}

const getStatusClass = (code: number) => {
  if (code >= 500) return "bg-red-500/10 text-red-400";
  if (code >= 400) return "bg-orange-500/10 text-orange-400";
  if (code >= 200) return "bg-green-500/10 text-green-400";
  return "bg-gray-500/10 text-gray-400";
};

export default function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4 text-sm font-medium text-gray-400">Method</th>
              <th className="p-4 text-sm font-medium text-gray-400">
                Endpoint
              </th>
              <th className="p-4 text-sm font-medium text-gray-400">User</th>
              <th className="p-4 text-sm font-medium text-gray-400">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <span
                    className={clsx(
                      "px-2.5 py-1 text-xs font-semibold rounded-full",
                      getStatusClass(log.statusCode),
                    )}
                  >
                    {log.statusCode}
                  </span>
                </td>
                <td className="p-4 text-white font-mono text-sm">
                  {log.httpMethod}
                </td>
                <td className="p-4 text-gray-300 font-mono text-sm">
                  {log.endpoint}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {log.user?.email || "N/A"}
                </td>

                <td className="p-4 text-gray-400 text-sm">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
