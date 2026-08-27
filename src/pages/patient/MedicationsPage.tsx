import { useState } from 'react';
import { Pill, Check, SkipForward, Clock, TrendingUp, History } from 'lucide-react';
import { BarChart } from '@/components/ui/Charts';
import { medications as allMeds, adherenceWeekly } from '@/data/mockData';
import { classNames } from '@/lib/utils';
import type { MedicationStatus } from '@/types';

const statusConfig: Record<MedicationStatus, { label: string; badge: string; dot: string }> = {
  taken: { label: 'Taken', badge: 'bg-success-100 text-success-700', dot: 'bg-success-500' },
  pending: { label: 'Pending', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  upcoming: { label: 'Upcoming', badge: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500' },
  skipped: { label: 'Skipped', badge: 'bg-error-100 text-error-700', dot: 'bg-error-500' },
};

const tabs = ['Daily', 'Weekly', 'Monthly'] as const;

export default function MedicationsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>('Daily');
  const [meds, setMeds] = useState(allMeds.filter((m) => m.patientId === 'p1'));

  const markMed = (id: string, status: MedicationStatus) => {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const takenCount = meds.filter((m) => m.status === 'taken').length;
  const adherencePct = Math.round((takenCount / meds.length) * 100);

  const historyMeds = [
    { date: 'Aug 26', name: 'Amoxicillin', dosage: '500 mg', time: '9:00 AM', status: 'taken' as MedicationStatus },
    { date: 'Aug 26', name: 'Paracetamol', dosage: '650 mg', time: '2:00 PM', status: 'taken' as MedicationStatus },
    { date: 'Aug 26', name: 'Omeprazole', dosage: '20 mg', time: '9:00 PM', status: 'taken' as MedicationStatus },
    { date: 'Aug 25', name: 'Amoxicillin', dosage: '500 mg', time: '9:00 AM', status: 'taken' as MedicationStatus },
    { date: 'Aug 25', name: 'Paracetamol', dosage: '650 mg', time: '2:00 PM', status: 'skipped' as MedicationStatus },
    { date: 'Aug 25', name: 'Omeprazole', dosage: '20 mg', time: '9:00 PM', status: 'taken' as MedicationStatus },
    { date: 'Aug 24', name: 'Amoxicillin', dosage: '500 mg', time: '9:00 AM', status: 'taken' as MedicationStatus },
    { date: 'Aug 24', name: 'Paracetamol', dosage: '650 mg', time: '2:00 PM', status: 'taken' as MedicationStatus },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medication Monitoring</h1>
        <p className="mt-1 text-slate-500">Track your medication schedule and adherence.</p>
      </div>

      {/* Adherence summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Medication Adherence</p>
              <p className="text-2xl font-bold text-slate-900">{adherencePct}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-success-500 to-teal-500 transition-all" style={{ width: `${adherencePct}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{takenCount} of {meds.length} doses taken today</p>
          </div>
        </div>
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Weekly Adherence</h2>
          <BarChart data={adherenceWeekly} color="bg-gradient-to-t from-teal-500 to-teal-400" height="h-28" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={classNames(
              'flex-1 rounded-lg py-2 text-sm font-semibold transition',
              tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Medication cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {tab === 'Daily' ? "Today's Medications" : tab === 'Weekly' ? 'This Week' : 'This Month'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meds.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                    <Pill className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.dosage}</p>
                  </div>
                </div>
                <span className={classNames('badge', statusConfig[m.status].badge)}>{statusConfig[m.status].label}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{m.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Pill className="h-4 w-4 text-slate-400" />
                  <span>{m.frequency}</span>
                </div>
                {m.notes && <p className="text-xs text-slate-500">{m.notes}</p>}
              </div>
              {m.status !== 'taken' && m.status !== 'skipped' && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => markMed(m.id, 'taken')} className="btn bg-success-50 text-success-700 hover:bg-success-100 flex-1 px-3 py-2 text-sm">
                    <Check className="h-4 w-4" /> Mark as Taken
                  </button>
                  <button onClick={() => markMed(m.id, 'skipped')} className="btn bg-slate-50 text-slate-500 hover:bg-slate-100 px-3 py-2 text-sm">
                    <SkipForward className="h-4 w-4" /> Skip
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medication history */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-3">
          <History className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-900">Medication History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Medication</th>
                <th className="pb-3 pr-4">Dosage</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historyMeds.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 text-slate-600">{m.date}</td>
                  <td className="py-3 pr-4 font-medium text-slate-800">{m.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{m.dosage}</td>
                  <td className="py-3 pr-4 text-slate-600">{m.time}</td>
                  <td className="py-3">
                    <span className={classNames('badge', statusConfig[m.status].badge)}>
                      <span className={classNames('h-1.5 w-1.5 rounded-full', statusConfig[m.status].dot)} />
                      {statusConfig[m.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
