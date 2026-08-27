import { useState } from 'react';
import { AlertTriangle, Send, Plus, X, Stethoscope, Phone } from 'lucide-react';
import { classNames } from '@/lib/utils';

const availableSymptoms = [
  'Fever', 'Increased Pain', 'Nausea', 'Vomiting', 'Dizziness',
  'Wound Redness', 'Swelling', 'Bleeding', 'Difficulty Breathing', 'Other',
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
  const [selected, setSelected] = useState<SelectedSymptom[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addSymptom = (name: string) => {
    if (selected.find((s) => s.name === name)) return;
    setSelected((prev) => [...prev, { name, severity: 'mild', started: '', description: '' }]);
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
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelected([]);
    }, 3500);
  };

  const hasSevere = selected.some((s) => s.severity === 'severe');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Symptom Reporting</h1>
        <p className="mt-1 text-slate-500">Report any symptoms you're experiencing so your care team can monitor your recovery.</p>
      </div>

      {/* Emergency notice */}
      <div className="flex items-start gap-3 rounded-2xl border-2 border-error-200 bg-error-50 p-4">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-error-600" />
        <p className="text-sm font-medium text-error-700">
          If you are experiencing a medical emergency, contact emergency services immediately. This platform is not a replacement for emergency medical care.
        </p>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700 animate-fade-in">
          <Send className="h-5 w-5" /> Symptom report submitted successfully! Your healthcare team has been notified and will review it shortly.
        </div>
      )}

      {hasSevere && (
        <div className="flex items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm font-medium text-error-700 animate-fade-in">
          <AlertTriangle className="h-5 w-5" /> You've reported a severe symptom. Your care team will prioritize this report. If symptoms worsen, seek immediate medical attention.
        </div>
      )}

      <div className="card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Report Your Symptoms</h2>
          <button onClick={() => setShowPicker((s) => !s)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Symptom
          </button>
        </div>

        {/* Symptom picker */}
        {showPicker && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 animate-fade-in">
            <p className="mb-3 text-sm font-medium text-slate-600">Select a symptom to report:</p>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map((s) => {
                const already = selected.find((x) => x.name === s);
                return (
                  <button
                    key={s}
                    onClick={() => addSymptom(s)}
                    disabled={!!already}
                    className={classNames(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                      already ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400' : 'border-slate-200 bg-white text-slate-700 hover:border-primary-400 hover:bg-primary-50',
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected symptoms */}
        {selected.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Stethoscope className="h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No symptoms selected. Click "Add Symptom" to report what you're experiencing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selected.map((sym) => (
              <div key={sym.name} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{sym.name}</h3>
                  <button onClick={() => removeSymptom(sym.name)} className="rounded-lg p-1 text-slate-400 hover:bg-error-50 hover:text-error-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Severity</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => updateSymptom(sym.name, 'severity', sev)}
                          className={classNames(
                            'rounded-lg border py-2 text-xs font-semibold transition',
                            sym.severity === sev ? `${severityConfig[sev].badge} border-transparent ring-2 ${severityConfig[sev].ring}` : 'border-slate-200 text-slate-500 hover:border-slate-300',
                          )}
                        >
                          {severityConfig[sev].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">When it started</label>
                    <input
                      className="input"
                      value={sym.started}
                      onChange={(e) => updateSymptom(sym.name, 'started', e.target.value)}
                      placeholder="e.g., Today, 2 hours ago, Yesterday"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="label">Additional description</label>
                  <textarea
                    className="input min-h-[70px] resize-y"
                    value={sym.description}
                    onChange={(e) => updateSymptom(sym.name, 'description', e.target.value)}
                    placeholder="Describe the symptom in more detail..."
                  />
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} className="btn-primary w-full py-3">
              <Send className="h-4 w-4" /> Submit Symptom Report
            </button>
          </div>
        )}
      </div>

      {/* Previous reports */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Previous Symptom Reports</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-warning-200 bg-warning-50/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge bg-warning-100 text-warning-700">Medium Risk</span>
                <span className="text-sm font-semibold text-slate-700">August 24, 2026</span>
              </div>
              <span className="text-xs text-slate-500">Reviewed by Dr. Priya Sharma</span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-slate-700"><span className="font-semibold">Increased Pain</span> — Mild · Started 2 days ago</p>
              <p className="text-sm text-slate-600">Slight increase in abdominal pain, manageable with Paracetamol.</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge bg-success-100 text-success-700">Low Risk</span>
                <span className="text-sm font-semibold text-slate-700">August 21, 2026</span>
              </div>
              <span className="text-xs text-slate-500">Reviewed</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-slate-700"><span className="font-semibold">Nausea</span> — Mild · Started on discharge day</p>
              <p className="text-sm text-slate-600">Mild nausea after anesthesia wore off. Resolved with medication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
