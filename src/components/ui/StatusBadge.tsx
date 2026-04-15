import type { CustomerStatus, SubscriptionType } from '../../data/mockCustomers';
import { getStatusColor, getStatusLabel, getSubTypeColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: CustomerStatus;
}

interface SubTypeBadgeProps {
  type: SubscriptionType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

export function SubTypeBadge({ type }: SubTypeBadgeProps) {
  const labels: Record<SubscriptionType, string> = { trial: 'Trial', monthly: 'Monthly', yearly: 'Yearly' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSubTypeColor(type)}`}>
      {labels[type]}
    </span>
  );
}
