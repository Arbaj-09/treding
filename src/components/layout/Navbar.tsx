import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers.tsx';
import { getRemainingDays } from '../../utils/helpers';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const { customers } = useCustomers();

  const alertCount = customers.filter(c => c.status === 'expiring_soon' || (c.status === 'trial' && getRemainingDays(c.trialEndDate) <= 3)).length;

  const handleLogout = () => {
    localStorage.removeItem('crm_auth');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-6 h-16 flex items-center gap-4 flex-shrink-0 z-10">
      <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        <Search size={16} className="text-slate-400 flex-shrink-0" />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search customers, subscriptions..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link to="/notifications" className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <Bell size={20} />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">Admin</p>
              <p className="text-xs text-slate-400">Master Admin</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <User size={15} /> Profile
              </Link>
              <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings size={15} /> Settings
              </Link>
              <hr className="my-1 border-slate-100" />
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
