import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './db.js';

import User from './models/User.js';
import Patient from './models/Patient.js';
import Medication from './models/Medication.js';
import DischargePlan from './models/DischargePlan.js';
import RecoveryEntry from './models/RecoveryEntry.js';
import SymptomReport from './models/SymptomReport.js';
import Appointment from './models/Appointment.js';
import Notification from './models/Notification.js';
import RiskAlert from './models/RiskAlert.js';

// ── Users ────────────────────────────────────────────────────────────────────
const users = [
  {
    role: 'patient', name: 'John Kumar', email: 'patient@caretrack.com',
    password: await bcrypt.hash('patient123', 10),
    phone: '+91 98765 43210', age: 32, gender: 'Male',
    dateOfBirth: '1994-03-15', patientId: 'PT-2026-0042',
    emergencyContact: '+91 98765 11111 (Anita Kumar, Wife)',
    hospital: 'City Care Hospital',
  },
  {
    role: 'doctor', name: 'Dr. Priya Sharma', email: 'doctor@caretrack.com',
    password: await bcrypt.hash('doctor123', 10),
    phone: '+91 99876 54321',
    professionalId: 'DR-MCI-48217', department: 'General Surgery',
    specialization: 'General Surgeon', clinic: 'City Care Hospital',
  },
];

