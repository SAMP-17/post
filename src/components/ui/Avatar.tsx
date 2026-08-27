import { classNames } from '@/lib/utils';

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };
  const initials = name
    .replace(/^Dr\.\s*/i, '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className={classNames(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        color,
        className,
      )}
    >
      {initials}
    </div>
  );
}
