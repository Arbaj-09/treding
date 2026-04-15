import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Customer, CustomerStatus } from '../data/mockCustomers';
import { mockCustomers } from '../data/mockCustomers';
import { mockActivities } from '../data/mockActivities';
import type { ActivityLog } from '../data/mockActivities';
import { generateLoginId, generatePassword } from '../utils/generateLoginId';
import { addDays, todayStr, getRemainingDays } from '../utils/helpers';

interface CustomerContextType {
  customers: Customer[];
  activities: ActivityLog[];
  addCustomer: (data: Omit<Customer, 'id' | 'loginId' | 'password' | 'status' | 'createdAt' | 'trialEndDate'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  convertToSubscription: (id: string, type: 'monthly' | 'yearly') => void;
  renewSubscription: (id: string) => void;
  markExpired: (id: string) => void;
  upgradeToYearly: (id: string) => void;
  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivities);

  const logActivity = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = { ...log, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setActivities(prev => [newLog, ...prev]);
  }, []);

  const addCustomer = useCallback((data: Omit<Customer, 'id' | 'loginId' | 'password' | 'status' | 'createdAt' | 'trialEndDate'>) => {
    const loginId = generateLoginId();
    const password = generatePassword();
    const trialEndDate = addDays(data.trialStartDate, 14);
    const remaining = getRemainingDays(trialEndDate);
    const status: CustomerStatus = remaining <= 3 ? 'expiring_soon' : 'trial';
    const newCustomer: Customer = { ...data, id: Date.now().toString(), loginId, password, trialEndDate, status, createdAt: todayStr() };
    setCustomers(prev => [newCustomer, ...prev]);
    logActivity({ type: 'customer_added', message: `New customer ${data.fullName} (${loginId}) added`, user: 'Admin' });
    return newCustomer;
  }, [logActivity]);

  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    logActivity({ type: 'customer_edited', message: `Customer details updated for ${data.fullName || id}`, user: 'Admin' });
  }, [logActivity]);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => {
      const c = prev.find(x => x.id === id);
      if (c) logActivity({ type: 'customer_deleted', message: `Customer ${c.fullName} (${c.loginId}) removed`, user: 'Admin' });
      return prev.filter(x => x.id !== id);
    });
  }, [logActivity]);

  const convertToSubscription = useCallback((id: string, type: 'monthly' | 'yearly') => {
    const days = type === 'monthly' ? 30 : 365;
    const start = todayStr();
    const end = addDays(start, days);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, subscriptionType: type, status: 'active', subscriptionStartDate: start, subscriptionEndDate: end } : c));
    const c = customers.find(x => x.id === id);
    if (c) logActivity({ type: 'subscription_activated', message: `${type} subscription activated for ${c.fullName} (${c.loginId})`, user: 'Admin' });
  }, [customers, logActivity]);

  const renewSubscription = useCallback((id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c;
      const days = c.subscriptionType === 'yearly' ? 365 : 30;
      const start = todayStr();
      const end = addDays(start, days);
      return { ...c, status: 'active', subscriptionStartDate: start, subscriptionEndDate: end };
    }));
    const c = customers.find(x => x.id === id);
    if (c) logActivity({ type: 'subscription_renewed', message: `Subscription renewed for ${c.fullName} (${c.loginId})`, user: 'Admin' });
  }, [customers, logActivity]);

  const markExpired = useCallback((id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'expired' } : c));
  }, []);

  const upgradeToYearly = useCallback((id: string) => {
    const start = todayStr();
    const end = addDays(start, 365);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, subscriptionType: 'yearly', status: 'active', subscriptionStartDate: start, subscriptionEndDate: end } : c));
    const c = customers.find(x => x.id === id);
    if (c) logActivity({ type: 'subscription_renewed', message: `Upgraded to Yearly plan for ${c.fullName} (${c.loginId})`, user: 'Admin' });
  }, [customers, logActivity]);

  return (
    <CustomerContext.Provider value={{ customers, activities, addCustomer, updateCustomer, deleteCustomer, convertToSubscription, renewSubscription, markExpired, upgradeToYearly, logActivity }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider');
  return ctx;
};
