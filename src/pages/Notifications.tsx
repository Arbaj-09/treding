import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, UserPlus, CheckCircle, X } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { getRemainingDays, formatDate } from '../utils/helpers';
import PageHeader from '../components/ui/PageHeader';

interface NotifCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  time?: string;
  onDismiss: () => void;
}

const NotifCard = ({ icon: Icon, iconColor, iconBg, title, subtitle, time, onDismiss }: NotifCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors group"
  >
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={16} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      {time && <p className="text-xs text-slate-400 mt-1">{time}</p>}
    </div>
    <button onClick={onDismiss} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 transition-all text-slate-400">
      <X size={13} />
    </button>
  </motion.div>
);

export default function Notifications() {
  const { customers } = useCustomers();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const dismiss = (id: string) => setDismissed(p => new Set([...p, id]));

  const expiringSoon = customers.filter(c =>
    (c.status === 'trial' || c.status === 'expiring_soon') &&
    getRemainingDays(c.trialEndDate) >= 0 &&
    getRemainingDays(c.trialEndDate) <= 3 &&
    !dismissed.has(`trial-${c.id}`)
  );

  const expiredSubs = customers.filter(c =>
    c.status === 'expired' && !dismissed.has(`expired-${c.id}`)
  );

  const recentCustomers = customers.filter(c => {
    const days = Math.abs(getRemainingDays(c.createdAt));
    return days <= 7 && !dismissed.has(`new-${c.id}`);
  }).slice(0, 5);

  const total = expiringSoon.length + expiredSubs.length + recentCustomers.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Notifications Center"
        subtitle={`${total} active notifications`}
        actions={
          total > 0 ? (
            <button
              onClick={() => customers.forEach(c => { dismiss(`trial-${c.id}`); dismiss(`expired-${c.id}`); dismiss(`new-${c.id}`); })}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear all
            </button>
          ) : undefined
        }
      />

      {total === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">All caught up!</p>
          <p className="text-sm text-slate-400 mt-1">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expiringSoon.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Clock size={15} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-700">Trial Expiry Reminders</h3>
                <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{expiringSoon.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {expiringSoon.map(c => {
                  const r = getRemainingDays(c.trialEndDate);
                  return (
                    <NotifCard
                      key={c.id}
                      icon={Clock}
                      iconColor="text-amber-600"
                      iconBg="bg-amber-100"
                      title={`${c.fullName}'s trial ${r === 0 ? 'expires today' : `expires in ${r} day${r !== 1 ? 's' : ''}`}`}
                      subtitle={`${c.loginId} • Trial ends ${formatDate(c.trialEndDate)}`}
                      onDismiss={() => dismiss(`trial-${c.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {expiredSubs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-500" />
                <h3 className="text-sm font-semibold text-slate-700">Expired Subscriptions</h3>
                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{expiredSubs.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {expiredSubs.map(c => (
                  <NotifCard
                    key={c.id}
                    icon={AlertTriangle}
                    iconColor="text-red-500"
                    iconBg="bg-red-100"
                    title={`${c.fullName}'s subscription has expired`}
                    subtitle={`${c.loginId} • ${c.subscriptionType} plan expired`}
                    onDismiss={() => dismiss(`expired-${c.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {recentCustomers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <UserPlus size={15} className="text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-700">New Customers (Last 7 days)</h3>
                <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{recentCustomers.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {recentCustomers.map(c => (
                  <NotifCard
                    key={c.id}
                    icon={UserPlus}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-100"
                    title={`New customer: ${c.fullName}`}
                    subtitle={`${c.loginId} • ${c.subscriptionType} plan`}
                    time={`Joined ${formatDate(c.createdAt)}`}
                    onDismiss={() => dismiss(`new-${c.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
