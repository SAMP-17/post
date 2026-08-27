import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { Role } from '@/types';

import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/public/LoginPage';
import SignupPage from '@/pages/public/SignupPage';
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage';

import PatientDashboard from '@/pages/patient/PatientDashboard';
import DischargePlanPage from '@/pages/patient/DischargePlanPage';
import MedicationsPage from '@/pages/patient/MedicationsPage';
import RecoveryPage from '@/pages/patient/RecoveryPage';
import SymptomsPage from '@/pages/patient/SymptomsPage';
import PatientAppointmentsPage from '@/pages/patient/AppointmentsPage';
import PatientNotificationsPage from '@/pages/patient/NotificationsPage';
import ProfilePage from '@/pages/shared/ProfilePage';

import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import PatientsPage from '@/pages/doctor/PatientsPage';
import PatientDetailPage from '@/pages/doctor/PatientDetailPage';
import DischargePlansPage from '@/pages/doctor/DischargePlansPage';
import MedicationManagementPage from '@/pages/doctor/MedicationManagementPage';
import RecoveryMonitoringPage from '@/pages/doctor/RecoveryMonitoringPage';
import FollowUpsPage from '@/pages/doctor/FollowUpsPage';
import RiskAlertsPage from '@/pages/doctor/RiskAlertsPage';
import DoctorNotificationsPage from '@/pages/doctor/NotificationsPage';

function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/discharge-plan" element={<ProtectedRoute role="patient"><DischargePlanPage /></ProtectedRoute>} />
      <Route path="/patient/medications" element={<ProtectedRoute role="patient"><MedicationsPage /></ProtectedRoute>} />
      <Route path="/patient/recovery" element={<ProtectedRoute role="patient"><RecoveryPage /></ProtectedRoute>} />
      <Route path="/patient/symptoms" element={<ProtectedRoute role="patient"><SymptomsPage /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute role="patient"><PatientAppointmentsPage /></ProtectedRoute>} />
      <Route path="/patient/notifications" element={<ProtectedRoute role="patient"><PatientNotificationsPage /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute role="patient"><ProfilePage /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute role="doctor"><PatientsPage /></ProtectedRoute>} />
      <Route path="/doctor/patients/:id" element={<ProtectedRoute role="doctor"><PatientDetailPage /></ProtectedRoute>} />
      <Route path="/doctor/discharge-plans" element={<ProtectedRoute role="doctor"><DischargePlansPage /></ProtectedRoute>} />
      <Route path="/doctor/medications" element={<ProtectedRoute role="doctor"><MedicationManagementPage /></ProtectedRoute>} />
      <Route path="/doctor/recovery-monitoring" element={<ProtectedRoute role="doctor"><RecoveryMonitoringPage /></ProtectedRoute>} />
      <Route path="/doctor/follow-ups" element={<ProtectedRoute role="doctor"><FollowUpsPage /></ProtectedRoute>} />
      <Route path="/doctor/risk-alerts" element={<ProtectedRoute role="doctor"><RiskAlertsPage /></ProtectedRoute>} />
      <Route path="/doctor/notifications" element={<ProtectedRoute role="doctor"><DoctorNotificationsPage /></ProtectedRoute>} />
      <Route path="/doctor/profile" element={<ProtectedRoute role="doctor"><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
