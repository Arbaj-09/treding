export type SubscriptionType = 'trial' | 'monthly' | 'yearly';
export type CustomerStatus = 'active' | 'trial' | 'expired' | 'expiring_soon';

export interface Customer {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  loginId: string;
  password: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionType: SubscriptionType;
  status: CustomerStatus;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  createdAt: string;
}

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

export const mockCustomers: Customer[] = [
  { id: '1', fullName: 'Rajesh Kumar', mobile: '9876543210', email: 'rajesh@email.com', loginId: 'CUST1001', password: 'PASSX82Q', trialStartDate: d(-30), trialEndDate: d(-16), subscriptionType: 'yearly', status: 'active', subscriptionStartDate: d(-15), subscriptionEndDate: d(350), createdAt: d(-30) },
  { id: '2', fullName: 'Priya Sharma', mobile: '9123456780', email: 'priya@email.com', loginId: 'CUST1002', password: 'PASSY91K', trialStartDate: d(-10), trialEndDate: d(4), subscriptionType: 'trial', status: 'trial', createdAt: d(-10) },
  { id: '3', fullName: 'Amit Patel', mobile: '9988776655', email: 'amit@email.com', loginId: 'CUST1003', password: 'PASSZ44M', trialStartDate: d(-45), trialEndDate: d(-31), subscriptionType: 'monthly', status: 'active', subscriptionStartDate: d(-30), subscriptionEndDate: d(0), createdAt: d(-45) },
  { id: '4', fullName: 'Sunita Verma', mobile: '8877665544', email: 'sunita@email.com', loginId: 'CUST1004', password: 'PASSA12B', trialStartDate: d(-60), trialEndDate: d(-46), subscriptionType: 'yearly', status: 'expired', subscriptionStartDate: d(-45), subscriptionEndDate: d(-10), createdAt: d(-60) },
  { id: '5', fullName: 'Vikram Singh', mobile: '7766554433', email: 'vikram@email.com', loginId: 'CUST1005', password: 'PASSB33C', trialStartDate: d(-7), trialEndDate: d(7), subscriptionType: 'trial', status: 'trial', createdAt: d(-7) },
  { id: '6', fullName: 'Meena Joshi', mobile: '9654321098', email: 'meena@email.com', loginId: 'CUST1006', password: 'PASSC55D', trialStartDate: d(-20), trialEndDate: d(-6), subscriptionType: 'monthly', status: 'active', subscriptionStartDate: d(-5), subscriptionEndDate: d(25), createdAt: d(-20) },
  { id: '7', fullName: 'Arjun Nair', mobile: '9543210987', email: 'arjun@email.com', loginId: 'CUST1007', password: 'PASSD77E', trialStartDate: d(-5), trialEndDate: d(9), subscriptionType: 'trial', status: 'trial', createdAt: d(-5) },
  { id: '8', fullName: 'Kavita Reddy', mobile: '8432109876', email: 'kavita@email.com', loginId: 'CUST1008', password: 'PASSE88F', trialStartDate: d(-90), trialEndDate: d(-76), subscriptionType: 'yearly', status: 'active', subscriptionStartDate: d(-75), subscriptionEndDate: d(290), createdAt: d(-90) },
  { id: '9', fullName: 'Suresh Iyer', mobile: '7321098765', email: 'suresh@email.com', loginId: 'CUST1009', password: 'PASSF99G', trialStartDate: d(-12), trialEndDate: d(2), subscriptionType: 'trial', status: 'expiring_soon', createdAt: d(-12) },
  { id: '10', fullName: 'Deepa Menon', mobile: '9210987654', email: 'deepa@email.com', loginId: 'CUST1010', password: 'PASSG11H', trialStartDate: d(-35), trialEndDate: d(-21), subscriptionType: 'monthly', status: 'expired', subscriptionStartDate: d(-20), subscriptionEndDate: d(-5), createdAt: d(-35) },
  { id: '11', fullName: 'Rohit Gupta', mobile: '8109876543', email: 'rohit@email.com', loginId: 'CUST1011', password: 'PASSH22I', trialStartDate: d(-3), trialEndDate: d(11), subscriptionType: 'trial', status: 'trial', createdAt: d(-3) },
  { id: '12', fullName: 'Anita Desai', mobile: '7098765432', email: 'anita@email.com', loginId: 'CUST1012', password: 'PASSI33J', trialStartDate: d(-55), trialEndDate: d(-41), subscriptionType: 'yearly', status: 'active', subscriptionStartDate: d(-40), subscriptionEndDate: d(325), createdAt: d(-55) },
  { id: '13', fullName: 'Kiran Rao', mobile: '9987654321', email: 'kiran@email.com', loginId: 'CUST1013', password: 'PASSJ44K', trialStartDate: d(-14), trialEndDate: d(0), subscriptionType: 'trial', status: 'expiring_soon', createdAt: d(-14) },
  { id: '14', fullName: 'Manoj Tiwari', mobile: '8876543210', email: 'manoj@email.com', loginId: 'CUST1014', password: 'PASSK55L', trialStartDate: d(-100), trialEndDate: d(-86), subscriptionType: 'monthly', status: 'active', subscriptionStartDate: d(-85), subscriptionEndDate: d(5), createdAt: d(-100) },
  { id: '15', fullName: 'Pooja Agarwal', mobile: '7765432109', email: 'pooja@email.com', loginId: 'CUST1015', password: 'PASSL66M', trialStartDate: d(-2), trialEndDate: d(12), subscriptionType: 'trial', status: 'trial', createdAt: d(-2) },
];
