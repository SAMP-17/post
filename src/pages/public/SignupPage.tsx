import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, HeartPulse, Stethoscope, User, Mail, Phone, Calendar, Lock, Check,
  IdCard, Building2, Hospital, Stethoscope as Steth, CheckCircle2,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { classNames } from '@/lib/utils';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: '', password: '', confirm: '',
    patientId: '', emergencyContact: '', hospital: '',
    professionalId: '', department: '', specialization: '', clinic: '',
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.gender) e.gender = 'Please select a gender';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (role === 'patient') {
      if (!form.patientId.trim()) e.patientId = 'Patient ID is required';
      if (!form.emergencyContact.trim()) e.emergencyContact = 'Emergency contact is required';
      if (!form.hospital.trim()) e.hospital = 'Hospital name is required';
    } else {
      if (!form.professionalId.trim()) e.professionalId = 'Professional ID is required';
      if (!form.department.trim()) e.department = 'Department is required';
      if (!form.specialization.trim()) e.specialization = 'Specialization is required';
      if (!form.clinic.trim()) e.clinic = 'Hospital/Clinic is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validateStep3()) return;
    setDone(true);
    setTimeout(() => {
      signup({
        role: role!,
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dob,
        gender: form.gender,
        patientId: form.patientId,
        emergencyContact: form.emergencyContact,
        hospital: form.hospital,
        professionalId: form.professionalId,
        department: form.department,
        specialization: form.specialization,
        clinic: form.clinic,
      });
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    }, 1800);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card max-w-md p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <CheckCircle2 className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Account Created!</h2>
          <p className="mt-2 text-slate-600">Your CareTrack account has been set up successfully. Redirecting you to your dashboard...</p>
          <div className="mt-6 flex justify-center">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full animate-pulse rounded-full bg-primary-500" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Link to="/" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>

        <div className="mt-8">
          {/* Progress */}
          <div className="mb-8 flex items-center justify-center">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={classNames(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition',
                  step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400',
                )}>
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {i < 2 && <div className={classNames('h-1 w-16 sm:w-24', step > s ? 'bg-primary-600' : 'bg-slate-200')} />}
              </div>
            ))}
          </div>

          <div className="mb-4 text-center">
            <p className="text-sm font-medium text-slate-500">
              {step === 1 && 'Step 1 of 3'} {step === 2 && 'Step 2 of 3'} {step === 3 && 'Step 3 of 3'}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {step === 1 && 'Choose your role'} {step === 2 && 'Personal information'} {step === 3 && 'Additional information'}
            </h1>
          </div>

          <div className="card p-6 sm:p-8">
            {/* Step 1: Role */}
            {step === 1 && (
              <div className="space-y-4">
                <button
                  onClick={() => { setRole('patient'); setStep(2); }}
                  className="group flex w-full items-center gap-4 rounded-2xl border-2 border-slate-200 p-5 text-left transition hover:border-primary-500 hover:bg-primary-50/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                    <HeartPulse className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">Patient</h3>
                    <p className="text-sm text-slate-500">Track your recovery, medications, and appointments</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary-600" />
                </button>
                <button
                  onClick={() => { setRole('doctor'); setStep(2); }}
                  className="group flex w-full items-center gap-4 rounded-2xl border-2 border-slate-200 p-5 text-left transition hover:border-teal-500 hover:bg-teal-50/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100">
                    <Stethoscope className="h-7 w-7 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">Healthcare Professional</h3>
                    <p className="text-sm text-slate-500">Monitor patients, manage discharge plans, and track recovery</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600" />
                </button>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-11" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="John Kumar" />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-error-600">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input type="email" className="input pl-11" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-error-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input className="input pl-11" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-error-600">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input type="date" className="input pl-11" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                    </div>
                    {errors.dob && <p className="mt-1 text-xs text-error-600">{errors.dob}</p>}
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select className="input" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-error-600">{errors.gender}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input type="password" className="input pl-11" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 6 characters" />
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-error-600">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input type="password" className="input pl-11" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Re-enter password" />
                    </div>
                    {errors.confirm && <p className="mt-1 text-xs text-error-600">{errors.confirm}</p>}
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                  <button onClick={() => { if (validateStep2()) setStep(3); }} className="btn-primary">Continue</button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <div className="space-y-4">
                {role === 'patient' ? (
                  <>
                    <div>
                      <label className="label">Patient ID</label>
                      <div className="relative">
                        <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input className="input pl-11" value={form.patientId} onChange={(e) => set('patientId', e.target.value)} placeholder="PT-2026-0001" />
                      </div>
                      {errors.patientId && <p className="mt-1 text-xs text-error-600">{errors.patientId}</p>}
                    </div>
                    <div>
                      <label className="label">Emergency Contact</label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input className="input pl-11" value={form.emergencyContact} onChange={(e) => set('emergencyContact', e.target.value)} placeholder="+91 98765 11111 (Relationship)" />
                      </div>
                      {errors.emergencyContact && <p className="mt-1 text-xs text-error-600">{errors.emergencyContact}</p>}
                    </div>
                    <div>
                      <label className="label">Hospital Name</label>
                      <div className="relative">
                        <Hospital className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input className="input pl-11" value={form.hospital} onChange={(e) => set('hospital', e.target.value)} placeholder="City Care Hospital" />
                      </div>
                      {errors.hospital && <p className="mt-1 text-xs text-error-600">{errors.hospital}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="label">Professional ID</label>
                      <div className="relative">
                        <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input className="input pl-11" value={form.professionalId} onChange={(e) => set('professionalId', e.target.value)} placeholder="DR-MCI-00000" />
                      </div>
                      {errors.professionalId && <p className="mt-1 text-xs text-error-600">{errors.professionalId}</p>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label">Department</label>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input className="input pl-11" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="General Surgery" />
                        </div>
                        {errors.department && <p className="mt-1 text-xs text-error-600">{errors.department}</p>}
                      </div>
                      <div>
                        <label className="label">Specialization</label>
                        <div className="relative">
                          <Steth className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input className="input pl-11" value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="General Surgeon" />
                        </div>
                        {errors.specialization && <p className="mt-1 text-xs text-error-600">{errors.specialization}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Hospital / Clinic</label>
                      <div className="relative">
                        <Hospital className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input className="input pl-11" value={form.clinic} onChange={(e) => set('clinic', e.target.value)} placeholder="City Care Hospital" />
                      </div>
                      {errors.clinic && <p className="mt-1 text-xs text-error-600">{errors.clinic}</p>}
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
                  <button onClick={handleCreate} className="btn-primary">Create Account</button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
