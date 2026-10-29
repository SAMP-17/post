// CareTrack API Service
// Falls back to mock data when the server is unavailable

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let _token: string | null = null;

export function setToken(token: string | null) { _token = token; }
export function getToken() { return _token; }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ── Health ────────────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/health`);
    return true;
  } catch {
    return false;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: Record<string, unknown> }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  signup: (data: Record<string, unknown>) =>
    request<{ token: string; user: Record<string, unknown> }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientsApi = {
  getAll: () => request<unknown[]>('/patients'),
  getById: (id: string) => request<unknown>(`/patients/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Medications ───────────────────────────────────────────────────────────────
export const medicationsApi = {
  getAll: (patientRef?: string) =>
    request<unknown[]>(`/medications${patientRef ? `?patientRef=${patientRef}` : ''}`),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/medications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/medications', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Discharge Plans ───────────────────────────────────────────────────────────
export const dischargePlansApi = {
  getAll: () => request<unknown[]>('/discharge-plans'),
  getByPatient: (patientRef: string) => request<unknown>(`/discharge-plans/${patientRef}`),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/discharge-plans', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/discharge-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Recovery Entries ──────────────────────────────────────────────────────────
export const recoveryApi = {
  getAll: (patientRef?: string) =>
    request<unknown[]>(`/recovery-entries${patientRef ? `?patientRef=${patientRef}` : ''}`),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/recovery-entries', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Symptom Reports ───────────────────────────────────────────────────────────
export const symptomReportsApi = {
  getAll: (patientRef?: string) =>
    request<unknown[]>(`/symptom-reports${patientRef ? `?patientRef=${patientRef}` : ''}`),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/symptom-reports', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsApi = {
  getAll: (patientRef?: string) =>
    request<unknown[]>(`/appointments${patientRef ? `?patientRef=${patientRef}` : ''}`),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
  getAll: (role?: string) =>
    request<unknown[]>(`/notifications${role ? `?role=${role}` : ''}`),
  markRead: (id: string) =>
    request<unknown>(`/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ read: true }) }),
};

// ── Risk Alerts ───────────────────────────────────────────────────────────────
export const riskAlertsApi = {
  getAll: (status?: string) =>
    request<unknown[]>(`/risk-alerts${status ? `?status=${status}` : ''}`),
  create: (data: Record<string, unknown>) =>
    request<unknown>('/risk-alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/risk-alerts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
