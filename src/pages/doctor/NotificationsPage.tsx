import { useState } from 'react';
import {
  Bell, Pill, CalendarClock, Activity, AlertTriangle, Settings, Check, CheckCheck,
} from 'lucide-react';
import { doctorNotifications } from '@/data/mockData';
import { classNames } from '@/lib/utils';
import type { Notification } from '@/types';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; bg: string; text: string }> = {
  medication: { icon: Pill, bg: 'bg-teal-50', text: 'text-teal-600' },
  appointment: { icon: CalendarClock, bg: 'bg-primary-50', text: 'text-primary-600' },
  recovery: { icon: Activity, bg: 'bg-accent-50', text: 'text-accent-600' },
  alert: { icon: AlertTriangle, bg: 'bg-error-50', text: 'text-error-600' },
  system: { icon: Bell, bg: 'bg-slate-100', text: 'text-slate-500' },
};

const categories = [
  { key: 'all', label: 'All' },
  { key: 'alert', label: 'Risk Alerts' },
  { key: 'recovery', label: 'Recovery Updates' },
  { key: 'appointment', label: 'Appointments' },
  { key: 'system', label: 'System' },
];

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState(doctorNotifications);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-500">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={markAllRead} className="btn-secondary"><CheckCheck className="h-4 w-4" /> Mark All as Read</button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.key} onClick={() => setFilter(c.key)} className={classNames('rounded-xl border px-4 py-2 text-sm font-medium transition', filter === c.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300')}>{c.label}</button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No notifications in this category.</p>
          </div>
        ) : filtered.map((n) => {
          const cfg = typeConfig[n.type];
          return (
            <div key={n.id} className={classNames('card flex items-start gap-4 p-4 transition', !n.read && 'ring-1 ring-primary-200')}>
              <div className={classNames('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', cfg.bg)}>
                <cfg.icon className={classNames('h-5 w-5', cfg.text)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Mark as Read">
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Notification settings link */}
      <div className="card flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-800">Notification Preferences</p>
            <p className="text-sm text-slate-500">Manage which notifications you receive</p>
          </div>
        </div>
        <a href="/doctor/profile" className="btn-secondary">Manage</a>
      </div>
    </div>
  );
}
