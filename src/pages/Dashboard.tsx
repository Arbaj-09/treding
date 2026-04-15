import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Clock, CreditCard, TrendingUp, AlertTriangle, UserCheck, UserPlus, RefreshCw } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import StatCard from '../components/ui/StatCard';
import { getRemainingDays, formatTimeAgo } from '../utils/helpers';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { mockReports } from '../data/mockReports';

export default function Dashboard() {
  const { customers, activities } = useCustomers();

  const total = customers.length;
  const trial = customers.filter(c => c.status === 'trial' || c.status === 'expiring_soon').length;
  const active = customers.filter(c => c.status === 'active').length;
  const monthly = customers.filter(c => c.subscriptionType === 'monthly' && c.status === 'active').length;
  const yearly = customers.filter(c => c.subscriptionType === 'yearly' && c.status === 'active').length;
  const expired = customers.filter(c => c.status === 'expired').length;
  const expiringSoon = customers.filter(c => c.status === 'expiring_soon' || (c.status === 'trial' && getRemainingDays(c.trialEndDate) <= 3)).length;

  const stats = [
    { title: 'Total Customers', value: total, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+12% this month', trendUp: true },
    { title: 'Trial Customers', value: trial, icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50', trend: `${expiringSoon} expiring soon`, trendUp: false },
    { title: 'Active Subscribers', value: active, icon: UserCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: '+8% this month', trendUp: true },
    { title: 'Monthly Plans', value: monthly, icon: CreditCard, color: 'text-sky-600', bgColor: 'bg-sky-50' },
    { title: 'Yearly Plans', value: yearly, icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-50', trend: '+15% this month', trendUp: true },
    { title: 'Expired', value: expired, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50', trend: 'Needs attention', trendUp: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={s.title} {...s} delay={i * 0.05} />)}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/customers/add" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
          <UserPlus size={16} /> Add Customer
        </Link>
        <Link to="/trial-customers" className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors">
          <Clock size={16} /> View Trials
        </Link>
        <Link to="/subscriptions" className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors">
          <RefreshCw size={16} /> Manage Subscriptions
        </Link>
        <Link to="/reports" className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors">
          <TrendingUp size={16} /> View Reports
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockReports.customerGrowth}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2.5} fill="url(#cg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockReports.revenue.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`₹${Number(v ?? 0).toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="monthly" name="Monthly" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yearly" name="Yearly" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Trial Conversion + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial Conversion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Trial Conversion Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockReports.trialConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="trials" name="Trials" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="converted" name="Converted" stroke="#34d399" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Recent Activity</h3>
            <Link to="/activity-logs" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[200px] scrollbar-thin">
            {activities.slice(0, 8).map(a => (
              <div key={a.id} className="flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === 'customer_added' ? 'bg-emerald-400' :
                  a.type === 'subscription_renewed' || a.type === 'subscription_activated' ? 'bg-blue-400' :
                  a.type === 'trial_expired' || a.type === 'customer_deleted' ? 'bg-red-400' : 'bg-slate-300'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">{a.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
