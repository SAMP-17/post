import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  patientRef: String, // maps to old patientId like 'p1'
  name: { type: String, required: true },
  dosage: String,
  frequency: String,
  time: String,
  status: { type: String, enum: ['taken', 'pending', 'upcoming', 'skipped'], default: 'pending' },
  notes: String,
}, { timestamps: true });

export default mongoose.model('Medication', medicationSchema);
