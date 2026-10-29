import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientRef: String,
  patientName: String,
  doctorName: String,
  type: String,
  date: String,
  time: String,
  status: { type: String, enum: ['confirmed', 'scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
