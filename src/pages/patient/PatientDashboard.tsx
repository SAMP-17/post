import { useState } from 'react';
import {
  HeartPulse, Pill, CalendarClock, AlertTriangle, Check, SkipForward, Clock,
  Activity, TrendingUp, ArrowRight, Stethoscope,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { LineChart, ProgressRing } from '@/components/ui/Charts';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { greeting, formatDate, riskConfig, classNames } from '@/lib/utils';
import { recoveryTrend30Days, medications as allMeds, appointments, patientNotifications } from '@/data/mockData';
import { Link } from 'react-router-dom';
import type { MedicationStatus } from '@/types';

const statusConfig: Record<MedicationStatus, { label: string; badge: string }> = {
  taken: { label: 'Taken', badge: 'bg-success-100 text-success-700' },
  pending: { label: 'Pending', badge: 'bg-slate-100 text-slate-600' },
  upcoming: { label: 'Upcoming', badge: 'bg-primary-100 text-primary-700' },
  skipped: { label: 'Skipped', badge: 'bg-error-100 text-error-700' },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [meds, setMeds] = useState(allMeds.filter((m) => m.patientId === 'p1'));

  const markMed = (id: string, status: MedicationStatus) => {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const nextAppt = appointments.find((a) => a.patientId === 'p1' && a.status === 'confirmed');
  const activeAlerts = patientNotifications.filter((n) => n.type === 'alert' && !n.read);
  const firstName = user?.name?.replace(/^Dr\.\s*/, '').split(' ')[0] || 'John';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting()}, {firstName} 👋</h1>
        <p className="mt-1 text-slate-500">Here's an overview of your recovery progress.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Recovery Progress" value="72%" icon={HeartPulse} color="primary" trend="+7% this week" trendUp />
        <StatCard label="Today's Medications" value="3 Scheduled" icon={Pill} color="teal" trend="1 taken, 2 pending" />
        <StatCard label="Next Appointment" value={nextAppt ? formatDate(nextAppt.date) : '—'} icon={CalendarClock} color="accent" trend={nextAppt ? nextAppt.time : ''} />
        <StatCard label="Active Alerts" value={activeAlerts.length || 1} icon={AlertTriangle} color="warning" trend="1 important update" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recovery chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recovery Progress</h2>
              <p className="text-sm text-slate-500">Last 30 days recovery trend</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-1.5 text-sm font-semibold text-success-700">
              <TrendingUp className="h-4 w-4" /> +37% overall
            </div>
          </div>
          <LineChart data={recoveryTrend30Days} unit="%" height="h-48" />
        </div>

        {/* Progress ring */}
        <div className="card flex flex-col items-center justify-center p-6">
          <h2 className="mb-4 self-start text-lg font-bold text-slate-900">Overall Recovery</h2>
          <ProgressRing value={72} size={140} color="#14b8a6" label="Recovery" />
          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Pain Level</span>
              <span className="font-semibold text-slate-800">3 / 10</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Energy Level</span>
              <span className="font-semibold text-slate-800">Good</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Wound Condition</span>
              <span className="font-semibold text-success-700">Improving</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's medications */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Today's Medications</h2>
            <Link to="/patient/medications" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {meds.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                  <Pill className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.dosage} · {m.time}</p>
                </div>
                <span className={classNames('badge', statusConfig[m.status].badge)}>{statusConfig[m.status].label}</span>
                {m.status !== 'taken' && m.status !== 'skipped' && (
                  <div className="flex gap-1">
                    <button onClick={() => markMed(m.id, 'taken')} className="rounded-lg bg-success-50 p-1.5 text-success-600 hover:bg-success-100" title="Mark as Taken">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => markMed(m.id, 'skipped')} className="rounded-lg bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100" title="Skip">
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming appointment */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Appointment</h2>
            <Link to="/patient/appointments" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {nextAppt && (
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-teal-50 p-5">
                <div className="flex items-center gap-4">
                  <Avatar name={nextAppt.doctorName} size="lg" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{nextAppt.doctorName}</p>
                    <p className="text-sm text-slate-600">General Surgeon</p>
                    <p className="mt-1 text-xs font-medium text-primary-600">{nextAppt.type}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/70 p-3">
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="text-sm font-semibold text-slate-800">{formatDate(nextAppt.date)}</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-3">
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="text-sm font-semibold text-slate-800">{nextAppt.time}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link to="/patient/appointments" className="btn-primary flex-1">View Details</Link>
                <Link to="/patient/appointments" className="btn-secondary flex-1">Reschedule</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent recovery updates */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Recovery Updates</h2>
          <Link to="/patient/recovery" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="relative space-y-4 pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
          {[
            { date: 'Today, 9:15 AM', pain: 3, recovery: 72, wound: 'Improving', notes: 'Feeling much better today. Wound looks clean. Walked for 20 minutes.', color: 'bg-success-500' },
            { date: 'Yesterday, 9:00 AM', pain: 4, recovery: 68, wound: 'Normal', notes: 'Slight discomfort near incision site in the morning. Improved after medication.', color: 'bg-primary-500' },
            { date: '2 days ago', pain: 5, recovery: 65, wound: 'Normal', notes: 'Had a restless night. Pain manageable with Paracetamol.', color: 'bg-primary-400' },
            { date: '3 days ago', pain: 5, recovery: 60, wound: 'Slight Concern', notes: 'Feeling tired. Reduced appetite. Wound slightly red.', color: 'bg-warning-500' },
          ].map((e, i) => (
            <div key={i} className="relative">
              <div className={classNames('absolute -left-[18px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white', e.color)} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{e.date}</span>
                <span className="badge bg-slate-100 text-slate-600">Pain: {e.pain}/10</span>
                <span className="badge bg-primary-50 text-primary-700">Recovery: {e.recovery}%</span>
                <span className="badge bg-teal-50 text-teal-700">{e.wound}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{e.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/patient/symptoms" className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error-50">
            <Stethoscope className="h-6 w-6 text-error-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Report Symptoms</p>
            <p className="text-sm text-slate-500">Submit a new symptom report</p>
          </div>
        </Link>
        <Link to="/patient/recovery" className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <Activity className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Daily Recovery Update</p>
            <p className="text-sm text-slate-500">Submit today's recovery check-in</p>
          </div>
        </Link>
        <Link to="/patient/discharge-plan" className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
            <Clock className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Discharge Plan</p>
            <p className="text-sm text-slate-500">Review your recovery instructions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
