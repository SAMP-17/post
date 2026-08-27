export type Role = 'patient' | 'doctor';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type MedicationStatus = 'taken' | 'pending' | 'upcoming' | 'skipped';

export type AppointmentStatus = 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  // Patient fields
  age?: number;
  gender?: string;
  dateOfBirth?: string;
  patientId?: string;
  emergencyContact?: string;
  hospital?: string;
  // Doctor fields
  professionalId?: string;
  department?: string;
  specialization?: string;
  clinic?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  status: MedicationStatus;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  surgery: string;
  surgeryDate: string;
  dischargeDate: string;
  recovery: number;
  risk: RiskLevel;
  avatar?: string;
  phone: string;
  email: string;
  patientId: string;
  hospital: string;
  emergencyContact: string;
  lastUpdate: string;
  medicationAdherence: number;
  nextAppointment?: string;
}

export interface DischargePlan {
  patientId: string;
  patientName: string;
  surgery: string;
  surgeryDate: string;
  dischargeDate: string;
  woundCare: string[];
  medicationInstructions: { name: string; dosage: string; frequency: string; instructions: string }[];
  dietGuidelines: string[];
  activityGuidelines: string[];
  warningSigns: string[];
  followUpRecommendations: string;
}

export interface RecoveryEntry {
  id: string;
  patientId: string;
  date: string;
  painLevel: number;
  energyLevel: string;
  overallRecovery: number;
  woundCondition: string;
  notes: string;
}

export interface SymptomReport {
  id: string;
  patientId: string;
  patientName: string;
  symptoms: { name: string; severity: 'mild' | 'moderate' | 'severe'; started: string; description: string }[];
  date: string;
  risk: RiskLevel;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'medication' | 'appointment' | 'recovery' | 'alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  role: Role;
}

export interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  level: RiskLevel;
  symptoms: string[];
  reportedAt: string;
  status: 'active' | 'reviewed' | 'resolved';
  summary: string;
}
