import { useState } from 'react';
import { CalendarClock, Plus, Clock, MapPin, Check, X, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { appointments, patients } from '@/data/mockData';
import { formatDate, classNames } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '@/types';

const statusConfig: Record<AppointmentStatus, { label: string; badge: string }> = {
  confirmed: { label: 'Confirmed', badge: 'bg-success-100 text-success-700' },
  scheduled: { label: 'Scheduled', badge: 'bg-primary-100 text-primary-700' },
  completed: { label: 'Completed', badge: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Cancelled', badge: 'bg-error-100 text-error-700' },
};

const monthDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FollowUpsPage() {
  const [appts, setAppts] = useState(appointments);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-08-01'));
  const [form, setForm] = useState({ patientId: '', date: '', time: '', type: '', notes: '' });

  const apptDates = new Map<string, Appointment[]>();
  appts.forEach((a) => {
    if (!apptDates.has(a.date)) apptDates.set(a.date, []);
    apptDates.get(a.date)!.push(a);
  });

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
  const dayAppts = selectedDate ? apptDates.get(selectedDate) || [] : appts.filter((a) => a.date === '2026-08-27');

  const handleCreate = () => {
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient || !form.date || !form.time) return;
    const newAppt: Appointment = {
      id: `a${Date.now()}`,
      patientId: form.patientId,
      patientName: patient.name,
      doctorName: 'Dr. Priya Sharma',
      type: form.type || 'Follow-Up',
      date: form.date,
      time: form.time,
      status: 'scheduled',
      notes: form.notes,
    };
    setAppts((prev) => [...prev, newAppt]);
    setCreateOpen(false);
    setForm({ patientId: '', date: '', time: '', type: '', notes: '' });
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-Up Management</h1>
          <p className="mt-1 text-slate-500">Schedule and manage patient follow-up appointments.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Schedule Appointment</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><ChevronLeft className="h-4 w-4" /></button>
              <span className="px-2 text-sm font-semibold text-slate-700">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {monthDays.map((d) => <div key={d} className="pb-2 text-xs font-semibold text-slate-400">{d}</div>)}
            {days.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dateStr = `2026-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const hasAppts = apptDates.has(dateStr);
              const isToday = d === today && currentMonth.getMonth() === 7;
              const isSelected = selectedDate === dateStr;
              return (
                <button key={i} onClick={() => setSelectedDate(dateStr)} className={classNames('flex h-10 items-center justify-center rounded-lg text-sm transition', isSelected ? 'bg-primary-600 font-bold text-white' : isToday ? 'bg-primary-100 font-bold text-primary-700' : hasAppts ? 'bg-primary-50 font-semibold text-primary-700 hover:bg-primary-100' : 'text-slate-600 hover:bg-slate-50')}>
                  {d}
                  {hasAppts && !isSelected && !isToday && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily appointments */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {selectedDate ? formatDate(selectedDate) : "Today's Appointments"}
          </h2>
          <div className="space-y-3">
            {dayAppts.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CalendarClock className="h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No appointments for this day.</p>
              </div>
            ) : dayAppts.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <span className="text-xs">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-bold">{new Date(a.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{a.patientName}</p>
                      <p className="text-sm text-slate-500">{a.type}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> City Care Hospital</span>
                      </div>
                    </div>
                  </div>
                  <span className={classNames('badge', statusConfig[a.status].badge)}>{statusConfig[a.status].label}</span>
                </div>
                {a.notes && <div className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-600">{a.notes}</div>}
                <div className="mt-3 flex gap-2">
                  {a.status === 'scheduled' && <button onClick={() => updateStatus(a.id, 'confirmed')} className="btn bg-success-50 text-success-700 hover:bg-success-100 px-3 py-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Confirm</button>}
                  {a.status === 'confirmed' && <button onClick={() => updateStatus(a.id, 'completed')} className="btn bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 text-xs"><Check className="h-3.5 w-3.5" /> Mark Completed</button>}
                  <button className="btn bg-slate-50 text-slate-500 hover:bg-slate-100 px-3 py-1.5 text-xs"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => updateStatus(a.id, 'cancelled')} className="btn bg-error-50 text-error-600 hover:bg-error-100 px-3 py-1.5 text-xs"><X className="h-3.5 w-3.5" /> Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All upcoming */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">All Upcoming Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Patient</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appts.filter((a) => a.status === 'confirmed' || a.status === 'scheduled').map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-700">{formatDate(a.date)}</td>
                  <td className="py-3 pr-4 text-slate-600">{a.time}</td>
                  <td className="py-3 pr-4 font-semibold text-slate-800">{a.patientName}</td>
                  <td className="py-3 pr-4 text-slate-600">{a.type}</td>
                  <td className="py-3"><span className={classNames('badge', statusConfig[a.status].badge)}>{statusConfig[a.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Schedule Appointment"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} className="btn-primary">Schedule</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Patient</label>
            <select className="input" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.surgery}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Appointment Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">Select type</option>
              <option value="General Surgery Follow-Up">General Surgery Follow-Up</option>
              <option value="Recovery Assessment">Recovery Assessment</option>
              <option value="Urgent Review">Urgent Review</option>
              <option value="Post-Op Review">Post-Op Review</option>
              <option value="Mobility Assessment">Mobility Assessment</option>
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input min-h-[80px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes for this appointment..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
