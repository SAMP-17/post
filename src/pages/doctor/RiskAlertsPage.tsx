import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, Phone, Eye, Check, Clock, Activity } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { riskAlerts, patients } from '@/data/mockData';
import { riskConfig, classNames } from '@/lib/utils';
import type { RiskLevel } from '@/types';

const levelFilters: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'All Levels' },
  { key: 'critical', label: 'Critical' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

const statusFilters = ['all', 'active', 'reviewed', 'resolved'];

export default function RiskAlertsPage() {
  const [alerts, setAlerts] = useState(riskAlerts);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levelFilter === 'all' || a.level === levelFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchLevel && matchStatus;
    });
  }, [alerts, search, levelFilter, statusFilter]);

  const critical = alerts.filter((a) => a.level === 'critical' && a.status === 'active').length;
  const high = alerts.filter((a) => a.level === 'high' && a.status === 'active').length;
  const medium = alerts.filter((a) => a.level === 'medium' && a.status === 'active').length;
  const resolved = alerts.filter((a) => a.status === 'resolved').length;

  const markReviewed = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'reviewed' } : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Alerts</h1>
        <p className="mt-1 text-slate-500">Monitor and respond to patient risk alerts in real time.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Critical Alerts" value={critical} icon={AlertTriangle} color="error" />
        <StatCard label="High Risk" value={high} icon={AlertTriangle} color="warning" />
        <StatCard label="Medium Risk" value={medium} icon={Activity} color="accent" />
        <StatCard label="Resolved" value={resolved} icon={Check} color="success" />
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search alerts by patient or symptom..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            {levelFilters.map((f) => (
              <button key={f.key} onClick={() => setLevelFilter(f.key)} className={classNames('rounded-lg border px-3 py-2 text-sm font-medium transition', levelFilter === f.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300')}>{f.label}</button>
            ))}
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input min-w-[130px]">
            {statusFilters.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Alert cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No alerts match your filters.</p>
          </div>
        ) : filtered.map((alert) => {
          const patient = patients.find((p) => p.id === alert.patientId);
          return (
            <div key={alert.id} className={classNames('card overflow-hidden border-l-4', alert.level === 'critical' ? 'border-l-error-500' : alert.level === 'high' ? 'border-l-orange-500' : alert.level === 'medium' ? 'border-l-warning-500' : 'border-l-success-500')}>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {patient && <Avatar name={alert.patientName} size="md" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{alert.patientName}</p>
                        <span className={classNames('badge', riskConfig[alert.level].badge)}>
                          <span className={classNames('h-1.5 w-1.5 rounded-full', riskConfig[alert.level].dot)} />
                          {riskConfig[alert.level].label} Risk
                        </span>
                        <span className={classNames('badge', alert.status === 'active' ? 'bg-error-50 text-error-600' : alert.status === 'reviewed' ? 'bg-warning-50 text-warning-600' : 'bg-success-50 text-success-600')}>{alert.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{alert.summary}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {alert.reportedAt}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {alert.symptoms.map((s, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{s}</span>
                  ))}
                </div>

                {patient && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>Surgery: {patient.surgery}</span>
                    <span>Recovery: {patient.recovery}%</span>
                    <span>Age: {patient.age}</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/doctor/patients/${alert.patientId}`} className="btn-primary px-4 py-2 text-sm"><Eye className="h-4 w-4" /> View Patient</Link>
                  <button className="btn-secondary px-4 py-2 text-sm"><Phone className="h-4 w-4" /> Contact Patient</button>
                  {alert.status === 'active' && (
                    <button onClick={() => markReviewed(alert.id)} className="btn bg-success-50 text-success-700 hover:bg-success-100 px-4 py-2 text-sm"><Check className="h-4 w-4" /> Mark as Reviewed</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
