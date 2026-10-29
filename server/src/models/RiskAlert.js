import mongoose from 'mongoose';

const riskAlertSchema = new mongoose.Schema({
  patientRef: String,
  patientName: String,
  level: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  symptoms: [String],
  reportedAt: String,
  status: { type: String, enum: ['active', 'reviewed', 'resolved'], default: 'active' },
  summary: String,
}, { timestamps: true });

export default mongoose.model('RiskAlert', riskAlertSchema);
