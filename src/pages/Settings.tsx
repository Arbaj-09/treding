import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, User, Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function Settings() {
  const [notifications, setNotifications] = useState({ trialExpiry: true, subscriptionExpiry: true, newCustomer: true, emailAlerts: false, smsAlerts: false });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '30', loginAlerts: true });
  const [theme, setTheme] = useState({ colorScheme: 'blue', compactMode: false, animations: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleRow = ({ label, desc, enabled, onToggle }: { label: string; desc?: string; enabled: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Settings" subtitle="Configure your CRM preferences" />

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <Save size={15} className="text-emerald-600" />
          <p className="text-sm text-emerald-700 font-medium">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section icon={Bell} title="Notification Settings">
          <ToggleRow label="Trial Expiry Reminders" desc="Alert when trial is about to expire" enabled={notifications.trialExpiry} onToggle={() => setNotifications(p => ({ ...p, trialExpiry: !p.trialExpiry }))} />
          <ToggleRow label="Subscription Expiry Alerts" desc="Alert when subscription expires" enabled={notifications.subscriptionExpiry} onToggle={() => setNotifications(p => ({ ...p, subscriptionExpiry: !p.subscriptionExpiry }))} />
          <ToggleRow label="New Customer Alerts" desc="Notify when a new customer is added" enabled={notifications.newCustomer} onToggle={() => setNotifications(p => ({ ...p, newCustomer: !p.newCustomer }))} />
          <ToggleRow label="Email Alerts" desc="Send alerts via email" enabled={notifications.emailAlerts} onToggle={() => setNotifications(p => ({ ...p, emailAlerts: !p.emailAlerts }))} />
          <ToggleRow label="SMS Alerts" desc="Send alerts via SMS" enabled={notifications.smsAlerts} onToggle={() => setNotifications(p => ({ ...p, smsAlerts: !p.smsAlerts }))} />
        </Section>

        <Section icon={Shield} title="Security Preferences">
          <ToggleRow label="Two-Factor Authentication" desc="Add extra security to your account" enabled={security.twoFactor} onToggle={() => setSecurity(p => ({ ...p, twoFactor: !p.twoFactor }))} />
          <ToggleRow label="Login Activity Alerts" desc="Get notified of new logins" enabled={security.loginAlerts} onToggle={() => setSecurity(p => ({ ...p, loginAlerts: !p.loginAlerts }))} />
          <div className="py-3">
            <p className="text-sm font-medium text-slate-700 mb-2">Session Timeout</p>
            <select value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </Section>

        <Section icon={Palette} title="Theme Settings">
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Color Scheme</p>
            <div className="flex gap-2">
              {[
                { value: 'blue', color: 'bg-blue-500' },
                { value: 'indigo', color: 'bg-indigo-500' },
                { value: 'emerald', color: 'bg-emerald-500' },
                { value: 'violet', color: 'bg-violet-500' },
              ].map(c => (
                <button
                  key={c.value}
                  onClick={() => setTheme(p => ({ ...p, colorScheme: c.value }))}
                  className={`w-8 h-8 rounded-full ${c.color} transition-all ${theme.colorScheme === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>
          <ToggleRow label="Compact Mode" desc="Reduce spacing for more content" enabled={theme.compactMode} onToggle={() => setTheme(p => ({ ...p, compactMode: !p.compactMode }))} />
          <ToggleRow label="Animations" desc="Enable smooth page transitions" enabled={theme.animations} onToggle={() => setTheme(p => ({ ...p, animations: !p.animations }))} />
        </Section>

        <Section icon={User} title="Account Preferences">
          <div className="space-y-4">
            {[
              { label: 'Default Landing Page', options: ['Dashboard', 'Customers', 'Reports'] },
              { label: 'Date Format', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
              { label: 'Currency', options: ['INR (₹)', 'USD ($)', 'EUR (€)'] },
              { label: 'Items Per Page', options: ['8', '10', '20', '50'] },
            ].map(({ label, options }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <select className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Save size={16} /> Save All Settings
        </button>
      </div>
    </motion.div>
  );
}
