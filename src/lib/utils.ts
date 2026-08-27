import type { RiskLevel } from '@/types';

export function classNames(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function avatarColor(name: string): string {
  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-teal-100 text-teal-700',
    'bg-accent-100 text-accent-700',
    'bg-success-100 text-success-700',
    'bg-warning-100 text-warning-700',
    'bg-rose-100 text-rose-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const riskConfig: Record<RiskLevel, { label: string; badge: string; dot: string; bar: string; text: string }> = {
  low: { label: 'Low', badge: 'bg-success-100 text-success-700', dot: 'bg-success-500', bar: 'bg-success-500', text: 'text-success-700' },
  medium: { label: 'Medium', badge: 'bg-warning-100 text-warning-700', dot: 'bg-warning-500', bar: 'bg-warning-500', text: 'text-warning-700' },
  high: { label: 'High', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', bar: 'bg-orange-500', text: 'text-orange-700' },
  critical: { label: 'Critical', badge: 'bg-error-100 text-error-700', dot: 'bg-error-500', bar: 'bg-error-500', text: 'text-error-700' },
};

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}
