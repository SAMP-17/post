import { useState, useMemo } from 'react';
import { Search, Filter, Pill, TrendingUp, AlertCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { patients, medications } from '@/data/mockData';
import { classNames } from '@/lib/utils';

export default function MedicationManagementPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  const medRows = useMemo(() => {
    return patients.map((p) => {
      const pMeds = medications.filter((m) => m.patientId === p.id);
      const taken = pMeds.filter((m) => m.status === 'taken').length;
      const missed = pMeds.filter((m) => m.status === 'skipped' || m.status === 'pending').length;
      const adherence = p.medicationAdherence;
      const status = adherence >= 90 ? 'good' : adherence >= 75 ? 'fair' : 'poor';
      return { patient: p, medCount: pMeds.length, taken, missed, adherence, status, meds: pMeds };
    });
  }, []);

  const filtered = medRows.filter((r) => {
    const matchSearch = r.patient.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      good: 'bg-success-100 text-success-700',
      fair: 'bg-warning-100 text-warning-700',
      poor: 'bg-error-100 text-error-700',
    };
    return map[s];
  };

  const detailPatient = detailOpen ? medRows.find((r) => r.patient.id === detailOpen) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medication Monitoring</h1>
        <p className="mt-1 text-slate-500">Monitor medication adherence across all your patients.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50"><TrendingUp className="h-5 w-5 text-success-600" /></div>
            <div><p className="text-sm text-slate-500">Average Adherence</p><p className="text-2xl font-bold text-slate-900">89%</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-50"><AlertCircle className="h-5 w-5 text-error-600" /></div>
            <div><p className="text-sm text-slate-500">Missed Doses Today</p><p className="text-2xl font-bold text-slate-900">7</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50"><Pill className="h-5 w-5 text-primary-600" /></div>
            <div><p className="text-sm text-slate-500">Total Medications</p><p className="text-2xl font-bold text-slate-900">{medications.length}</p></div>
          </div>
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
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input min-w-[150px]">
              <option value="all">All Statuses</option>
              <option value="good">Good (90%+)</option>
              <option value="fair">Fair (75-89%)</option>
              <option value="poor">Poor (&lt;75%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-6 py-4">Patient</th>
                <th className="px-4 py-4">Medications</th>
                <th className="px-4 py-4">Adherence</th>
                <th className="px-4 py-4">Missed Doses</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r.patient.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.patient.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800">{r.patient.name}</p>
                        <p className="text-xs text-slate-500">{r.patient.surgery}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.medCount} active</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div className={classNames('h-full rounded-full', r.adherence >= 90 ? 'bg-success-500' : r.adherence >= 75 ? 'bg-warning-500' : 'bg-error-500')} style={{ width: `${r.adherence}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{r.adherence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {r.missed > 0 ? <span className="badge bg-error-50 text-error-700">{r.missed} missed</span> : <span className="badge bg-success-50 text-success-700">None</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={classNames('badge', statusBadge(r.status))}>{r.status === 'good' ? 'Good' : r.status === 'fair' ? 'Fair' : 'Poor'}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => setDetailOpen(r.patient.id)} className="text-sm font-medium text-primary-600 hover:text-primary-700">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detailOpen} onClose={() => setDetailOpen(null)} title={detailPatient ? `Medications — ${detailPatient.patient.name}` : ''} size="lg">
        {detailPatient && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <Avatar name={detailPatient.patient.name} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{detailPatient.patient.name}</p>
                <p className="text-sm text-slate-500">{detailPatient.patient.surgery} · Adherence: {detailPatient.adherence}%</p>
              </div>
            </div>
            <div className="space-y-2">
              {detailPatient.meds.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50"><Pill className="h-4 w-4 text-teal-600" /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.dosage} · {m.frequency} · {m.time}</p>
                  </div>
                  <span className={classNames('badge', m.status === 'taken' ? 'bg-success-100 text-success-700' : m.status === 'skipped' ? 'bg-error-100 text-error-700' : 'bg-slate-100 text-slate-600')}>{m.status}</span>
                </div>
              ))}
              {detailPatient.meds.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No medications currently prescribed.</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
