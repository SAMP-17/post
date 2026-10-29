import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import medicationRoutes from './routes/medications.js';
import dischargePlanRoutes from './routes/dischargePlans.js';
import recoveryEntryRoutes from './routes/recoveryEntries.js';
import symptomReportRoutes from './routes/symptomReports.js';
import appointmentRoutes from './routes/appointments.js';
import notificationRoutes from './routes/notifications.js';
import riskAlertRoutes from './routes/riskAlerts.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/staging; replace with callback(new Error('Not allowed by CORS')) if strict
    },
    credentials: true,
  })
);
app.use(express.json());

// Root & Health check
app.get('/', (_, res) => res.json({ message: '🏥 CareTrack API is live and running', health: '/api/health' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/discharge-plans', dischargePlanRoutes);
app.use('/api/recovery-entries', recoveryEntryRoutes);
app.use('/api/symptom-reports', symptomReportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/risk-alerts', riskAlertRoutes);

// 404 handler
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 CareTrack server running on http://localhost:${PORT}`));
});
