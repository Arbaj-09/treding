import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, XCircle, ArrowUpCircle } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { StatusBadge, SubTypeBadge } from '../components/ui/StatusBadge';
import { getRemainingDays, formatDate } from '../utils/helpers';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PageHeader from '../components/ui/PageHeader';
import FilterDropdown from '../components/ui/FilterDropdown';
import SearchBar from '../components/ui/SearchBar';

export default function SubscriptionManagement() {
  const { customers, renewSubscription, markExpired, upgradeToYearly } = useCustomers();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null);

  const subCustomers = customers.filter(c => c.subscriptionType !== 'trial' || c.status === 'active');

  const filtered = subCustomers.filter(c => {
    const matchSearch = !search || c.fullName.toLowerCase().includes(search.toLowerCase()) || c.loginId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.subscriptionType === filter || c.status === filter;
    return matchSearch && matchFilter;
  });

  const monthly = customers.filter(c => c.subscriptionType === 'monthly' && c.status === 'active').length;
  const yearly = customers.filter(c => c.subscriptionType === 'yearly' && c.status === 'active').length;
  const expired = customers.filter(c => c.status === 'expired' && c.subscriptionType !== 'trial').length;

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'renew') renewSubscription(confirmAction.id);
    else if (confirmAction.type === 'expire') markExpired(confirmAction.id);
    else if (confirmAction.type === 'upgrade') upgradeToYearly(confirmAction.id);
    setConfirmAction(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Subscription Management" subtitle="Manage all customer subscriptions" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Monthly Active', count: monthly, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Yearly Active', count: yearly, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Expired', count: expired, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search customer..." />
          <FilterDropdown
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All Plans' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Customer', 'Login ID', 'Plan', 'Status', 'Start Date', 'End Date', 'Remaining', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No subscriptions found</td></tr>
              ) : filtered.map((c, i) => {
                const endDate = c.subscriptionEndDate || c.trialEndDate;
                const remaining = getRemainingDays(endDate);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{c.fullName}</p>
                          <p className="text-xs text-slate-400">{c.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">{c.loginId}</span></td>
                    <td className="px-4 py-3"><SubTypeBadge type={c.subscriptionType} /></td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.subscriptionStartDate ? formatDate(c.subscriptionStartDate) : '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{endDate ? formatDate(endDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-500' : remaining <= 7 ? 'text-amber-500' : 'text-slate-700'}`}>
                        {remaining < 0 ? 'Expired' : `${remaining}d`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setConfirmAction({ type: 'renew', id: c.id })} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Renew">
                          <RefreshCw size={14} />
                        </button>
                        {c.subscriptionType === 'monthly' && (
                          <button onClick={() => setConfirmAction({ type: 'upgrade', id: c.id })} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Upgrade to Yearly">
                            <ArrowUpCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => setConfirmAction({ type: 'expire', id: c.id })} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Mark Expired">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'renew' ? 'Renew Subscription' : confirmAction?.type === 'upgrade' ? 'Upgrade to Yearly' : 'Mark as Expired'}
        message={
          confirmAction?.type === 'renew' ? 'This will renew the subscription from today.' :
          confirmAction?.type === 'upgrade' ? 'This will upgrade the plan to Yearly (365 days) from today.' :
          'This will mark the subscription as expired.'
        }
        confirmLabel={confirmAction?.type === 'renew' ? 'Renew' : confirmAction?.type === 'upgrade' ? 'Upgrade' : 'Mark Expired'}
        danger={confirmAction?.type === 'expire'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </motion.div>
  );
}
