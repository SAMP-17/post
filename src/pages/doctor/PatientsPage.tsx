import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, ArrowRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { patients } from '@/data/mockData';
import { riskConfig, classNames, formatDate } from '@/lib/utils';
import type { RiskLevel } from '@/types';

const riskFilters: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'All Risk Levels' },
  { key: 'high', label: 'High Risk' },
  { key: 'medium', label: 'Medium Risk' },
  { key: 'low', label: 'Low Risk' },
];

const surgeryTypes = ['All Surgeries', 'Laparoscopic Appendectomy', 'Knee Replacement', 'Hernia Surgery', 'Gallbladder Surgery', 'Cardiac Procedure', 'Coronary Bypass', 'Hip Replacement', 'Spinal Fusion', 'C-Section'];

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [surgeryFilter, setSurgeryFilter] = useState('All Surgeries');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.patientId.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === 'all' || p.risk === riskFilter;
      const matchSurgery = surgeryFilter === 'All Surgeries' || p.surgery === surgeryFilter;
      return matchSearch && matchRisk && matchSurgery;
    });
  }, [search, riskFilter, surgeryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
        <p className="mt-1 text-slate-500">View and manage all your post-operative patients.</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or patient ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')} className="input min-w-[150px]">
              {riskFilters.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
            <select value={surgeryFilter} onChange={(e) => setSurgeryFilter(e.target.value)} className="input min-w-[160px]">
              {surgeryTypes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Patient grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.id} to={`/doctor/patients/${p.id}`} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex items-start gap-3">
              <Avatar name={p.name} size="lg" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 group-hover:text-primary-600">{p.name}</p>
                <p className="text-xs text-slate-500">{p.age} yrs · {p.gender} · {p.patientId}</p>
                <span className={classNames('badge mt-2', riskConfig[p.risk].badge)}>
                  <span className={classNames('h-1.5 w-1.5 rounded-full', riskConfig[p.risk].dot)} />
                  {riskConfig[p.risk].label} Risk
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Surgery</span>
                <span className="font-medium text-slate-700">{p.surgery}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Discharged</span>
                <span className="font-medium text-slate-700">{formatDate(p.dischargeDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Update</span>
                <span className="font-medium text-slate-700">{p.lastUpdate}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Recovery</span>
                <span className="font-bold text-slate-800">{p.recovery}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={classNames('h-full rounded-full', riskConfig[p.risk].bar)} style={{ width: `${p.recovery}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
              View Details <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No patients match your filters.</p>
        </div>
      )}
    </div>
  );
}
