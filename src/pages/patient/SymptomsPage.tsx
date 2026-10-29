import { useState } from 'react';
import {
  AlertTriangle,
  Send,
  Plus,
  X,
  Stethoscope,
  Phone,
  CheckCircle2,
  Clock,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { symptomReports as initialReports } from '@/data/mockData';
import { classNames, formatDate, riskConfig } from '@/lib/utils';
import type { SymptomReport, RiskLevel } from '@/types';

const availableSymptoms = [
  'Fever',
  'Increased Pain',
  'Nausea',
  'Vomiting',
  'Dizziness',
  'Wound Redness',
  'Swelling',
  'Bleeding',
  'Difficulty Breathing',
  'Other Discomfort',
];

const severityConfig = {
  mild: { label: 'Mild', badge: 'bg-success-100 text-success-700', ring: 'ring-success-500' },
  moderate: { label: 'Moderate', badge: 'bg-warning-100 text-warning-700', ring: 'ring-warning-500' },
  severe: { label: 'Severe', badge: 'bg-error-100 text-error-700', ring: 'ring-error-500' },
};

interface SelectedSymptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  started: string;
  description: string;
}

export default function SymptomsPage() {
  const { user } = useAuth();
  const currentPatientId = user?.patientId || user?.id || 'p1';

  // Initialize reports: filter for current patient, or provide patient p1's reports
  const patientInitialReports = initialReports.filter(
    (r) => r.patientId === currentPatientId || r.patientId === 'p1'
  );

  const [reports, setReports] = useState<SymptomReport[]>(patientInitialReports);
  const [selected, setSelected] = useState<SelectedSymptom[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const addSymptom = (name: string) => {
    if (selected.find((s) => s.name === name)) return;
    setSelected((prev) => [
      ...prev,
      { name, severity: 'mild', started: 'Today', description: '' },
    ]);
    setShowPicker(false);
  };

  const removeSymptom = (name: string) => {
    setSelected((prev) => prev.filter((s) => s.name !== name));
  };

  const updateSymptom = (name: string, field: keyof SelectedSymptom, value: string) => {
    setSelected((prev) => prev.map((s) => (s.name === name ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      alert('Please add at least one symptom before submitting your report.');
      return;
    }

    // Determine clinical risk
    let computedRisk: RiskLevel = 'low';
    const hasSevere = selected.some((s) => s.severity === 'severe');
    const hasModerate = selected.some((s) => s.severity === 'moderate');
    const hasCriticalSymptoms = selected.some(
      (s) =>
        s.severity === 'severe' &&
        (s.name.includes('Breathing') || s.name.includes('Bleeding') || s.name.includes('Dizziness'))
    );

    if (hasCriticalSymptoms) {
      computedRisk = 'critical';
    } else if (hasSevere) {
      computedRisk = 'high';
    } else if (hasModerate) {
      computedRisk = 'medium';
    } else {
      computedRisk = 'low';
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newReport: SymptomReport = {
      id: `s-${Date.now()}`,
      patientId: currentPatientId,
      patientName: user?.name || 'John Kumar',
      date: todayStr,
      risk: computedRisk,
      symptoms: selected.map((s) => ({
        name: s.name,
        severity: s.severity,
        started: s.started.trim() || 'Today',
        description: s.description.trim() || 'Reported through symptom check-in.',
      })),
    };

    // Prepend new report to state so it displays immediately!
    setReports((prev) => [newReport, ...prev]);
    setSelected([]);
    setSuccessBanner('Your symptom report has been submitted successfully and added to your care log below!');
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const hasSevere = selected.some((s) => s.severity === 'severe');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Symptom Reporting</h1>
        <p className="mt-1 text-slate-500">
          Report any symptoms you're experiencing so your care team can monitor your recovery and take action.
        </p>
      </div>

      {/* Emergency Notice */}
      <div className="flex items-start gap-3 rounded-2xl border-2 border-error-200 bg-error-50 p-4">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-error-600" />
        <p className="text-sm font-medium text-error-800">
          If you are experiencing a medical emergency (chest pain, severe shortness of breath, heavy bleeding),
          please contact emergency services (112 / 911) or your hospital immediately.
        </p>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3.5 text-sm font-semibold text-success-800 animate-fade-in shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Severe Warning Alert */}
      {hasSevere && (
        <div className="flex items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm font-semibold text-error-700 animate-fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            You have selected a severe symptom. Submitting will flag this report with high urgency to your doctor.
          </span>
        </div>
      )}

      {/* Reporting Card */}
      <div className="card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Report Today's Symptoms</h2>
            <p className="text-xs text-slate-500">Select any symptoms that have started or worsened.</p>
          </div>
          <button onClick={() => setShowPicker((s) => !s)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Symptom
          </button>
        </div>

        {/* Symptom picker */}
        {showPicker && (
          <div className="mb-5 rounded-2xl border border-primary-200 bg-primary-50/40 p-4 animate-fade-in">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-800">
              Choose symptoms to report:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map((s) => {
                const already = selected.find((x) => x.name === s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSymptom(s)}
                    disabled={!!already}
                    className={classNames(
                      'rounded-xl border px-3 py-1.5 text-xs font-semibold transition',
                      already
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-400 hover:bg-primary-50 shadow-sm'
                    )}
                  >
                    + {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Symptoms List */}
        {selected.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-slate-100">
            <Stethoscope className="h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">No symptoms currently queued.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Click the "Add Symptom" button above to select and document what you are experiencing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {selected.map((sym) => (
              <div key={sym.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{sym.name}</h3>
                  <button
                    type="button"
                    onClick={() => removeSymptom(sym.name)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-error-50 hover:text-error-600 transition"
                    title="Remove symptom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => updateSymptom(sym.name, 'severity', sev)}
                          className={classNames(
                            'rounded-lg border py-2 text-xs font-bold transition',
                            sym.severity === sev
                              ? `${severityConfig[sev].badge} border-transparent ring-2 ${severityConfig[sev].ring}`
                              : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                          )}
                        >
                          {severityConfig[sev].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">When did it start?</label>
                    <input
                      className="input text-xs"
                      value={sym.started}
                      onChange={(e) => updateSymptom(sym.name, 'started', e.target.value)}
                      placeholder="e.g., Today morning, 2 hours ago, Yesterday evening"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="label">Additional notes for your doctor</label>
                  <textarea
                    className="input min-h-[70px] resize-y text-xs"
                    value={sym.description}
                    onChange={(e) => updateSymptom(sym.name, 'description', e.target.value)}
                    placeholder="Describe how it feels, what triggers it, or if it responds to pain relievers..."
                  />
                </div>
              </div>
            ))}

            <button type="submit" className="btn-primary w-full py-3 font-semibold text-sm">
              <Send className="h-4 w-4" /> Submit Symptom Report to Care Team
            </button>
          </form>
        )}
      </div>

      {/* Previous Symptom Reports Section */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Previous Symptom Reports</h2>
            <p className="text-xs text-slate-500">History of all symptoms submitted by you.</p>
          </div>
          <span className="badge bg-slate-100 text-slate-700 font-semibold">
            {reports.length} report{reports.length !== 1 ? 's' : ''} logged
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileCheck className="h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No previous symptom reports found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className={classNames(
                  'rounded-xl border p-4 transition bg-white shadow-sm',
                  report.risk === 'critical'
                    ? 'border-error-200 bg-error-50/20'
                    : report.risk === 'high'
                    ? 'border-orange-200 bg-orange-50/20'
                    : report.risk === 'medium'
                    ? 'border-warning-200 bg-warning-50/20'
                    : 'border-slate-200'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={classNames('badge', riskConfig[report.risk].badge)}>
                      <span className={classNames('h-1.5 w-1.5 rounded-full', riskConfig[report.risk].dot)} />
                      {riskConfig[report.risk].label} Risk
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {formatDate(report.date)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" /> Logged on {report.date}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {report.symptoms.map((s, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 p-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                        <span
                          className={classNames(
                            'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                            severityConfig[s.severity]?.badge || 'bg-slate-200 text-slate-700'
                          )}
                        >
                          {s.severity}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600">Started:</span> {s.started}
                      </p>
                      {s.description && (
                        <p className="mt-1 text-slate-700 bg-white p-2 rounded border border-slate-100">
                          {s.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
