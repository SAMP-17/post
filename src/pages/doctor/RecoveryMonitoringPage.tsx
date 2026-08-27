import { useState, useMemo } from 'react';
import { Activity, TrendingUp, AlertCircle, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { LineChart } from '@/components/ui/Charts';
import { patients, recoveryEntries } from '@/data/mockData';
import { riskConfig, classNames } from '@/lib/utils';
import type { RiskLevel } from '@/types';

const riskFilters: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High Risk' },
  { key: 'medium', label: 'Medium Risk' },
  { key: 'low', label: 'Low Risk' },
];

export default function RecoveryMonitoringPage() {
  const [filter, setFilter] = useState<RiskLevel | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchRisk = filter === 'all' || p.risk === filter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchRisk && matchSearch;
    });
  }, [filter, search]);

  const needsAttention = patients.filter((p) => p.risk === 'high' || p.risk === 'critical');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recovery Monitoring</h1>
        <p className="mt-1 text-slate-500">Monitor recovery progress and pain trends across all patients.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50"><TrendingUp className="h-5 w-5 text-primary-600" /></div>
            <div><p className="text-sm text-slate-500">Avg Recovery</p><p className="text-2xl font-bold text-slate-900">68%</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-50"><AlertCircle className="h-5 w-5 text-error-600" /></div>
            <div><p className="text-sm text-slate-500">Needs Attention</p><p className="text-2xl font-bold text-slate-900">{needsAttention.length}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50"><Activity className="h-5 w-5 text-warning-600" /></div>
            <div><p className="text-sm text-slate-500">Avg Pain Level</p><p className="text-2xl font-bold text-slate-900">4.2</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50"><TrendingUp className="h-5 w-5 text-success-600" /></div>
            <div><p className="text-sm text-slate-500">Improving</p><p className="text-2xl font-bold text-slate-900">12</p></div>
          </div>
        </div>
      </div>

      {/* Overall trend chart */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Patient Recovery Trends (All Patients)</h2>
        <LineChart data={[{ label: 'Wk 1', value: 42 }, { label: 'Wk 2', value: 55 }, { label: 'Wk 3', value: 63 }, { label: 'Wk 4', value: 68 }]} unit="%" height="h-40" />
      </div>

      {/* Needs attention */}
      <div className="card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><AlertCircle className="h-5 w-5 text-error-500" /> Patients Needing Attention</h2>
        <div className="space-y-3">
          {needsAttention.map((p) => (
            <Link key={p.id} to={`/doctor/patients/${p.id}`} className="flex items-center gap-4 rounded-xl border border-error-100 bg-error-50/30 p-4 transition hover:shadow-soft">
              <Avatar name={p.name} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.surgery} · Recovery: {p.recovery}% · Last update: {p.lastUpdate}</p>
              </div>
              <span className={classNames('badge', riskConfig[p.risk].badge)}>{riskConfig[p.risk].label} Risk</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            {riskFilters.map((r) => (
              <button key={r.key} onClick={() => setFilter(r.key)} className={classNames('rounded-lg border px-3 py-2 text-sm font-medium transition', filter === r.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300')}>{r.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient recovery cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const entries = recoveryEntries.filter((e) => e.patientId === p.id);
          const latest = entries[0];
          return (
            <Link key={p.id} to={`/doctor/patients/${p.id}`} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} size="md" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-primary-600">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.surgery}</p>
                </div>
                <span className={classNames('badge', riskConfig[p.risk].badge)}>{riskConfig[p.risk].label}</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Recovery</span><span className="font-bold text-slate-800">{p.recovery}%</span></div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={classNames('h-full rounded-full', riskConfig[p.risk].bar)} style={{ width: `${p.recovery}%` }} /></div>
              </div>
              {latest && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge bg-error-50 text-error-700">Pain: {latest.painLevel}/10</span>
                  <span className="badge bg-warning-50 text-warning-700">{latest.energyLevel}</span>
                  <span className="badge bg-primary-50 text-primary-700">{latest.woundCondition}</span>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400">Last update: {p.lastUpdate}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
