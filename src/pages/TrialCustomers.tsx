import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { getRemainingDays, formatDate } from '../utils/helpers';
import { StatusBadge } from '../components/ui/StatusBadge';
import PageHeader from '../components/ui/PageHeader';

export default function TrialCustomers() {
  const { customers, convertToSubscription } = useCustomers();
  const [convertId, setConvertId] = useState<string | null>(null);
  const [convertType, setConvertType] = useState<'monthly' | 'yearly'>('monthly');

  const trialCustomers = customers.filter(c => c.status === 'trial' || c.status === 'expiring_soon');
  const expiringSoon = trialCustomers.filter(c => { const r = getRemainingDays(c.trialEndDate); return r >= 0 && r <= 3; });
  const expired = customers.filter(c => c.status === 'expired' && c.subscriptionType === 'trial');
  const active = trialCustomers.filter(c => getRemainingDays(c.trialEndDate) > 3);

  const handleConvert = () => {
    if (convertId) convertToSubscription(convertId, convertType);
    setConvertId(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Trial Customers" subtitle={`${trialCustomers.length} trial accounts`} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Trials', count: active.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Expiring Soon', count: expiringSoon.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Trial Expired', count: expired.length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {expiringSoon.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{expiringSoon.length} trial(s) expiring within 3 days</p>
            <p className="text-xs text-amber-600 mt-0.5">Consider converting them to paid subscriptions.</p>
          </div>
        </div>
      )}

      {trialCustomers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Clock size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No trial customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trialCustomers.map(c => {
            const remaining = getRemainingDays(c.trialEndDate);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {c.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{c.fullName}</p>
                      <p className="text-xs text-slate-400">{c.mobile}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Trial Start</p>
                    <p className="font-medium text-slate-700">{formatDate(c.trialStartDate)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-slate-400">Trial End</p>
                    <p className="font-medium text-slate-700">{formatDate(c.trialEndDate)}</p>
                  </div>
                </div>

                <div className={`mt-3 flex items-center justify-between rounded-xl px-3 py-2 ${remaining < 0 ? 'bg-red-50' : remaining <= 3 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                  <div className="flex items-center gap-1.5">
                    {remaining < 0 ? <AlertTriangle size={13} className="text-red-500" /> : remaining <= 3 ? <Clock size={13} className="text-amber-500" /> : <CheckCircle size={13} className="text-emerald-500" />}
                    <span className={`text-xs font-semibold ${remaining < 0 ? 'text-red-600' : remaining <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {remaining < 0 ? 'Trial Expired' : remaining === 0 ? 'Expires Today' : `${remaining} days left`}
                    </span>
                  </div>
                  <button onClick={() => setConvertId(c.id)} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Convert <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {convertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConvertId(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Convert to Subscription</h3>
            <p className="text-sm text-slate-500 mb-5">Select a subscription plan for this customer.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {(['monthly', 'yearly'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setConvertType(t)}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all ${convertType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <p className="capitalize">{t}</p>
                  <p className="text-xs font-normal mt-0.5 opacity-70">{t === 'monthly' ? '30 days' : '365 days'}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConvertId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleConvert} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">Convert</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
