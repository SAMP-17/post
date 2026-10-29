import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['medication', 'appointment', 'recovery', 'alert', 'system'] },
  title: String,
  message: String,
  time: String,
  read: { type: Boolean, default: false },
  role: { type: String, enum: ['patient', 'doctor'] },
  patientRef: String,
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
