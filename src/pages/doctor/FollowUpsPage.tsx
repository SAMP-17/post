import { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Clock,
  MapPin,
  Check,
  X,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { appointments as initialAppts, patients } from '@/data/mockData';
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
  const [appts, setAppts] = useState<Appointment[]>(initialAppts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');

  // Determine initial date: if mock data has dates, prefer today or default
  const todayDate = new Date();
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(
    todayDate.getDate()
  ).padStart(2, '0')}`;

  const hasTodayAppts = initialAppts.some((a) => a.date === todayStr);
  const defaultSelectedDate = hasTodayAppts
    ? todayStr
    : initialAppts[0]?.date || todayStr;

  const [selectedDate, setSelectedDate] = useState<string>(defaultSelectedDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate.replace(/-/g, '/')) || new Date()
  );

  const [form, setForm] = useState({
    patientId: '',
    date: todayStr,
    time: '10:00 AM',
    type: 'Post-Op Review',
    notes: '',
  });

  const showBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 4000);
  };

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

  const dayAppts = selectedDate ? apptDates.get(selectedDate) || [] : [];

  const openCreateModal = (patientId = '', prefillDate = '') => {
    setEditingAppt(null);
    const dateToUse = prefillDate || selectedDate || todayStr;
    setForm({
      patientId: patientId || (patients[0]?.id ?? ''),
      date: dateToUse,
      time: '10:30 AM',
      type: 'General Surgery Follow-Up',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingAppt(appt);
    setForm({
      patientId: appt.patientId,
      date: appt.date,
      time: appt.time,
      type: appt.type,
      notes: appt.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient || !form.date || !form.time) {
      alert('Please select patient, date, and time.');
      return;
    }

    if (editingAppt) {
      // Update existing appointment
      const updated: Appointment = {
        ...editingAppt,
        patientId: form.patientId,
        patientName: patient.name,
        date: form.date,
        time: form.time,
        type: form.type || 'Follow-Up',
        notes: form.notes,
      };
      setAppts((prev) => prev.map((a) => (a.id === editingAppt.id ? updated : a)));
      setSelectedDate(form.date);
      setCurrentMonth(new Date(form.date.replace(/-/g, '/')));
      setModalOpen(false);
      showBanner(`Appointment for ${patient.name} updated successfully!`);
    } else {
      // Create new appointment
      const newAppt: Appointment = {
        id: `a-${Date.now()}`,
        patientId: form.patientId,
        patientName: patient.name,
        doctorName: 'Dr. Priya Sharma',
        type: form.type || 'Follow-Up',
        date: form.date,
        time: form.time,
        status: 'scheduled',
        notes: form.notes,
      };

      setAppts((prev) => [newAppt, ...prev]);
      // Immediately switch calendar and daily view to this new appointment!
      setSelectedDate(form.date);
      setCurrentMonth(new Date(form.date.replace(/-/g, '/')));
      setModalOpen(false);
      showBanner(`Follow-up appointment for ${patient.name} on ${formatDate(form.date)} scheduled successfully!`);
    }
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const filteredUpcoming = appts
    .filter((a) => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchSearch =
        a.patientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        a.type.toLowerCase().includes(tableSearch.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-Up Management</h1>
          <p className="mt-1 text-slate-500">Schedule, reschedule, and track patient follow-up appointments.</p>
        </div>
        <button onClick={() => openCreateModal()} className="btn-primary">
          <Plus className="h-4 w-4" /> Schedule Appointment
        </button>
      </div>

      {/* Success banner */}
      {banner && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-semibold text-success-800 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-success-600" />
          <span>{banner}</span>
        </div>
      )}

      {/* Main split: Calendar & Daily View */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Box */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
                }
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-semibold text-slate-700">
                {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
                }
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {monthDays.map((d) => (
              <div key={d} className="pb-2 text-xs font-semibold text-slate-400">
                {d}
              </div>
            ))}
            {days.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(
                2,
                '0'
              )}-${String(d).padStart(2, '0')}`;
              const count = apptDates.get(dateStr)?.length || 0;
              const isSelected = selectedDate === dateStr;
              const isRealToday =
                d === todayDate.getDate() &&
                currentMonth.getMonth() === todayDate.getMonth() &&
                currentMonth.getFullYear() === todayDate.getFullYear();

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={classNames(
                    'relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition',
                    isSelected
                      ? 'bg-primary-600 font-bold text-white shadow-sm'
                      : isRealToday
                      ? 'bg-primary-50 font-bold text-primary-700 ring-1 ring-primary-300'
                      : count > 0
                      ? 'bg-slate-100 font-semibold text-slate-800 hover:bg-primary-50 hover:text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span>{d}</span>
                  {count > 0 && !isSelected && (
                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>● Dots indicate scheduled follow-ups</span>
            <button
              onClick={() => {
                setSelectedDate(todayStr);
                setCurrentMonth(new Date());
              }}
              className="font-semibold text-primary-600 hover:underline"
            >
              Go to Today
            </button>
          </div>
        </div>

        {/* Selected Day's Appointments */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedDate ? formatDate(selectedDate) : 'Selected Appointments'}
              </h2>
              <p className="text-xs text-slate-500">
                {dayAppts.length} appointment{dayAppts.length !== 1 ? 's' : ''} scheduled for this day
              </p>
            </div>
            <button
              onClick={() => openCreateModal('', selectedDate)}
              className="btn bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Schedule for This Day
            </button>
          </div>

          <div className="space-y-3">
            {dayAppts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-slate-100">
                <CalendarClock className="h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-600">No appointments scheduled for this day.</p>
                <p className="text-xs text-slate-400 mt-0.5">Click the button above to add a follow-up for this date.</p>
              </div>
            ) : (
              dayAppts.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 p-4 transition hover:shadow-soft bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-semibold">
                        <span className="text-[10px] uppercase">{new Date(a.date.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-base font-bold">{new Date(a.date.replace(/-/g, '/')).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{a.patientName}</p>
                        <p className="text-xs text-slate-500">{a.type}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Clock className="h-3.5 w-3.5 text-slate-400" /> {a.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" /> City Care Hospital
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={classNames('badge', statusConfig[a.status].badge)}>
                      {statusConfig[a.status].label}
                    </span>
                  </div>

                  {a.notes && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                      <strong>Notes:</strong> {a.notes}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    {a.status === 'scheduled' && (
                      <button
                        onClick={() => updateStatus(a.id, 'confirmed')}
                        className="btn bg-success-50 text-success-700 hover:bg-success-100 px-3 py-1.5 text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm Visit
                      </button>
                    )}
                    {a.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(a.id, 'completed')}
                        className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" /> Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(a)}
                      className="btn bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    {a.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(a.id, 'cancelled')}
                        className="btn bg-error-50 text-error-600 hover:bg-error-100 px-3 py-1.5 text-xs font-semibold"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Upcoming Appointments Table */}
      <div className="card p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All Scheduled Follow-Up Appointments</h2>
            <p className="text-xs text-slate-500">Upcoming clinical reviews and assessments.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="input py-1.5 pl-8 text-xs w-48"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input py-1.5 text-xs min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Patient</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUpcoming.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                filteredUpcoming.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 pr-4 font-semibold text-slate-800">{formatDate(a.date)}</td>
                    <td className="py-3 pr-4 text-slate-600">{a.time}</td>
                    <td className="py-3 pr-4 font-bold text-slate-900">{a.patientName}</td>
                    <td className="py-3 pr-4 text-slate-600">{a.type}</td>
                    <td className="py-3 pr-4">
                      <span className={classNames('badge', statusConfig[a.status].badge)}>
                        {statusConfig[a.status].label}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedDate(a.date);
                          setCurrentMonth(new Date(a.date.replace(/-/g, '/')));
                        }}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition"
                      >
                        View on Day
                      </button>
                      <button
                        onClick={() => openEditModal(a)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        title="Edit Appointment"
                      >
                        <Edit3 className="h-3.5 w-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAppt ? `Edit Appointment — ${editingAppt.patientName}` : 'Schedule Follow-Up Appointment'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              {editingAppt ? 'Save Changes' : 'Confirm & Schedule'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Patient *</label>
            <select
              className="input"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.surgery}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Appointment Date *</label>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Appointment Time *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 10:30 AM"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Appointment Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="General Surgery Follow-Up">General Surgery Follow-Up</option>
              <option value="Recovery Assessment">Recovery Assessment</option>
              <option value="Suture Removal & Wound Check">Suture Removal & Wound Check</option>
              <option value="Post-Op Review">Post-Op Review</option>
              <option value="Mobility Assessment">Mobility Assessment</option>
              <option value="Urgent Review">Urgent Review</option>
            </select>
          </div>
          <div>
            <label className="label">Clinical Notes / Instructions</label>
            <textarea
              className="input min-h-[80px] resize-y"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g., Suture removal, wound inspection, bring recent lab results..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
