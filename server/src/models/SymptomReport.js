import mongoose from 'mongoose';

const symptomReportSchema = new mongoose.Schema({
  patientRef: String,
  patientName: String,
  symptoms: [{
    name: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    started: String,
    description: String,
  }],
  date: String,
  risk: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
}, { timestamps: true });

export default mongoose.model('SymptomReport', symptomReportSchema);
