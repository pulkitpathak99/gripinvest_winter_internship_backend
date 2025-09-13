// frontend/components/portfolio/InvestmentRow.tsx

import { useState, Fragment } from 'react';
import { MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import api from '@/lib/api';
import { Menu, Transition } from '@headlessui/react';

interface Investment {
  id: string;
  currentValue: number;
  amount: number;
  investedAt: string;
  status: 'active' | 'matured' | 'cancelled';
  expectedReturn: number;
  maturityDate: string;
  product?: {
    name?: string;
    investmentType?: string;
  };
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400',
  matured: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function InvestmentRow({ investment: initialInvestment }: { investment: Investment }) {
  const [investment, setInvestment] = useState(initialInvestment);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this investment? This action cannot be undone.')) return;

    setIsCancelling(true);
    setError('');
    try {
      const response = await api.post(`/investments/${investment.id}/cancel`);
      setInvestment(prev => ({ ...prev, ...response.data })); // Update state with cancelled status
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancellable =
    investment.status === 'active' &&
    new Date().getTime() - new Date(investment.investedAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50">
      <td className="p-3 text-white whitespace-nowrap">{investment.product?.name ?? 'N/A'}</td>
      <td className="p-3 text-gray-300 whitespace-nowrap">${Number(investment.amount).toLocaleString()}</td>
      <td className="p-3 text-gray-300 whitespace-nowrap">${Number(investment.currentValue).toLocaleString()}</td>
      <td className="p-3 text-green-400 font-medium whitespace-nowrap">
        +${Number(investment.expectedReturn).toLocaleString()}
      </td>
      <td className="p-3 text-gray-300 whitespace-nowrap">
        {new Date(investment.maturityDate).toLocaleDateString()}
      </td>
      <td className="p-3 text-gray-300 whitespace-nowrap">
        {new Date(investment.investedAt).toLocaleDateString()}
      </td>
      <td className="p-3 text-center">
        <span
          className={clsx(
            'px-2.5 py-1 text-xs font-semibold rounded-full capitalize',
            statusStyles[investment.status]
          )}
        >
          {investment.status}
        </span>
      </td>

      {/* --- ACTIONS MENU --- */}
      <td className="p-3 relative text-right">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="text-gray-400 hover:text-white">
              <MoreVertical size={18} />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/investments/${investment.id}`}
                      className={clsx(
                        'block px-4 py-2 text-sm',
                        active ? 'bg-slate-800 text-white' : 'text-gray-300'
                      )}
                    >
                      View Details
                    </Link>
                  )}
                </Menu.Item>

                {isCancellable && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className={clsx(
                          'w-full text-left px-4 py-2 text-sm',
                          active ? 'bg-slate-800 text-red-400' : 'text-red-400',
                          'disabled:opacity-50'
                        )}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Investment'}
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Error feedback */}
        {error && <p className="text-xs text-red-500 absolute right-0 mt-2">{error}</p>}
      </td>
    </tr>
  );
}
