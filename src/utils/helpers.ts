import type { CustomerStatus, SubscriptionType } from '../data/mockCustomers';

export const getRemainingDays = (endDate: string): number => {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatTimeAgo = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const getStatusColor = (status: CustomerStatus): string => {
  const map: Record<CustomerStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    trial: 'bg-blue-100 text-blue-700 border-blue-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    expiring_soon: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return map[status];
};

export const getStatusLabel = (status: CustomerStatus): string => {
  const map: Record<CustomerStatus, string> = {
    active: 'Active',
    trial: 'Trial',
    expired: 'Expired',
    expiring_soon: 'Expiring Soon',
  };
  return map[status];
};

export const getSubTypeColor = (type: SubscriptionType): string => {
  const map: Record<SubscriptionType, string> = {
    trial: 'bg-purple-100 text-purple-700 border-purple-200',
    monthly: 'bg-sky-100 text-sky-700 border-sky-200',
    yearly: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };
  return map[type];
};

export const addDays = (date: string, days: number): string => {
  const dt = new Date(date);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split('T')[0];
};

export const todayStr = (): string => new Date().toISOString().split('T')[0];