// ── Patients ─────────────────────────────────────────────────────────────────
const patients = [
  { _ref: 'p1', name: 'John Kumar', age: 32, gender: 'Male', surgery: 'Laparoscopic Appendectomy', surgeryDate: '2026-08-18', dischargeDate: '2026-08-20', recovery: 72, risk: 'medium', phone: '+91 98765 43210', email: 'patient@caretrack.com', patientId: 'PT-2026-0042', hospital: 'City Care Hospital', emergencyContact: '+91 98765 11111 (Anita Kumar, Wife)', lastUpdate: 'Today, 9:15 AM', medicationAdherence: 92, nextAppointment: '2026-08-30' },
  { _ref: 'p2', name: 'Priya Devi', age: 45, gender: 'Female', surgery: 'Knee Replacement', surgeryDate: '2026-08-10', dischargeDate: '2026-08-15', recovery: 85, risk: 'low', phone: '+91 98220 11234', email: 'priya.devi@example.com', patientId: 'PT-2026-0038', hospital: 'City Care Hospital', emergencyContact: '+91 98220 55667 (Raj Devi, Son)', lastUpdate: 'Today, 8:40 AM', medicationAdherence: 96, nextAppointment: '2026-09-02' },
  { _ref: 'p3', name: 'Rahul Kumar', age: 58, gender: 'Male', surgery: 'Hernia Surgery', surgeryDate: '2026-08-16', dischargeDate: '2026-08-18', recovery: 48, risk: 'high', phone: '+91 99100 33445', email: 'rahul.kumar@example.com', patientId: 'PT-2026-0051', hospital: 'City Care Hospital', emergencyContact: '+91 99100 88990 (Meena Kumar, Daughter)', lastUpdate: '2 hours ago', medicationAdherence: 71, nextAppointment: '2026-08-28' },
  { _ref: 'p4', name: 'Anjali Patel', age: 39, gender: 'Female', surgery: 'Gallbladder Surgery', surgeryDate: '2026-08-12', dischargeDate: '2026-08-14', recovery: 68, risk: 'medium', phone: '+91 98712 34567', email: 'anjali.patel@example.com', patientId: 'PT-2026-0029', hospital: 'City Care Hospital', emergencyContact: '+91 98712 77889 (Vikram Patel, Husband)', lastUpdate: '5 hours ago', medicationAdherence: 88, nextAppointment: '2026-09-01' },
  { _ref: 'p5', name: 'Arjun Singh', age: 52, gender: 'Male', surgery: 'Cardiac Procedure', surgeryDate: '2026-08-14', dischargeDate: '2026-08-17', recovery: 55, risk: 'high', phone: '+91 99888 12345', email: 'arjun.singh@example.com', patientId: 'PT-2026-0044', hospital: 'City Care Hospital', emergencyContact: '+91 99888 67890 (Sunita Singh, Wife)', lastUpdate: '1 hour ago', medicationAdherence: 74, nextAppointment: '2026-08-29' },
  { _ref: 'p6', name: 'Sneha Reddy', age: 28, gender: 'Female', surgery: 'Laparoscopic Cholecystectomy', surgeryDate: '2026-08-19', dischargeDate: '2026-08-21', recovery: 78, risk: 'low', phone: '+91 90000 11111', email: 'sneha.reddy@example.com', patientId: 'PT-2026-0055', hospital: 'City Care Hospital', emergencyContact: '+91 90000 22222 (Kiran Reddy, Brother)', lastUpdate: 'Today, 7:30 AM', medicationAdherence: 94, nextAppointment: '2026-09-03' },
  { _ref: 'p7', name: 'Mohammed Irfan', age: 47, gender: 'Male', surgery: 'Coronary Bypass', surgeryDate: '2026-08-08', dischargeDate: '2026-08-12', recovery: 62, risk: 'medium', phone: '+91 94455 66778', email: 'mohammed.irfan@example.com', patientId: 'PT-2026-0021', hospital: 'City Care Hospital', emergencyContact: '+91 94455 99001 (Fathima Irfan, Wife)', lastUpdate: 'Yesterday', medicationAdherence: 83, nextAppointment: '2026-08-31' },
  { _ref: 'p8', name: 'Lakshmi Nair', age: 61, gender: 'Female', surgery: 'Hip Replacement', surgeryDate: '2026-08-06', dischargeDate: '2026-08-10', recovery: 80, risk: 'low', phone: '+91 93333 44556', email: 'lakshmi.nair@example.com', patientId: 'PT-2026-0018', hospital: 'City Care Hospital', emergencyContact: '+91 93333 77889 (Arun Nair, Son)', lastUpdate: 'Today, 6:50 AM', medicationAdherence: 91, nextAppointment: '2026-09-05' },
  { _ref: 'p9', name: 'Vikas Gupta', age: 35, gender: 'Male', surgery: 'Appendectomy', surgeryDate: '2026-08-20', dischargeDate: '2026-08-22', recovery: 65, risk: 'medium', phone: '+91 97777 11223', email: 'vikas.gupta@example.com', patientId: 'PT-2026-0058', hospital: 'City Care Hospital', emergencyContact: '+91 97777 55667 (Pooja Gupta, Wife)', lastUpdate: '3 hours ago', medicationAdherence: 86, nextAppointment: '2026-09-04' },
  { _ref: 'p10', name: 'Deepa Iyer', age: 44, gender: 'Female', surgery: 'Thyroidectomy', surgeryDate: '2026-08-11', dischargeDate: '2026-08-13', recovery: 90, risk: 'low', phone: '+91 95555 22334', email: 'deepa.iyer@example.com', patientId: 'PT-2026-0031', hospital: 'City Care Hospital', emergencyContact: '+91 95555 66778 (Suresh Iyer, Husband)', lastUpdate: 'Today, 8:00 AM', medicationAdherence: 98, nextAppointment: '2026-09-06' },
  { _ref: 'p11', name: 'Karan Mehta', age: 50, gender: 'Male', surgery: 'Spinal Fusion', surgeryDate: '2026-08-09', dischargeDate: '2026-08-13', recovery: 42, risk: 'high', phone: '+91 98888 33445', email: 'karan.mehta@example.com', patientId: 'PT-2026-0023', hospital: 'City Care Hospital', emergencyContact: '+91 98888 77990 (Nisha Mehta, Daughter)', lastUpdate: '30 minutes ago', medicationAdherence: 68, nextAppointment: '2026-08-28' },
  { _ref: 'p12', name: 'Ritu Sharma', age: 33, gender: 'Female', surgery: 'C-Section', surgeryDate: '2026-08-17', dischargeDate: '2026-08-19', recovery: 76, risk: 'low', phone: '+91 96655 11223', email: 'ritu.sharma@example.com', patientId: 'PT-2026-0048', hospital: 'City Care Hospital', emergencyContact: '+91 96655 55667 (Aditya Sharma, Husband)', lastUpdate: 'Today, 7:00 AM', medicationAdherence: 93, nextAppointment: '2026-09-02' },
  { _ref: 'p13', name: 'Suresh Pillai', age: 67, gender: 'Male', surgery: 'Prostate Surgery', surgeryDate: '2026-08-07', dischargeDate: '2026-08-11', recovery: 70, risk: 'medium', phone: '+91 94433 55667', email: 'suresh.pillai@example.com', patientId: 'PT-2026-0019', hospital: 'City Care Hospital', emergencyContact: '+91 94433 99001 (Leela Pillai, Wife)', lastUpdate: 'Yesterday', medicationAdherence: 85, nextAppointment: '2026-09-03' },
  { _ref: 'p14', name: 'Nisha Agarwal', age: 29, gender: 'Female', surgery: 'Mastectomy', surgeryDate: '2026-08-15', dischargeDate: '2026-08-18', recovery: 58, risk: 'medium', phone: '+91 97700 11223', email: 'nisha.agarwal@example.com', patientId: 'PT-2026-0046', hospital: 'City Care Hospital', emergencyContact: '+91 97700 55667 (Rohit Agarwal, Brother)', lastUpdate: '4 hours ago', medicationAdherence: 82, nextAppointment: '2026-08-30' },
  { _ref: 'p15', name: 'Aditya Verma', age: 41, gender: 'Male', surgery: 'Knee Arthroscopy', surgeryDate: '2026-08-21', dischargeDate: '2026-08-23', recovery: 60, risk: 'low', phone: '+91 98811 22334', email: 'aditya.verma@example.com', patientId: 'PT-2026-0060', hospital: 'City Care Hospital', emergencyContact: '+91 98811 66778 (Shreya Verma, Wife)', lastUpdate: 'Today, 9:00 AM', medicationAdherence: 90, nextAppointment: '2026-09-07' },
];

