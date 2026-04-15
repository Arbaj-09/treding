import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function Profile() {
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@stockcrm.com', role: 'Master Admin', phone: '9999999999' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState('');

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (passwords.current !== 'admin123') { setPassError('Current password is incorrect'); return; }
    if (passwords.newPass.length < 6) { setPassError('New password must be at least 6 characters'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError('Passwords do not match'); return; }
    setPassSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassSaved(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Admin Profile" subtitle="Manage your account details" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto">A</div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
              <Camera size={14} className="text-slate-500" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{profile.name}</h3>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Shield size={12} /> {profile.role}
          </div>
          <div className="mt-4 space-y-2 text-left">
            {[
              { icon: User, label: 'Username', value: 'admin' },
              { icon: Mail, label: 'Email', value: profile.email },
              { icon: Shield, label: 'Role', value: profile.role },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                <Icon size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Update Profile</h3>
            {profileSaved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <Save size={14} className="text-emerald-600" />
                <p className="text-sm text-emerald-700">Profile updated successfully!</p>
              </motion.div>
            )}
            <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Phone', key: 'phone' },
                { label: 'Email', key: 'email' },
                { label: 'Role', key: 'role', disabled: true },
              ].map(({ label, key, disabled }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    value={(profile as Record<string, string>)[key]}
                    onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                    disabled={disabled}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${disabled ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Change Password</h3>
            {passSaved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <Save size={14} className="text-emerald-600" />
                <p className="text-sm text-emerald-700">Password changed successfully!</p>
              </motion.div>
            )}
            {passError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <p className="text-sm text-red-600">{passError}</p>
              </div>
            )}
            <form onSubmit={savePassword} className="space-y-4">
              {[
                { label: 'Current Password', key: 'current' },
                { label: 'New Password', key: 'newPass' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={(passwords as Record<string, string>)[key]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                  {key === 'current' && (
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              ))}
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
