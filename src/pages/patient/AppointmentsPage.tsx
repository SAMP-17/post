import { useState } from 'react';
import { CalendarClock, Clock, MapPin, Check, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { appointments, patients } from '@/data/mockData';
import { formatDate, classNames } from '@/lib/utils';
import type { AppointmentStatus } from '@/types';

const statusConfig: Record<AppointmentStatus, { label: string; badge: string }> = {
  confirmed: { label: 'Confirmed', badge: 'bg-success-100 text-success-700' },
  scheduled: { label: 'Scheduled', badge: 'bg-primary-100 text-primary-700' },
  completed: { label: 'Completed', badge: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Cancelled', badge: 'bg-error-100 text-error-700' },
};

const monthDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PatientAppointmentsPage() {
  const patientAppts = appointments.filter((a) => a.patientId === 'p1');
  const upcoming = patientAppts.filter((a) => a.status === 'confirmed' || a.status === 'scheduled');
  const history = [
    { date: '2026-08-22', type: 'Pre-Discharge Check', doctor: 'Dr. Priya Sharma', status: 'completed' as AppointmentStatus, notes: 'Final in-hospital assessment before discharge.' },
    { date: '2026-08-19', type: 'Post-Surgery Review', doctor: 'Dr. Priya Sharma', status: 'completed' as AppointmentStatus, notes: 'Surgery site reviewed. Recovery on track.' },
  ];

  const [rescheduleOpen, setRescheduleOpen] = useState<Appointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-08-01'));

  const apptDates = new Set(patientAppts.map((a) => a.date));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = 27;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Follow-Up Appointments</h1>
        <p className="mt-1 text-slate-500">View and manage your scheduled follow-up visits.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
          {upcoming.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <span className="text-xs font-medium">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-bold">{new Date(a.date).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{a.doctorName}</p>
                    <p className="text-sm text-slate-500">{a.type}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> City Care Hospital</span>
                    </div>
                  </div>
                </div>
                <span className={classNames('badge', statusConfig[a.status].badge)}>{statusConfig[a.status].label}</span>
              </div>
              {a.notes && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{a.notes}</div>
              )}
              <div className="mt-4 flex gap-3">
                <button className="btn-primary flex-1">View Details</button>
                <button onClick={() => setRescheduleOpen(a)} className="btn-secondary flex-1">Request Reschedule</button>
              </div>
            </div>
          ))}

          {/* History */}
          <h2 className="mt-6 text-lg font-bold text-slate-900">Appointment History</h2>
          {history.map((h, i) => (
            <div key={i} className="card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Check className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{h.type}</p>
                <p className="text-xs text-slate-500">{h.doctor} · {formatDate(h.date)}</p>
              </div>
              <span className={classNames('badge', statusConfig[h.status].badge)}>{statusConfig[h.status].label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="card h-fit p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-semibold text-slate-700">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {monthDays.map((d) => (
              <div key={d} className="pb-2 text-xs font-semibold text-slate-400">{d}</div>
            ))}
            {days.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dateStr = `2026-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const hasAppt = apptDates.has(dateStr);
              const isToday = d === today && currentMonth.getMonth() === 7;
              return (
                <div
                  key={i}
                  className={classNames(
                    'flex h-10 items-center justify-center rounded-lg text-sm transition',
                    isToday ? 'bg-primary-600 font-bold text-white' : hasAppt ? 'bg-primary-50 font-semibold text-primary-700 ring-1 ring-primary-200' : 'text-slate-600 hover:bg-slate-50',
                  )}
                >
                  {d}
                  {hasAppt && !isToday && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary-500" />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Appointments this month</p>
            {patientAppts.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-700">
                  {new Date(a.date).getDate()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-700">{a.type}</p>
                  <p className="text-xs text-slate-500">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reschedule modal */}
      <Modal
        open={!!rescheduleOpen}
        onClose={() => setRescheduleOpen(null)}
        title="Request Reschedule"
        footer={
          <>
            <button onClick={() => setRescheduleOpen(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => setRescheduleOpen(null)} className="btn-primary">Submit Request</button>
          </>
        }
      >
        {rescheduleOpen && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{rescheduleOpen.type}</p>
              <p className="text-xs text-slate-500">{rescheduleOpen.doctorName} · {formatDate(rescheduleOpen.date)} at {rescheduleOpen.time}</p>
            </div>
            <div>
              <label className="label">Preferred Date</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">Preferred Time</label>
              <input type="time" className="input" />
            </div>
            <div>
              <label className="label">Reason for Reschedule</label>
              <textarea className="input min-h-[80px] resize-y" placeholder="Briefly explain why you need to reschedule..." />
            </div>
            <p className="text-xs text-slate-500">Your request will be sent to {rescheduleOpen.doctorName}'s office for confirmation.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
