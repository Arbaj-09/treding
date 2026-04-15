export interface ActivityLog {
  id: string;
  type: 'customer_added' | 'customer_edited' | 'subscription_renewed' | 'trial_expired' | 'admin_login' | 'subscription_activated' | 'customer_deleted';
  message: string;
  user: string;
  timestamp: string;
}

const now = new Date();
const t = (minutesAgo: number) => {
  const dt = new Date(now);
  dt.setMinutes(dt.getMinutes() - minutesAgo);
  return dt.toISOString();
};

export const mockActivities: ActivityLog[] = [
  { id: '1', type: 'admin_login', message: 'Admin logged into the system', user: 'Admin', timestamp: t(5) },
  { id: '2', type: 'customer_added', message: 'New customer Pooja Agarwal (CUST1015) added', user: 'Admin', timestamp: t(30) },
  { id: '3', type: 'subscription_renewed', message: 'Subscription renewed for Rajesh Kumar (CUST1001) - Yearly Plan', user: 'Admin', timestamp: t(90) },
  { id: '4', type: 'trial_expired', message: 'Trial expired for Kiran Rao (CUST1013)', user: 'System', timestamp: t(180) },
  { id: '5', type: 'customer_edited', message: 'Customer details updated for Meena Joshi (CUST1006)', user: 'Admin', timestamp: t(240) },
  { id: '6', type: 'subscription_activated', message: 'Monthly subscription activated for Meena Joshi (CUST1006)', user: 'Admin', timestamp: t(300) },
  { id: '7', type: 'customer_added', message: 'New customer Rohit Gupta (CUST1011) added', user: 'Admin', timestamp: t(480) },
  { id: '8', type: 'trial_expired', message: 'Trial expired for Deepa Menon (CUST1010)', user: 'System', timestamp: t(720) },
  { id: '9', type: 'subscription_renewed', message: 'Subscription renewed for Kavita Reddy (CUST1008) - Yearly Plan', user: 'Admin', timestamp: t(1440) },
  { id: '10', type: 'customer_edited', message: 'Password reset for Vikram Singh (CUST1005)', user: 'Admin', timestamp: t(2160) },
  { id: '11', type: 'customer_added', message: 'New customer Arjun Nair (CUST1007) added', user: 'Admin', timestamp: t(2880) },
  { id: '12', type: 'subscription_activated', message: 'Yearly subscription activated for Anita Desai (CUST1012)', user: 'Admin', timestamp: t(4320) },
  { id: '13', type: 'admin_login', message: 'Admin logged into the system', user: 'Admin', timestamp: t(5760) },
  { id: '14', type: 'customer_deleted', message: 'Customer account removed from system', user: 'Admin', timestamp: t(7200) },
  { id: '15', type: 'trial_expired', message: 'Trial expired for Sunita Verma (CUST1004)', user: 'System', timestamp: t(8640) },
];
