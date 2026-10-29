import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: String,
  // Patient fields
  age: Number,
  gender: String,
  dateOfBirth: String,
  patientId: String,
  emergencyContact: String,
  hospital: String,
  // Doctor fields
  professionalId: String,
  department: String,
  specialization: String,
  clinic: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
