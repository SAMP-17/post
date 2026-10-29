import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  _ref: String, // maps to old id like 'p1'
  name: { type: String, required: true },
  age: Number,
  gender: String,
  surgery: String,
  surgeryDate: String,
  dischargeDate: String,
  recovery: Number,
  risk: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  phone: String,
  email: String,
  patientId: String,
  hospital: String,
  emergencyContact: String,
  lastUpdate: String,
  medicationAdherence: Number,
  nextAppointment: String,
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
