import type { LucideIcon } from 'lucide-react';
import { classNames } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'teal' | 'warning' | 'error' | 'success' | 'accent';
  onClick?: () => void;
}

const colorMap = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', ring: 'ring-primary-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-100' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', ring: 'ring-warning-100' },
  error: { bg: 'bg-error-50', text: 'text-error-600', ring: 'ring-error-100' },
  success: { bg: 'bg-success-50', text: 'text-success-600', ring: 'ring-success-100' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', ring: 'ring-accent-100' },
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'primary', onClick }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={classNames(
        'card p-5 transition-all',
        onClick && 'cursor-pointer hover:shadow-soft hover:-translate-y-0.5',
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={classNames('flex h-11 w-11 items-center justify-center rounded-xl ring-4', c.bg, c.ring)}>
          <Icon className={classNames('h-5 w-5', c.text)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={classNames(
              'text-xs font-semibold',
              trendUp ? 'text-success-600' : 'text-slate-400',
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
