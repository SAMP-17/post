import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, HeartPulse, Pill, Activity, Stethoscope, CalendarClock, AlertTriangle,
  FileText, Phone, Mail, MapPin, Clock, Check,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { LineChart, ProgressRing } from '@/components/ui/Charts';
import {
  patients, dischargePlans, medications, recoveryEntries, symptomReports, appointments, riskAlerts,
} from '@/data/mockData';
import { riskConfig, classNames, formatDate } from '@/lib/utils';
import type { RiskLevel } from '@/types';

const tabs = [
  { key: 'overview', label: 'Overview', icon: HeartPulse },
  { key: 'discharge', label: 'Discharge Plan', icon: FileText },
  { key: 'medications', label: 'Medications', icon: Pill },
  { key: 'recovery', label: 'Recovery', icon: Activity },
  { key: 'symptoms', label: 'Symptoms', icon: Stethoscope },
  { key: 'followups', label: 'Follow-Ups', icon: CalendarClock },
  { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

export default function PatientDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('overview');

  const patient = patients.find((p) => p.id === id) || patients[0];
  const plan = dischargePlans.find((d) => d.patientId === patient.id);
  const meds = medications.filter((m) => m.patientId === patient.id);
  const recovery = recoveryEntries.filter((r) => r.patientId === patient.id);
  const symptoms = symptomReports.filter((s) => s.patientId === patient.id);
  const appts = appointments.filter((a) => a.patientId === patient.id);
  const alerts = riskAlerts.filter((a) => a.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/doctor/patients" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>

      {/* Patient header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 px-6 py-5">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={patient.name} size="lg" className="ring-4 ring-white/20" />
            <div className="flex-1 text-white">
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <p className="mt-0.5 text-sm text-primary-100">{patient.age} years · {patient.gender} · {patient.patientId}</p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-2 text-center backdrop-blur">
                <p className="text-xs text-primary-200">Recovery</p>
                <p className="text-lg font-bold text-white">{patient.recovery}%</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-2 text-center backdrop-blur">
                <p className="text-xs text-primary-200">Adherence</p>
                <p className="text-lg font-bold text-white">{patient.medicationAdherence}%</p>
              </div>
              <div className={classNames('rounded-xl px-4 py-2 text-center backdrop-blur', riskConfig[patient.risk].badge)}>
                <p className="text-xs opacity-80">Risk Level</p>
                <p className="text-lg font-bold">{riskConfig[patient.risk].label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={classNames(
              'flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition',
              tab === t.key ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Patient Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={HeartPulse} label="Surgery" value={patient.surgery} />
              <InfoRow icon={CalendarClock} label="Surgery Date" value={formatDate(patient.surgeryDate)} />
              <InfoRow icon={CalendarClock} label="Discharge Date" value={formatDate(patient.dischargeDate)} />
              <InfoRow icon={MapPin} label="Hospital" value={patient.hospital} />
              <InfoRow icon={Phone} label="Phone" value={patient.phone} />
              <InfoRow icon={Mail} label="Email" value={patient.email} />
              <InfoRow icon={Phone} label="Emergency Contact" value={patient.emergencyContact} />
              <InfoRow icon={Clock} label="Last Update" value={patient.lastUpdate} />
            </div>
          </div>
          <div className="card flex flex-col items-center p-6">
            <h2 className="mb-4 self-start text-lg font-bold text-slate-900">Recovery Score</h2>
            <ProgressRing value={patient.recovery} size={130} color={patient.risk === 'high' ? '#ef4444' : patient.risk === 'medium' ? '#f59e0b' : '#22c55e'} />
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Medication Adherence</span><span className="font-semibold">{patient.medicationAdherence}%</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Risk Level</span><span className={classNames('font-semibold', riskConfig[patient.risk].text)}>{riskConfig[patient.risk].label}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Next Appointment</span><span className="font-semibold">{patient.nextAppointment ? formatDate(patient.nextAppointment) : '—'}</span></div>
            </div>
          </div>

          {symptoms.length > 0 && (
            <div className="card p-6 lg:col-span-3">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Latest Symptom Report</h2>
              <div className={classNames('rounded-xl border p-4', riskConfig[symptoms[0].risk].badge.replace('text-', 'border-').replace('-700', '-200'))}>
                <div className="flex items-center justify-between">
                  <span className={classNames('badge', riskConfig[symptoms[0].risk].badge)}>{riskConfig[symptoms[0].risk].label} Risk</span>
                  <span className="text-xs text-slate-500">{formatDate(symptoms[0].date)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {symptoms[0].symptoms.map((s, i) => (
                    <span key={i} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                      {s.name} <span className="text-xs text-slate-400">({s.severity})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'discharge' && plan && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Wound Care Instructions</h2>
            <ul className="space-y-2">
              {plan.woundCare.map((w, i) => <li key={i} className="flex gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />{w}</li>)}
            </ul>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Medication Instructions</h2>
              <div className="space-y-3">
                {plan.medicationInstructions.map((m, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 p-3">
                    <p className="font-semibold text-slate-800">{m.name} <span className="text-xs text-slate-500">({m.dosage})</span></p>
                    <p className="text-xs text-slate-500">{m.frequency}</p>
                    <p className="mt-1 text-sm text-slate-600">{m.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Diet & Activity Guidelines</h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Diet</p>
                  <ul className="space-y-1.5">
                    {plan.dietGuidelines.map((d, i) => <li key={i} className="flex gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />{d}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Activity</p>
                  <ul className="space-y-1.5">
                    {plan.activityGuidelines.map((d, i) => <li key={i} className="flex gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-error-200 bg-error-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-error-700"><AlertTriangle className="h-5 w-5" /> Warning Signs</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {plan.warningSigns.map((w, i) => <div key={i} className="flex gap-2 text-sm text-slate-700"><AlertTriangle className="h-4 w-4 text-error-500 shrink-0 mt-0.5" />{w}</div>)}
            </div>
          </div>
        </div>
      )}

      {tab === 'medications' && (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Current Medications</h2>
          <div className="space-y-3">
            {meds.map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><Pill className="h-5 w-5 text-teal-600" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.dosage} · {m.frequency} · {m.time}</p>
                </div>
                <span className={classNames('badge', m.status === 'taken' ? 'bg-success-100 text-success-700' : m.status === 'skipped' ? 'bg-error-100 text-error-700' : 'bg-slate-100 text-slate-600')}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'recovery' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Recovery Progress</h2>
            <LineChart data={[{ label: 'Wk 1', value: 35 }, { label: 'Wk 2', value: 50 }, { label: 'Wk 3', value: 65 }, { label: 'Wk 4', value: patient.recovery }]} unit="%" height="h-40" />
          </div>
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Recovery History</h2>
            <div className="space-y-3">
              {recovery.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 p-4">
                  <span className="text-sm font-semibold text-slate-800">{r.date}</span>
                  <span className="badge bg-error-50 text-error-700">Pain: {r.painLevel}/10</span>
                  <span className="badge bg-warning-50 text-warning-700">{r.energyLevel}</span>
                  <span className="badge bg-success-50 text-success-700">Recovery: {r.overallRecovery}%</span>
                  <span className="badge bg-primary-50 text-primary-700">{r.woundCondition}</span>
                  <p className="w-full mt-1 text-sm text-slate-600">{r.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'symptoms' && (
        <div className="space-y-4">
          {symptoms.length === 0 ? (
            <div className="card flex flex-col items-center py-12"><Stethoscope className="h-10 w-10 text-slate-300" /><p className="mt-2 text-sm text-slate-500">No symptom reports.</p></div>
          ) : symptoms.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className={classNames('badge', riskConfig[s.risk].badge)}>{riskConfig[s.risk].label} Risk</span>
                <span className="text-xs text-slate-500">{formatDate(s.date)}</span>
              </div>
              <div className="mt-3 space-y-2">
                {s.symptoms.map((sym, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{sym.name}</p>
                      <span className={classNames('badge', sym.severity === 'severe' ? 'bg-error-100 text-error-700' : sym.severity === 'moderate' ? 'bg-warning-100 text-warning-700' : 'bg-success-100 text-success-700')}>{sym.severity}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Started: {sym.started}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{sym.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'followups' && (
        <div className="space-y-4">
          {appts.map((a) => (
            <div key={a.id} className="card flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <span className="text-xs">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-lg font-bold">{new Date(a.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{a.type}</p>
                <p className="text-xs text-slate-500">{a.doctorName} · {a.time}</p>
                {a.notes && <p className="mt-1 text-sm text-slate-600">{a.notes}</p>}
              </div>
              <span className={classNames('badge', a.status === 'confirmed' ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700')}>{a.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="card flex flex-col items-center py-12"><AlertTriangle className="h-10 w-10 text-slate-300" /><p className="mt-2 text-sm text-slate-500">No alerts for this patient.</p></div>
          ) : alerts.map((a) => (
            <div key={a.id} className={classNames('card p-5', a.level === 'critical' ? 'border-error-200' : a.level === 'high' ? 'border-orange-200' : '')}>
              <div className="flex items-center justify-between">
                <span className={classNames('badge', riskConfig[a.level].badge)}>{riskConfig[a.level].label}</span>
                <span className="text-xs text-slate-500">{a.reportedAt}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{a.summary}</p>
              <div className="mt-2 flex gap-2">
                {a.symptoms.map((s, i) => <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{s}</span>)}
              </div>
              <span className={classNames('badge mt-3', a.status === 'active' ? 'bg-error-50 text-error-600' : a.status === 'reviewed' ? 'bg-warning-50 text-warning-600' : 'bg-success-50 text-success-600')}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof HeartPulse; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}
