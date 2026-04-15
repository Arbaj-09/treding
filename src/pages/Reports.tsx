import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { mockReports } from '../data/mockReports';
import PageHeader from '../components/ui/PageHeader';

const COLORS = ['#3b82f6', '#34d399', '#f59e0b', '#ef4444'];

export default function Reports() {
  const conversionRate = mockReports.trialConversion.map(d => ({
    ...d,
    rate: Math.round((d.converted / d.trials) * 100),
  }));

  const pieData = [
    { name: 'Active', value: 8 },
    { name: 'Trial', value: 5 },
    { name: 'Expired', value: 2 },
  ];

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Reports & Analytics" subtitle="Comprehensive business insights" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Customer Growth (2024)">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockReports.customerGrowth}>
              <defs>
                <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2.5} fill="url(#cg2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Breakdown (₹)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockReports.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`₹${Number(v ?? 0).toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="monthly" name="Monthly" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yearly" name="Yearly" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trial Conversion Rate (%)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={conversionRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`${v ?? 0}%`, 'Conversion Rate']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="trials" name="Trials" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="converted" name="Converted" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rate" name="Rate %" stroke="#f59e0b" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expired Account Trend">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockReports.expiredTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="expired" name="Expired" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center">
            <PieChart width={200} height={160}>
              <Pie data={pieData} cx={100} cy={80} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }} />
            </PieChart>
            <div className="space-y-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-600">{d.name}: <strong>{d.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </motion.div>
  );
}