// ── Medications ───────────────────────────────────────────────────────────────
const medications = [
  { patientRef: 'p1', name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times daily', time: '9:00 AM', status: 'taken', notes: 'Take with food' },
  { patientRef: 'p1', name: 'Paracetamol', dosage: '650 mg', frequency: 'Every 6 hours as needed', time: '2:00 PM', status: 'upcoming', notes: 'For pain and fever' },
  { patientRef: 'p1', name: 'Omeprazole', dosage: '20 mg', frequency: 'Once daily', time: '9:00 PM', status: 'pending', notes: 'Before breakfast' },
  { patientRef: 'p1', name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times daily', time: '9:00 PM', status: 'pending', notes: 'Take with food' },
  { patientRef: 'p3', name: 'Tramadol', dosage: '50 mg', frequency: 'Every 6 hours', time: '8:00 AM', status: 'taken', notes: 'For severe pain' },
  { patientRef: 'p3', name: 'Cefuroxime', dosage: '500 mg', frequency: 'Twice daily', time: '8:00 AM', status: 'taken', notes: 'Antibiotic' },
  { patientRef: 'p3', name: 'Ibuprofen', dosage: '400 mg', frequency: 'Every 8 hours', time: '1:00 PM', status: 'pending', notes: 'Take with food' },
  { patientRef: 'p3', name: 'Tramadol', dosage: '50 mg', frequency: 'Every 6 hours', time: '8:00 PM', status: 'upcoming', notes: 'For severe pain' },
  { patientRef: 'p2', name: 'Celecoxib', dosage: '200 mg', frequency: 'Twice daily', time: '8:00 AM', status: 'taken', notes: 'Anti-inflammatory' },
  { patientRef: 'p2', name: 'Aspirin', dosage: '75 mg', frequency: 'Once daily', time: '8:00 PM', status: 'taken', notes: 'Blood thinner' },
  { patientRef: 'p5', name: 'Atorvastatin', dosage: '40 mg', frequency: 'Once at night', time: '10:00 PM', status: 'pending', notes: 'Cholesterol management' },
  { patientRef: 'p5', name: 'Metoprolol', dosage: '50 mg', frequency: 'Twice daily', time: '8:00 AM', status: 'taken', notes: 'Blood pressure' },
  { patientRef: 'p5', name: 'Clopidogrel', dosage: '75 mg', frequency: 'Once daily', time: '8:00 AM', status: 'skipped', notes: 'Antiplatelet' },
];

// ── Risk Alerts ───────────────────────────────────────────────────────────────
const riskAlerts = [
  { patientRef: 'p5', patientName: 'Arjun Singh', level: 'critical', symptoms: ['Difficulty Breathing', 'Dizziness'], reportedAt: '1 hour ago', status: 'active', summary: 'Patient reports severe difficulty breathing when lying flat and moderate dizziness on standing. Cardiac procedure recovery — requires immediate evaluation.' },
  { patientRef: 'p3', patientName: 'Rahul Kumar', level: 'high', symptoms: ['Severe Pain', 'Fever', 'Wound Redness'], reportedAt: '2 hours ago', status: 'active', summary: 'Severe pain at hernia repair site, fever 100.4°F, and increasing wound redness. Possible surgical site infection.' },
  { patientRef: 'p11', patientName: 'Karan Mehta', level: 'high', symptoms: ['Severe Pain', 'Numbness in Left Leg'], reportedAt: '30 minutes ago', status: 'active', summary: 'Persistent severe back pain not responding to medication, with new numbness in left leg. Spinal fusion recovery — possible nerve compression.' },
  { patientRef: 'p1', patientName: 'John Kumar', level: 'medium', symptoms: ['Increased Pain'], reportedAt: '3 days ago', status: 'reviewed', summary: 'Mild increase in abdominal pain 4 days post-discharge. Manageable with prescribed Paracetamol. Monitoring.' },
  { patientRef: 'p4', patientName: 'Anjali Patel', level: 'medium', symptoms: ['Nausea'], reportedAt: '2 days ago', status: 'reviewed', summary: 'Mild nausea after meals. Improving with Omeprazole. No further escalation reported.' },
  { patientRef: 'p7', patientName: 'Mohammed Irfan', level: 'medium', symptoms: ['Fatigue', 'Mild Chest Discomfort'], reportedAt: '4 days ago', status: 'resolved', summary: 'Reported fatigue and mild chest discomfort post coronary bypass. Evaluated in clinic — stable. Symptoms resolved with medication adjustment.' },
  { patientRef: 'p13', patientName: 'Suresh Pillai', level: 'low', symptoms: ['Mild Pain'], reportedAt: '5 days ago', status: 'resolved', summary: 'Mild post-operative pain, well controlled. No complications. Resolved.' },
];

async function seed() {
  await connectDB();
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Medication.deleteMany({}),
    DischargePlan.deleteMany({}),
    RecoveryEntry.deleteMany({}),
    SymptomReport.deleteMany({}),
    Appointment.deleteMany({}),
    Notification.deleteMany({}),
    RiskAlert.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  await User.insertMany(users);
  console.log(`✅ Seeded ${users.length} users`);

  await Patient.insertMany(patients);
  console.log(`✅ Seeded ${patients.length} patients`);

  await Medication.insertMany(medications);
  console.log(`✅ Seeded ${medications.length} medications`);

  await RiskAlert.insertMany(riskAlerts);
  console.log(`✅ Seeded ${riskAlerts.length} risk alerts`);

  console.log('🎉 Database seeding complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
