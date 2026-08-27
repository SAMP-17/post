import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '@/types';
import { demoUsers, demoPasswords } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  loginAs: (role: Role) => void;
  signup: (data: Partial<User> & { role: Role; password?: string }) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem('caretrack-user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const persist = (u: User | null) => {
    setUser(u);
    if (u) sessionStorage.setItem('caretrack-user', JSON.stringify(u));
    else sessionStorage.removeItem('caretrack-user');
  };

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const demoUser = demoUsers[normalized];
    if (demoUser && demoPasswords[normalized] === password) {
      persist(demoUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Try the demo credentials shown below.' };
  }, []);

  const loginAs = useCallback((role: Role) => {
    const email = role === 'patient' ? 'patient@caretrack.com' : 'doctor@caretrack.com';
    persist(demoUsers[email]);
  }, []);

  const signup = useCallback((data: Partial<User> & { role: Role }) => {
    const newUser: User = {
      id: `new-${Date.now()}`,
      role: data.role,
      name: data.name || 'New User',
      email: data.email || '',
      phone: data.phone || '',
      ...(data.role === 'patient'
        ? {
            age: data.age,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            patientId: data.patientId,
            emergencyContact: data.emergencyContact,
            hospital: data.hospital,
          }
        : {
            professionalId: data.professionalId,
            department: data.department,
            specialization: data.specialization,
            clinic: data.clinic,
          }),
    };
    persist(newUser);
  }, []);

  const logout = useCallback(() => persist(null), []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      sessionStorage.setItem('caretrack-user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
