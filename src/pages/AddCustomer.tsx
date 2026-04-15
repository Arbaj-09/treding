import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Save } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { generatePassword as _generatePassword } from '../utils/generateLoginId';
import { todayStr } from '../utils/helpers';
import PageHeader from '../components/ui/PageHeader';

export default function AddCustomer() {
  const { addCustomer } = useCustomers();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    trialStartDate: todayStr(), subscriptionType: 'trial' as const,
  });
  const [preview, setPreview] = useState<{ loginId: string; password: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email';
    if (!form.trialStartDate) e.trialStartDate = 'Trial start date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const customer = addCustomer(form);
    setPreview({ loginId: customer.loginId, password: customer.password });
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (preview) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Save size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Customer Created!</h2>
          <p className="text-sm text-slate-500 mb-6">Share these credentials with the customer</p>
          <div className="space-y-3 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Login ID</p>
              <p className="text-2xl font-bold font-mono text-blue-600">{preview.loginId}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Password</p>
              <p className="text-2xl font-bold font-mono text-indigo-600">{preview.password}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setPreview(null); setForm({ fullName: '', mobile: '', email: '', trialStartDate: todayStr(), subscriptionType: 'trial' }); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Add Another
            </button>
            <button onClick={() => navigate('/customers')} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
              View Customers
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <PageHeader
        title="Add New Customer"
        subtitle="Create a new customer account"
        actions={
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        }
      />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="e.g. Rajesh Kumar" className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number *</label>
              <input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="10-digit mobile" maxLength={10} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.mobile ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="customer@email.com" type="email" className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Trial Start Date *</label>
              <input value={form.trialStartDate} onChange={e => set('trialStartDate', e.target.value)} type="date" className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.trialStartDate ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {errors.trialStartDate && <p className="text-xs text-red-500 mt-1">{errors.trialStartDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subscription Type</label>
              <select value={form.subscriptionType} onChange={e => set('subscriptionType', e.target.value)} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                <option value="trial">Trial (14 days)</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Auto-generate notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
              <RefreshCw size={14} /> Auto-Generated Credentials
            </p>
            <p className="text-xs text-blue-600">Login ID and Password will be automatically generated upon saving.</p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs bg-white border border-blue-200 rounded-lg px-2 py-1 font-mono text-blue-700">CUST####</span>
              <span className="text-xs bg-white border border-blue-200 rounded-lg px-2 py-1 font-mono text-blue-700">PASS####</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
