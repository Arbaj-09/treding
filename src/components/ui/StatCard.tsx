import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, color, bgColor, trend, trendUp, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: '0 8px 40px 0 rgba(0,0,0,0.10)' }}
      className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </motion.div>
  );
}
