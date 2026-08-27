import {
  FileText, HeartPulse, Pill, Apple, Activity, AlertTriangle, Check, Calendar, Stethoscope,
} from 'lucide-react';
import { dischargePlans } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

const plan = dischargePlans[0];

const sections = [
  { icon: HeartPulse, title: 'Wound Care', items: plan.woundCare, color: 'text-primary-600', bg: 'bg-primary-50' },
  { icon: Apple, title: 'Diet Guidelines', items: plan.dietGuidelines, color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Activity, title: 'Activity Guidelines', items: plan.activityGuidelines, color: 'text-accent-600', bg: 'bg-accent-50' },
];

export default function DischargePlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Discharge Plan</h1>
        <p className="mt-1 text-slate-500">Your personalized recovery instructions and guidelines.</p>
      </div>

      {/* Patient info card */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{plan.patientName}</h2>
              <p className="mt-1 text-sm text-primary-100">{plan.surgery}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-primary-200">Surgery Date</p>
                <p className="font-semibold">{formatDate(plan.surgeryDate)}</p>
              </div>
              <div>
                <p className="text-xs text-primary-200">Discharge Date</p>
                <p className="font-semibold">{formatDate(plan.dischargeDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning signs - prominent */}
      <div className="rounded-2xl border-2 border-error-200 bg-error-50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-100">
            <AlertTriangle className="h-5 w-5 text-error-600" />
          </div>
          <h2 className="text-lg font-bold text-error-700">Warning Signs — Contact Your Doctor Immediately</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {plan.warningSigns.map((sign, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-xl bg-white p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-error-500" />
              <span className="text-sm font-medium text-slate-700">{sign}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Three guideline sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {sections.map((s, i) => (
          <div key={i} className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
            </div>
            <ul className="space-y-2.5">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Medication instructions */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
            <Pill className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Medication Instructions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.medicationInstructions.map((med, i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{med.name}</p>
                <span className="badge bg-teal-50 text-teal-700">{med.dosage}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">{med.frequency}</p>
              <p className="mt-2 text-sm text-slate-600">{med.instructions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up recommendations */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
            <Calendar className="h-5 w-5 text-accent-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Follow-Up Recommendations</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{plan.followUpRecommendations}</p>
      </div>

      {/* Emergency notice */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Stethoscope className="h-5 w-5 shrink-0 text-slate-500" />
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">In case of emergency:</span> Call your local emergency number immediately. This platform is not a substitute for emergency medical care.
        </p>
      </div>
    </div>
  );
}
