import { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Camera, Save, Shield, Moon, Sun, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { classNames } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [prefs, setPrefs] = useState({
    medication: true,
    appointment: true,
    recovery: true,
    risk: true,
    email: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: form.name, email: form.email, phone: form.phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="mt-1 text-slate-500">Manage your account information and preferences.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700 animate-fade-in">
          <Check className="h-5 w-5" /> Profile updated successfully!
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile photo card */}
        <div className="card p-6 text-center">
          <div className="relative mx-auto w-fit">
            <Avatar name={user?.name || 'User'} size="lg" className="!h-24 !w-24 !text-3xl" />
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-lg font-bold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500">{isDoctor ? user?.specialization : 'Patient'}</p>
          <span className={classNames('badge mt-2', isDoctor ? 'bg-teal-100 text-teal-700' : 'bg-primary-100 text-primary-700')}>
            {isDoctor ? 'Healthcare Professional' : 'Patient'}
          </span>
        </div>

        {/* Personal info form */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Personal Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="input pl-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="input pl-11" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="input pl-11" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              {!isDoctor && user?.dateOfBirth && (
                <div>
                  <label className="label">Date of Birth</label>
                  <input className="input" value={user.dateOfBirth} disabled />
                </div>
              )}
            </div>

            {isDoctor && (
              <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-4">
                <div>
                  <label className="label">Department</label>
                  <input className="input" value={user?.department || ''} disabled />
                </div>
                <div>
                  <label className="label">Specialization</label>
                  <input className="input" value={user?.specialization || ''} disabled />
                </div>
                <div>
                  <label className="label">Hospital/Clinic</label>
                  <input className="input" value={user?.clinic || ''} disabled />
                </div>
                <div>
                  <label className="label">Professional ID</label>
                  <input className="input" value={user?.professionalId || ''} disabled />
                </div>
              </div>
            )}

            {!isDoctor && (
              <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-4">
                <div>
                  <label className="label">Patient ID</label>
                  <input className="input" value={user?.patientId || ''} disabled />
                </div>
                <div>
                  <label className="label">Hospital</label>
                  <input className="input" value={user?.hospital || ''} disabled />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Emergency Contact</label>
                  <input className="input" value={user?.emergencyContact || ''} disabled />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> Save Changes</button>
          </form>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><Bell className="h-5 w-5 text-primary-500" /> Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { key: 'medication', label: 'Medication reminders', desc: 'Get notified about upcoming medication doses' },
            { key: 'appointment', label: 'Appointment reminders', desc: 'Receive reminders for scheduled appointments' },
            { key: 'recovery', label: 'Recovery reminders', desc: 'Daily recovery update reminders' },
            { key: 'risk', label: 'Risk alerts', desc: 'Critical alerts about patient health or your symptoms' },
            { key: 'email', label: 'Email notifications', desc: 'Receive notifications via email' },
          ].map((p) => (
            <div key={p.key} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div>
                <p className="font-semibold text-slate-800">{p.label}</p>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
              <button
                onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key as keyof typeof prev] }))}
                className={classNames(
                  'relative h-7 w-12 rounded-full transition',
                  prefs[p.key as keyof typeof prefs] ? 'bg-primary-600' : 'bg-slate-200',
                )}
              >
                <span className={classNames('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', prefs[p.key as keyof typeof prefs] ? 'left-6' : 'left-1')} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance & Security */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Appearance</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setDarkMode(false)} className={classNames('flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition', !darkMode ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300')}>
              <Sun className="h-6 w-6 text-warning-500" />
              <span className="text-sm font-semibold text-slate-700">Light Mode</span>
            </button>
            <button onClick={() => setDarkMode(true)} className={classNames('flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition', darkMode ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300')}>
              <Moon className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Dark Mode</span>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><Shield className="h-5 w-5 text-slate-500" /> Security</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800">Change Password</p>
                  <p className="text-sm text-slate-500">Update your password</p>
                </div>
              </div>
              <button className="btn-secondary">Change</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-500">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFA(!twoFA)}
                className={classNames('relative h-7 w-12 rounded-full transition', twoFA ? 'bg-primary-600' : 'bg-slate-200')}
              >
                <span className={classNames('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', twoFA ? 'left-6' : 'left-1')} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
