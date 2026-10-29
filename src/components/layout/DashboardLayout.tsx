import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Pill,
  Activity,
  Stethoscope,
  CalendarClock,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Users,
  AlertTriangle,
  Search,
  Settings,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { classNames } from '@/lib/utils';
import { patients, medications } from '@/data/mockData';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const patientNav: NavItem[] = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/discharge-plan', label: 'My Discharge Plan', icon: FileText },
  { to: '/patient/medications', label: 'Medications', icon: Pill },
  { to: '/patient/recovery', label: 'Recovery Tracking', icon: Activity },
  { to: '/patient/symptoms', label: 'Symptom Reporting', icon: Stethoscope },
  { to: '/patient/appointments', label: 'Follow-Up Appointments', icon: CalendarClock },
  { to: '/patient/notifications', label: 'Notifications', icon: Bell },
  { to: '/patient/profile', label: 'Profile', icon: UserIcon },
];

const doctorNav: NavItem[] = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/discharge-plans', label: 'Discharge Plans', icon: FileText },
  { to: '/doctor/medications', label: 'Medication Monitoring', icon: Pill },
  { to: '/doctor/recovery-monitoring', label: 'Recovery Monitoring', icon: Activity },
  { to: '/doctor/follow-ups', label: 'Follow-Up Management', icon: CalendarClock },

  { to: '/doctor/notifications', label: 'Notifications', icon: Bell },
  { to: '/doctor/profile', label: 'Profile', icon: UserIcon },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ label: string; href: string; sub: string; category: string }>>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const results: Array<{ label: string; href: string; sub: string; category: string }> = [];

    patients.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q) || p.surgery.toLowerCase().includes(q)) {
        results.push({
          label: p.name,
          href: user?.role === 'doctor' ? `/doctor/patients/${p.id}` : `/patient/dashboard`,
          sub: `${p.surgery} · ${p.patientId}`,
          category: 'Patient',
        });
      }
    });

    const seenMeds = new Set<string>();
    medications.forEach((m) => {
      if (m.name.toLowerCase().includes(q) && !seenMeds.has(m.name.toLowerCase())) {
        seenMeds.add(m.name.toLowerCase());
        results.push({
          label: m.name,
          href: user?.role === 'doctor' ? `/doctor/medications` : `/patient/medications`,
          sub: `${m.dosage} · ${m.frequency}`,
          category: 'Medication',
        });
      }
    });

    setSearchResults(results.slice(0, 6));
  }, [searchQuery, user?.role]);

  const nav = user?.role === 'doctor' ? doctorNav : patientNav;
  const notifPath = user?.role === 'doctor' ? '/doctor/notifications' : '/patient/notifications';
  const settingsPath = user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile';

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarContent = (
    <>
      <div className={classNames('flex items-center px-3 py-5', collapsed ? 'justify-center' : 'justify-between')}>
        {collapsed ? <Logo showText={false} size="sm" /> : <Logo size="sm" />}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:block">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeMobile}
            className={({ isActive }) =>
              classNames('sidebar-link', isActive && 'sidebar-link-active', collapsed && 'justify-center')
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          onClick={handleLogout}
          className={classNames('sidebar-link w-full text-error-600 hover:bg-error-50 hover:text-error-700', collapsed && 'justify-center')}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={classNames(
          'hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:flex',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-elevated animate-slide-in">
            <div className="flex items-center justify-between px-3 py-5">
              <Logo size="sm" />
              <button onClick={closeMobile} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) => classNames('sidebar-link', isActive && 'sidebar-link-active')}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-slate-100 p-3">
              <button onClick={handleLogout} className="sidebar-link w-full text-error-600 hover:bg-error-50">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            {collapsed && (
              <button onClick={() => setCollapsed(false)} className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:block">
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </button>
            )}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 sm:flex">
              <HeartPulse className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-600">
              {user?.role === 'doctor' ? 'Professional View' : 'Patient View'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients, meds..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevated">
                  {searchResults.map((r, i) => (
                    <NavLink
                      key={i}
                      to={r.href}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.label}</p>
                        <p className="text-xs text-slate-500">{r.sub}</p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {r.category}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to={notifPath}
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute h-full w-full animate-pulse-ring rounded-full bg-error-400" />
                <span className="relative h-2 w-2 rounded-full bg-error-500" />
              </span>
            </NavLink>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100"
              >
                <Avatar name={user?.name || 'User'} size="sm" />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role === 'doctor' ? 'Healthcare Pro' : 'Patient'}</p>
                </div>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevated">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <NavLink
                      to={settingsPath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <UserIcon className="h-4 w-4" /> Profile
                    </NavLink>
                    <NavLink
                      to={settingsPath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main key={location.pathname} className="flex-1 overflow-y-auto animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
