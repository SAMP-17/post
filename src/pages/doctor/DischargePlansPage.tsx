import { useState } from 'react';
import { FileText, Plus, Edit3, Eye, Save, X, Stethoscope, Pill, Apple, Activity, AlertTriangle, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { patients, dischargePlans } from '@/data/mockData';
import { formatDate, classNames } from '@/lib/utils';

export default function DischargePlansPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [plan, setPlan] = useState({
    surgeryType: '', surgeryDate: '', dischargeDate: '',
    woundCare: '', diet: '', activity: '', followUp: '',
  });

  const handleSave = () => {
    setCreateOpen(false);
    setPlan({ surgeryType: '', surgeryDate: '', dischargeDate: '', woundCare: '', diet: '', activity: '', followUp: '' });
    setSelectedPatient('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discharge Plan Management</h1>
          <p className="mt-1 text-slate-500">Create and manage discharge plans for your patients.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Create Discharge Plan</button>
      </div>

      {/* Existing plans */}
      <div className="grid gap-4 lg:grid-cols-2">
        {dischargePlans.map((p) => {
          const patient = patients.find((pt) => pt.id === p.patientId);
          return (
            <div key={p.patientId} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={p.patientName} size="md" />
                  <div>
                    <p className="font-bold text-slate-900">{p.patientName}</p>
                    <p className="text-xs text-slate-500">{p.surgery}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Eye className="h-4 w-4" /></button>
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Edit3 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-slate-400">Surgery Date</p><p className="font-medium text-slate-700">{formatDate(p.surgeryDate)}</p></div>
                <div><p className="text-xs text-slate-400">Discharge Date</p><p className="font-medium text-slate-700">{formatDate(p.dischargeDate)}</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="badge bg-primary-50 text-primary-700">{p.woundCare.length} wound care steps</span>
                <span className="badge bg-teal-50 text-teal-700">{p.medicationInstructions.length} medications</span>
                <span className="badge bg-accent-50 text-accent-700">{p.warningSigns.length} warning signs</span>
              </div>
            </div>
          );
        })}

        {/* Patients without plans */}
        {patients.filter((p) => !dischargePlans.find((d) => d.patientId === p.id)).slice(0, 4).map((p) => (
          <div key={p.id} className="card border-dashed p-5">
            <div className="flex items-center gap-3">
              <Avatar name={p.name} size="md" />
              <div>
                <p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.surgery}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">No discharge plan created yet.</p>
            <button onClick={() => { setSelectedPatient(p.id); setCreateOpen(true); }} className="btn-secondary mt-3 w-full"><Plus className="h-4 w-4" /> Create Plan</button>
          </div>
        ))}
      </div>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Discharge Plan"
        size="xl"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={handleSave} className="btn-primary"><Save className="h-4 w-4" /> Save Discharge Plan</button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Surgery info */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Stethoscope className="h-4 w-4" /> Surgery Information</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Patient</label>
                <select className="input" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.surgery}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Surgery Type</label>
                <input className="input" value={plan.surgeryType} onChange={(e) => setPlan({ ...plan, surgeryType: e.target.value })} placeholder="e.g., Appendectomy" />
              </div>
              <div>
                <label className="label">Surgery Date</label>
                <input type="date" className="input" value={plan.surgeryDate} onChange={(e) => setPlan({ ...plan, surgeryDate: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Discharge Date</label>
              <input type="date" className="input" value={plan.dischargeDate} onChange={(e) => setPlan({ ...plan, dischargeDate: e.target.value })} />
            </div>
          </div>

          {/* Wound care */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Activity className="h-4 w-4" /> Wound Care Instructions</h3>
            <textarea className="input min-h-[80px] resize-y" value={plan.woundCare} onChange={(e) => setPlan({ ...plan, woundCare: e.target.value })} placeholder="Enter wound care instructions..." />
          </div>

          {/* Medications */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Pill className="h-4 w-4" /> Medication Instructions</h3>
            <div className="space-y-2">
              {[
                { name: 'Amoxicillin', dosage: '500 mg', freq: '3x daily' },
                { name: 'Paracetamol', dosage: '650 mg', freq: 'Every 6h PRN' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <Pill className="h-5 w-5 text-teal-500" />
                  <span className="flex-1 text-sm font-medium text-slate-700">{m.name} — {m.dosage} — {m.freq}</span>
                  <button className="text-slate-400 hover:text-error-500"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add Medication</button>
            </div>
          </div>

          {/* Diet & Activity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Apple className="h-4 w-4" /> Diet Guidelines</h3>
              <textarea className="input min-h-[80px] resize-y" value={plan.diet} onChange={(e) => setPlan({ ...plan, diet: e.target.value })} placeholder="Enter diet guidelines..." />
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Activity className="h-4 w-4" /> Activity Guidelines</h3>
              <textarea className="input min-h-[80px] resize-y" value={plan.activity} onChange={(e) => setPlan({ ...plan, activity: e.target.value })} placeholder="Enter activity guidelines..." />
            </div>
          </div>

          {/* Follow-up */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500"><Calendar className="h-4 w-4" /> Follow-Up Recommendations</h3>
            <textarea className="input min-h-[80px] resize-y" value={plan.followUp} onChange={(e) => setPlan({ ...plan, followUp: e.target.value })} placeholder="Enter follow-up recommendations..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
