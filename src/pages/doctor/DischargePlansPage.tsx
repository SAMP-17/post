import { useState } from 'react';
import {
  FileText,
  Plus,
  Edit3,
  Eye,
  Save,
  X,
  Stethoscope,
  Pill,
  Apple,
  Activity,
  AlertTriangle,
  Calendar,
  Search,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { patients, dischargePlans as initialPlans } from '@/data/mockData';
import { formatDate, classNames } from '@/lib/utils';
import type { DischargePlan } from '@/types';

interface MedInstruction {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

const emptyPlanForm = {
  patientId: '',
  patientName: '',
  surgery: '',
  surgeryDate: '',
  dischargeDate: '',
  woundCare: '',
  dietGuidelines: '',
  activityGuidelines: '',
  warningSigns: '',
  followUpRecommendations: '',
  medications: [
    { name: '', dosage: '', frequency: '', instructions: '' },
  ] as MedInstruction[],
};

export default function DischargePlansPage() {
  const [plans, setPlans] = useState<DischargePlan[]>(initialPlans);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewPlan, setViewPlan] = useState<DischargePlan | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const [form, setForm] = useState(emptyPlanForm);

  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  const openCreateModal = (patientId = '') => {
    setEditingId(null);
    if (patientId) {
      const p = patients.find((pt) => pt.id === patientId);
      setForm({
        ...emptyPlanForm,
        patientId,
        patientName: p ? p.name : '',
        surgery: p ? p.surgery : '',
        surgeryDate: p ? p.surgeryDate : '',
        dischargeDate: p ? p.dischargeDate : '',
        medications: [{ name: '', dosage: '', frequency: '', instructions: '' }],
      });
    } else {
      setForm({
        ...emptyPlanForm,
        medications: [{ name: '', dosage: '', frequency: '', instructions: '' }],
      });
    }
    setModalOpen(true);
  };

  const openEditModal = (plan: DischargePlan) => {
    setEditingId(plan.patientId);
    setForm({
      patientId: plan.patientId,
      patientName: plan.patientName,
      surgery: plan.surgery,
      surgeryDate: plan.surgeryDate,
      dischargeDate: plan.dischargeDate,
      woundCare: plan.woundCare.join('\n'),
      dietGuidelines: plan.dietGuidelines.join('\n'),
      activityGuidelines: plan.activityGuidelines.join('\n'),
      warningSigns: plan.warningSigns.join('\n'),
      followUpRecommendations: plan.followUpRecommendations,
      medications: plan.medicationInstructions.length
        ? plan.medicationInstructions.map((m) => ({ ...m }))
        : [{ name: '', dosage: '', frequency: '', instructions: '' }],
    });
    setModalOpen(true);
  };

  const handlePatientSelect = (patientId: string) => {
    const p = patients.find((pt) => pt.id === patientId);
    if (!p) {
      setForm((prev) => ({ ...prev, patientId: '', patientName: '' }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      patientId: p.id,
      patientName: p.name,
      surgery: prev.surgery || p.surgery,
      surgeryDate: prev.surgeryDate || p.surgeryDate,
      dischargeDate: prev.dischargeDate || p.dischargeDate,
    }));
  };

  const handleMedChange = (index: number, field: keyof MedInstruction, val: string) => {
    setForm((prev) => {
      const nextMeds = [...prev.medications];
      nextMeds[index] = { ...nextMeds[index], [field]: val };
      return { ...prev, medications: nextMeds };
    });
  };

  const addMedRow = () => {
    setForm((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', instructions: '' }],
    }));
  };

  const removeMedRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!form.patientId) {
      alert('Please select a patient');
      return;
    }

    const patient = patients.find((p) => p.id === form.patientId);
    const patientName = form.patientName || (patient ? patient.name : 'Unknown Patient');

    const cleanList = (text: string) =>
      text
        .split('\n')
        .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

    const validMeds = form.medications.filter((m) => m.name.trim() !== '');

    const newPlan: DischargePlan = {
      patientId: form.patientId,
      patientName,
      surgery: form.surgery || (patient ? patient.surgery : 'Post-Operative Recovery'),
      surgeryDate: form.surgeryDate || new Date().toISOString().split('T')[0],
      dischargeDate: form.dischargeDate || new Date().toISOString().split('T')[0],
      woundCare: cleanList(form.woundCare).length ? cleanList(form.woundCare) : ['Keep the surgical site clean and dry'],
      medicationInstructions: validMeds.length
        ? validMeds
        : [{ name: 'Paracetamol', dosage: '500 mg', frequency: 'As needed', instructions: 'For pain relief' }],
      dietGuidelines: cleanList(form.dietGuidelines).length ? cleanList(form.dietGuidelines) : ['Eat light, balanced meals and stay well hydrated'],
      activityGuidelines: cleanList(form.activityGuidelines).length ? cleanList(form.activityGuidelines) : ['Rest and avoid heavy lifting for 2 weeks'],
      warningSigns: cleanList(form.warningSigns).length ? cleanList(form.warningSigns) : ['High fever (>100.4°F)', 'Severe persistent pain', 'Wound redness or discharge'],
      followUpRecommendations: form.followUpRecommendations || 'Routine follow-up in 2 weeks. Contact clinic if any warning signs develop.',
    };

    setPlans((prev) => {
      const existsIndex = prev.findIndex((p) => p.patientId === form.patientId);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = newPlan;
        return next;
      }
      return [newPlan, ...prev];
    });

    setModalOpen(false);
    showBanner(`Discharge plan for ${patientName} has been ${editingId ? 'updated' : 'created'} successfully!`);
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.surgery.toLowerCase().includes(search.toLowerCase())
  );

  const patientsWithoutPlan = patients.filter((p) => !plans.some((d) => d.patientId === p.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discharge Plan Management</h1>
          <p className="mt-1 text-slate-500">Create, customize, and monitor discharge plans for your patients.</p>
        </div>
        <button onClick={() => openCreateModal()} className="btn-primary">
          <Plus className="h-4 w-4" /> Create Discharge Plan
        </button>
      </div>

      {/* Banner */}
      {bannerMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-semibold text-success-800 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-success-600" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Search and Counts */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name or surgery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 text-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>
              <strong className="text-slate-800">{plans.length}</strong> Total Plans
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-800">{patientsWithoutPlan.length}</strong> Pending
            </span>
          </div>
        </div>
      </div>

      {/* Existing plans grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Active Discharge Plans</h2>
        {filteredPlans.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No discharge plans match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredPlans.map((p) => (
              <div key={p.patientId} className="card p-5 transition hover:shadow-soft">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.patientName} size="md" />
                    <div>
                      <p className="font-bold text-slate-900">{p.patientName}</p>
                      <p className="text-xs text-slate-500">{p.surgery}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewPlan(p)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition"
                      title="View Plan Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(p)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Edit Plan"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-xs text-slate-400">Surgery Date</p>
                    <p className="font-semibold text-slate-700">{formatDate(p.surgeryDate)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-xs text-slate-400">Discharge Date</p>
                    <p className="font-semibold text-slate-700">{formatDate(p.dischargeDate)}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge bg-primary-50 text-primary-700">
                    {p.woundCare.length} wound care steps
                  </span>
                  <span className="badge bg-teal-50 text-teal-700">
                    {p.medicationInstructions.length} medications
                  </span>
                  <span className="badge bg-accent-50 text-accent-700">
                    {p.warningSigns.length} warning signs
                  </span>
                </div>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setViewPlan(p)}
                    className="btn bg-primary-50 text-primary-700 hover:bg-primary-100 flex-1 py-1.5 text-xs font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Plan
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 flex-1 py-1.5 text-xs font-semibold"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patients without plans */}
      {patientsWithoutPlan.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Patients Pending Discharge Plan</h2>
            <span className="badge bg-warning-100 text-warning-800">
              {patientsWithoutPlan.length} patient{patientsWithoutPlan.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patientsWithoutPlan.map((p) => (
              <div key={p.id} className="card border-dashed p-5 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} size="md" />
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.surgery}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Discharge: {formatDate(p.dischargeDate)}</span>
                  <span className="font-semibold text-warning-600">Plan Needed</span>
                </div>
                <button
                  onClick={() => openCreateModal(p.id)}
                  className="btn-primary mt-4 w-full py-2 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? `Edit Discharge Plan — ${form.patientName}` : 'Create Discharge Plan'}
        size="xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="h-4 w-4" /> {editingId ? 'Update Discharge Plan' : 'Save & Publish Plan'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Patient selection & Surgery Info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <Stethoscope className="h-4 w-4 text-primary-600" /> Patient & Surgery Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Patient *</label>
                <select
                  className="input"
                  value={form.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  disabled={!!editingId}
                >
                  <option value="">Select patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.surgery}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Surgery Procedure</label>
                <input
                  className="input"
                  value={form.surgery}
                  onChange={(e) => setForm({ ...form, surgery: e.target.value })}
                  placeholder="e.g., Laparoscopic Appendectomy"
                />
              </div>
              <div>
                <label className="label">Surgery Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.surgeryDate}
                  onChange={(e) => setForm({ ...form, surgeryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 max-w-xs">
              <label className="label">Discharge Date</label>
              <input
                type="date"
                className="input"
                value={form.dischargeDate}
                onChange={(e) => setForm({ ...form, dischargeDate: e.target.value })}
              />
            </div>
          </div>

          {/* Wound Care */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <Activity className="h-4 w-4 text-teal-600" /> Wound Care Instructions
            </h3>
            <p className="mb-2 text-xs text-slate-500">Enter each instruction on a new line.</p>
            <textarea
              className="input min-h-[90px] resize-y"
              value={form.woundCare}
              onChange={(e) => setForm({ ...form, woundCare: e.target.value })}
              placeholder="Keep incision clean and dry&#10;Change dressing daily using sterile gauze&#10;Inspect site twice daily for redness or discharge"
            />
          </div>

          {/* Medications */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                <Pill className="h-4 w-4 text-accent-600" /> Prescribed Medications
              </h3>
              <button
                type="button"
                onClick={addMedRow}
                className="btn bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add Medication
              </button>
            </div>
            <div className="space-y-2">
              {form.medications.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
                  <div className="flex-1 grid gap-2 sm:grid-cols-4">
                    <input
                      className="input text-xs"
                      placeholder="Med Name (e.g. Amoxicillin)"
                      value={m.name}
                      onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                    />
                    <input
                      className="input text-xs"
                      placeholder="Dosage (e.g. 500 mg)"
                      value={m.dosage}
                      onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                    />
                    <input
                      className="input text-xs"
                      placeholder="Frequency (e.g. 3x daily)"
                      value={m.frequency}
                      onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                    />
                    <input
                      className="input text-xs"
                      placeholder="Instructions (e.g. With food)"
                      value={m.instructions}
                      onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                    />
                  </div>
                  {form.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedRow(idx)}
                      className="self-end rounded-lg p-1.5 text-slate-400 hover:bg-error-50 hover:text-error-600 sm:self-center"
                      title="Remove Medication"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Diet & Activity Guidelines */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                <Apple className="h-4 w-4 text-emerald-600" /> Diet Guidelines (one per line)
              </h3>
              <textarea
                className="input min-h-[90px] resize-y"
                value={form.dietGuidelines}
                onChange={(e) => setForm({ ...form, dietGuidelines: e.target.value })}
                placeholder="Eat light meals for 3 days&#10;Drink at least 8 glasses of water daily&#10;Avoid spicy or oily foods"
              />
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                <Activity className="h-4 w-4 text-primary-600" /> Activity Guidelines (one per line)
              </h3>
              <textarea
                className="input min-h-[90px] resize-y"
                value={form.activityGuidelines}
                onChange={(e) => setForm({ ...form, activityGuidelines: e.target.value })}
                placeholder="Short 10-minute walks every 2 hours&#10;No heavy lifting (>5 kg) for 2 weeks&#10;Do not drive until cleared by surgeon"
              />
            </div>
          </div>

          {/* Warning Signs & Follow-Up */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                <AlertTriangle className="h-4 w-4 text-error-600" /> Warning Signs (one per line)
              </h3>
              <textarea
                className="input min-h-[90px] resize-y"
                value={form.warningSigns}
                onChange={(e) => setForm({ ...form, warningSigns: e.target.value })}
                placeholder="High fever above 101°F&#10;Severe increasing pain&#10;Pus or heavy bleeding from incision&#10;Difficulty breathing"
              />
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                <Calendar className="h-4 w-4 text-indigo-600" /> Follow-Up Recommendations
              </h3>
              <textarea
                className="input min-h-[90px] resize-y"
                value={form.followUpRecommendations}
                onChange={(e) => setForm({ ...form, followUpRecommendations: e.target.value })}
                placeholder="Clinic appointment in 10-14 days for suture removal. Call emergency line if any warning signs occur."
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Plan Modal */}
      <Modal
        open={!!viewPlan}
        onClose={() => setViewPlan(null)}
        title={viewPlan ? `Discharge Plan — ${viewPlan.patientName}` : ''}
        size="xl"
        footer={
          <>
            <button onClick={() => setViewPlan(null)} className="btn-secondary">
              Close
            </button>
            {viewPlan && (
              <button
                onClick={() => {
                  const p = viewPlan;
                  setViewPlan(null);
                  openEditModal(p);
                }}
                className="btn-primary"
              >
                <Edit3 className="h-4 w-4" /> Edit This Plan
              </button>
            )}
          </>
        }
      >
        {viewPlan && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 p-5">
              <div className="flex items-center gap-3">
                <Avatar name={viewPlan.patientName} size="lg" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewPlan.patientName}</h3>
                  <p className="text-sm font-semibold text-primary-700">{viewPlan.surgery}</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <div className="rounded-xl bg-white/80 p-2.5">
                  <p className="text-slate-400">Surgery</p>
                  <p className="text-slate-800">{formatDate(viewPlan.surgeryDate)}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2.5">
                  <p className="text-slate-400">Discharge</p>
                  <p className="text-slate-800">{formatDate(viewPlan.dischargeDate)}</p>
                </div>
              </div>
            </div>

            {/* Wound Care */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                <Activity className="h-4 w-4 text-teal-600" /> Wound Care Steps
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                {viewPlan.woundCare.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Medications */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                <Pill className="h-4 w-4 text-accent-600" /> Prescribed Medications
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {viewPlan.medicationInstructions.map((m, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3 text-xs">
                    <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                    <p className="text-slate-600 font-medium">{m.dosage} · {m.frequency}</p>
                    {m.instructions && <p className="mt-1 text-slate-500 italic">{m.instructions}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Diet & Activity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                  <Apple className="h-4 w-4 text-emerald-600" /> Diet Guidelines
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  {viewPlan.dietGuidelines.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                  <Activity className="h-4 w-4 text-primary-600" /> Activity Guidelines
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  {viewPlan.activityGuidelines.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Warning signs */}
            <div className="rounded-xl border border-error-200 bg-error-50/50 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-error-800">
                <AlertTriangle className="h-4 w-4 text-error-600" /> Red Flags / Warning Signs
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-error-900">
                {viewPlan.warningSigns.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Follow up */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                <Calendar className="h-4 w-4 text-indigo-600" /> Follow-Up Recommendations
              </h4>
              <p className="text-sm text-slate-700">{viewPlan.followUpRecommendations}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
