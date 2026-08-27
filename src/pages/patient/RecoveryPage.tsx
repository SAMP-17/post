import { useState } from 'react';
import { Activity, TrendingUp, Send, Heart, Zap, Shield, FileText } from 'lucide-react';
import { LineChart } from '@/components/ui/Charts';
import { classNames } from '@/lib/utils';

const energyLevels = ['Very Low', 'Low', 'Normal', 'Good', 'Excellent'];
const woundConditions = ['Improving', 'Normal', 'Slight Concern', 'Needs Attention'];

export default function RecoveryPage() {
  const [painLevel, setPainLevel] = useState(3);
  const [energy, setEnergy] = useState('Good');
  const [recovery, setRecovery] = useState(72);
  const [wound, setWound] = useState('Improving');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const history = [
    { date: 'Aug 27', pain: 3, energy: 'Good', recovery: 72, wound: 'Improving', notes: 'Feeling much better today. Wound looks clean.' },
    { date: 'Aug 26', pain: 4, energy: 'Normal', recovery: 68, wound: 'Normal', notes: 'Slight discomfort near incision site in the morning.' },
    { date: 'Aug 25', pain: 5, energy: 'Normal', recovery: 65, wound: 'Normal', notes: 'Had a restless night. Pain manageable with Paracetamol.' },
    { date: 'Aug 24', pain: 5, energy: 'Low', recovery: 60, wound: 'Slight Concern', notes: 'Feeling tired. Reduced appetite. Wound slightly red.' },
    { date: 'Aug 23', pain: 6, energy: 'Low', recovery: 55, wound: 'Normal', notes: 'More pain today. Resting most of the day.' },
    { date: 'Aug 22', pain: 6, energy: 'Very Low', recovery: 50, wound: 'Normal', notes: 'First full day home. Managing with medications.' },
  ];

  const woundBadge = (w: string) => {
    const map: Record<string, string> = {
      'Improving': 'bg-success-100 text-success-700',
      'Normal': 'bg-primary-100 text-primary-700',
      'Slight Concern': 'bg-warning-100 text-warning-700',
      'Needs Attention': 'bg-error-100 text-error-700',
    };
    return map[w] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recovery Tracking</h1>
        <p className="mt-1 text-slate-500">Submit your daily recovery update and track your progress over time.</p>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-700 animate-fade-in">
          <Send className="h-5 w-5" /> Recovery update submitted successfully! Your care team has been notified.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily recovery form */}
        <div className="card p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Daily Recovery Update</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pain level */}
            <div>
              <label className="label flex items-center justify-between">
                <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-error-500" /> Pain Level</span>
                <span className="text-lg font-bold text-slate-900">{painLevel}/10</span>
              </label>
              <input type="range" min={0} max={10} value={painLevel} onChange={(e) => setPainLevel(Number(e.target.value))} className="w-full" />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>No pain</span><span>Severe</span>
              </div>
            </div>

            {/* Energy level */}
            <div>
              <label className="label flex items-center gap-2"><Zap className="h-4 w-4 text-warning-500" /> Energy Level</label>
              <div className="grid grid-cols-5 gap-2">
                {energyLevels.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEnergy(e)}
                    className={classNames(
                      'rounded-xl border py-2 text-xs font-semibold transition',
                      energy === e ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300',
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall recovery */}
            <div>
              <label className="label flex items-center justify-between">
                <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success-500" /> Overall Recovery</span>
                <span className="text-lg font-bold text-slate-900">{recovery}%</span>
              </label>
              <input type="range" min={0} max={100} value={recovery} onChange={(e) => setRecovery(Number(e.target.value))} className="w-full" />
            </div>

            {/* Wound condition */}
            <div>
              <label className="label flex items-center gap-2"><Shield className="h-4 w-4 text-primary-500" /> Wound Condition</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {woundConditions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWound(w)}
                    className={classNames(
                      'rounded-xl border py-2 text-xs font-semibold transition',
                      wound === w ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-300',
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Additional Notes</label>
              <textarea
                className="input min-h-[100px] resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe how you're feeling today, any concerns, or improvements you've noticed..."
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              <Send className="h-4 w-4" /> Submit Recovery Update
            </button>
          </form>
        </div>

        {/* Progress chart and summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Recovery Progress</h2>
            <LineChart
              data={[
                { label: 'Wk 1', value: 35 },
                { label: 'Wk 2', value: 50 },
                { label: 'Wk 3', value: 65 },
                { label: 'Wk 4', value: 72 },
              ]}
              unit="%"
              height="h-40"
            />
          </div>
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Pain Level Trend</h2>
            <LineChart
              data={[
                { label: 'Day 1', value: 7 },
                { label: 'Day 3', value: 6 },
                { label: 'Day 5', value: 5 },
                { label: 'Day 7', value: 5 },
                { label: 'Day 10', value: 4 },
                { label: 'Day 14', value: 3 },
              ]}
              max={10}
              unit=""
              height="h-40"
            />
          </div>
        </div>
      </div>

      {/* Recovery history */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Recovery History</h2>
        <div className="space-y-3">
          {history.map((e, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-700">
                {e.date}
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <span className="badge bg-error-50 text-error-700">Pain: {e.pain}/10</span>
                <span className="badge bg-warning-50 text-warning-700">{e.energy}</span>
                <span className="badge bg-success-50 text-success-700">Recovery: {e.recovery}%</span>
                <span className={classNames('badge', woundBadge(e.wound))}>{e.wound}</span>
              </div>
              <p className="w-full text-sm text-slate-600">{e.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
