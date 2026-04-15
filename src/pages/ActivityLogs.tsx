import { motion } from 'framer-motion';
import { UserPlus, Pencil, RefreshCw, AlertTriangle, LogIn, Trash2, CheckCircle } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { formatTimeAgo } from '../utils/helpers';
import type { ActivityLog } from '../data/mockActivities';
import PageHeader from '../components/ui/PageHeader';

const iconMap: Record<ActivityLog['type'], { icon: React.ElementType; color: string; bg: string }> = {
  customer_added: { icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  customer_edited: { icon: Pencil, color: 'text-amber-600', bg: 'bg-amber-100' },
  subscription_renewed: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100' },
  subscription_activated: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  trial_expired: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' },
  admin_login: { icon: LogIn, color: 'text-slate-600', bg: 'bg-slate-100' },
  customer_deleted: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-100' },
};

export default function ActivityLogs() {
  const { activities } = useCustomers();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Activity Logs" subtitle={`${activities.length} total activities`} />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />
          <div className="space-y-1">
            {activities.map((a, i) => {
              const { icon: Icon, color, bg } = iconMap[a.type] || iconMap.admin_login;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-4 pl-2 py-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10 relative`}>
                    <Icon size={13} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{a.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{formatTimeAgo(a.timestamp)}</span>
                      <span className="text-slate-200">•</span>
                      <span className="text-xs text-slate-400">by {a.user}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 whitespace-nowrap hidden sm:block">
                    {new Date(a.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
