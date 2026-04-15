import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers.tsx';
import { StatusBadge, SubTypeBadge } from '../components/ui/StatusBadge';
import SearchBar from '../components/ui/SearchBar';
import FilterDropdown from '../components/ui/FilterDropdown';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PageHeader from '../components/ui/PageHeader';
import { getRemainingDays, formatDate } from '../utils/helpers';
import type { CustomerStatus, SubscriptionType } from '../data/mockCustomers';

type SortKey = 'fullName' | 'createdAt' | 'status' | 'subscriptionType';
type SortDir = 'asc' | 'desc';

const PER_PAGE = 8;

export default function Customers() {
  const { customers, deleteCustomer } = useCustomers();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewCustomer, setViewCustomer] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) list = list.filter(c => c.fullName.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search) || c.loginId.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter);
    if (typeFilter !== 'all') list = list.filter(c => c.subscriptionType === typeFilter);
    list.sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [customers, search, statusFilter, typeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} className="opacity-30" />;

  const viewedCustomer = viewCustomer ? customers.find(c => c.id === viewCustomer) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Customer Management"
        subtitle={`${customers.length} total customers`}
        actions={
          <Link to="/customers/add" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <UserPlus size={16} /> Add Customer
          </Link>
        }
      />

      <div className="bg-white rounded-2xl shadow-card border border-slate-100">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search name, mobile, ID..." />
          <FilterDropdown
            value={statusFilter}
            onChange={v => { setStatusFilter(v); setPage(1); }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'trial', label: 'Trial' },
              { value: 'expiring_soon', label: 'Expiring Soon' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <FilterDropdown
            value={typeFilter}
            onChange={v => { setTypeFilter(v); setPage(1); }}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'trial', label: 'Trial' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  { label: 'Customer', key: 'fullName' as SortKey },
                  { label: 'Login ID', key: null },
                  { label: 'Mobile', key: null },
                  { label: 'Status', key: 'status' as SortKey },
                  { label: 'Plan', key: 'subscriptionType' as SortKey },
                  { label: 'Remaining', key: null },
                  { label: 'Joined', key: 'createdAt' as SortKey },
                  { label: 'Actions', key: null },
                ].map(col => (
                  <th
                    key={col.label}
                    onClick={() => col.key && toggleSort(col.key)}
                    className={`text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${col.key ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No customers found</td></tr>
              ) : paginated.map((c, i) => {
                const endDate = c.subscriptionEndDate || c.trialEndDate;
                const remaining = getRemainingDays(endDate);
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{c.fullName}</p>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">{c.loginId}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.mobile}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status as CustomerStatus} /></td>
                    <td className="px-4 py-3"><SubTypeBadge type={c.subscriptionType as SubscriptionType} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-500' : remaining <= 3 ? 'text-amber-500' : 'text-slate-700'}`}>
                        {remaining < 0 ? 'Expired' : `${remaining}d`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewCustomer(c.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/customers/edit/${c.id}`)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filtered.length} perPage={PER_PAGE} />
        </div>
      </div>

      {/* View Modal */}
      {viewedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewCustomer(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                {viewedCustomer.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{viewedCustomer.fullName}</h3>
                <p className="text-sm text-slate-500">{viewedCustomer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Login ID', viewedCustomer.loginId],
                ['Password', viewedCustomer.password],
                ['Mobile', viewedCustomer.mobile],
                ['Status', viewedCustomer.status],
                ['Plan', viewedCustomer.subscriptionType],
                ['Trial Start', formatDate(viewedCustomer.trialStartDate)],
                ['Trial End', formatDate(viewedCustomer.trialEndDate)],
                ['Joined', formatDate(viewedCustomer.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                  <p className="font-medium text-slate-700 capitalize">{v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setViewCustomer(null)} className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">Close</button>
          </motion.div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Customer"
        message="This action cannot be undone. The customer will be permanently removed."
        confirmLabel="Delete"
        danger
        onConfirm={() => { if (deleteId) deleteCustomer(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </motion.div>
  );
}
