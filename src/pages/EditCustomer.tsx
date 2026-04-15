import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import PageHeader from '../components/ui/PageHeader';
import type { CustomerStatus, SubscriptionType } from '../data/mockCustomers';

export default function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const { customers, updateCustomer } = useCustomers();
  const navigate = useNavigate();
  const customer = customers.find(c => c.id === id);

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', loginId: '', password: '',
    trialStartDate: '', trialEndDate: '', subscriptionType: 'trial' as SubscriptionType,
    status: 'trial' as CustomerStatus, subscriptionStartDate: '', subscriptionEndDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer.fullName, mobile: customer.mobile, email: customer.email,
        loginId: customer.loginId, password: customer.password,
        trialStartDate: customer.trialStartDate, trialEndDate: customer.trialEndDate,
        subscriptionType: customer.subscriptionType, status: customer.status,
        subscriptionStartDate: customer.subscriptionStartDate || '',
        subscriptionEndDate: customer.subscriptionEndDate || '',
      });
    }
  }, [customer]);

  if (!customer) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Customer not found.</p>
      <button onClick={() => navigate('/customers')} className="mt-4 text-blue-600 text-sm hover:underline">Back to Customers</button>
    </div>
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    updateCustomer(id!, form);
    setSaved(true);
    setTimeout(() => navigate('/customers'), 1500);
  };

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const Field = ({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && ' *'}</label>
      <input
        type={type}
        value={(form as Record<string, string>)[name]}
        onChange={e => set(name, e.target.value)}
        className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <PageHeader
        title="Edit Customer"
        subtitle={`Editing: ${customer.fullName}`}
        actions={
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        }
      />

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <Save size={16} className="text-emerald-600" />
          <p className="text-sm text-emerald-700 font-medium">Changes saved successfully! Redirecting...</p>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" name="fullName" required />
            <Field label="Mobile Number" name="mobile" required />
            <div className="sm:col-span-2"><Field label="Email Address" name="email" type="email" required /></div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Login ID</label>
              <input value={form.loginId} readOnly className="w-full border border-slate-200 bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-500 cursor-not-allowed" />
            </div>
            <Field label="Password" name="password" />
            <Field label="Trial Start Date" name="trialStartDate" type="date" />
            <Field label="Trial End Date" name="trialEndDate" type="date" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subscription Type</label>
              <select value={form.subscriptionType} onChange={e => set('subscriptionType', e.target.value)} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                <option value="trial">Trial</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <Field label="Subscription Start" name="subscriptionStartDate" type="date" />
            <Field label="Subscription End" name="subscriptionEndDate" type="date" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
