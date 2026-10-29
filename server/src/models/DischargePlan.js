import mongoose from 'mongoose';

const dischargePlanSchema = new mongoose.Schema({
  patientRef: { type: String, required: true },
  patientName: String,
  surgery: String,
  surgeryDate: String,
  dischargeDate: String,
  woundCare: [String],
  medicationInstructions: [{
    name: String,
    dosage: String,
    frequency: String,
    instructions: String,
  }],
  dietGuidelines: [String],
  activityGuidelines: [String],
  warningSigns: [String],
  followUpRecommendations: String,
}, { timestamps: true });

export default mongoose.model('DischargePlan', dischargePlanSchema);
