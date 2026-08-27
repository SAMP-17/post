import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ size = 'md', showText = true, light = false }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean; light?: boolean }) {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-lg' },
    md: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-xl' },
    lg: { box: 'h-14 w-14', icon: 'h-7 w-7', text: 'text-2xl' },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className={`relative flex ${s.box} items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-lg shadow-primary-500/20`}>
        <Activity className={`${s.icon} text-white`} strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            Care<span className="text-teal-500">Track</span>
          </span>
        </div>
      )}
    </Link>
  );
}
