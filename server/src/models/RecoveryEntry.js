import mongoose from 'mongoose';

const recoveryEntrySchema = new mongoose.Schema({
  patientRef: String,
  date: String,
  painLevel: Number,
  energyLevel: String,
  overallRecovery: Number,
  woundCondition: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('RecoveryEntry', recoveryEntrySchema);
