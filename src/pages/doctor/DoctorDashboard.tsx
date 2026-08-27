import {
  Users, AlertTriangle, CalendarClock, Pill, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/ui/StatCard';
import { DonutChart, LineChart } from '@/components/ui/Charts';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { greeting, riskConfig, classNames, formatDate } from '@/lib/utils';
import { patients, appointments, riskAlerts } from '@/data/mockData';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.replace(/^Dr\.\s*/, '').split(' ')[0] || 'Priya';

  const highRisk = patients.filter((p) => p.risk === 'high' || p.risk === 'critical').length;
  const todaysAppts = appointments.filter((a) => a.date === '2026-08-27').length;
  const activeAlerts = riskAlerts.filter((a) => a.status === 'active').length;

  const recentPatients = [...patients].sort((a, b) => {
    const order = { '30 minutes ago': 0, '1 hour ago': 1, '2 hours ago': 2, '3 hours ago': 3, '5 hours ago': 4 };
    return 0;
  }).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting()}, Dr. {firstName} 👋</h1>
        <p className="mt-1 text-slate-500">Monitor your patients' post-operative recovery and follow-up status.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Patients" value={patients.length} icon={Users} color="primary" trend="3 new this week" trendUp />
        <StatCard label="High-Risk Patients" value={highRisk} icon={AlertTriangle} color="error" trend="Requires attention" />
        <StatCard label="Follow-Ups Today" value={todaysAppts} icon={CalendarClock} color="teal" trend="2 pending confirmation" />
        <StatCard label="Medication Adherence" value="89%" icon={Pill} color="accent" trend="+2% vs last week" trendUp />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recovery trends chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Patient Recovery Overview</h2>
              <p className="text-sm text-slate-500">Average recovery trends across all patients</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-1.5 text-sm font-semibold text-success-700">
              <TrendingUp className="h-4 w-4" /> +12% avg
            </div>
          </div>
          <LineChart
            data={[
              { label: 'Wk 1', value: 42 },
              { label: 'Wk 2', value: 55 },
              { label: 'Wk 3', value: 63 },
              { label: 'Wk 4', value: 68 },
            ]}
            unit="%"
            height="h-48"
          />
        </div>

        {/* Risk alert summary */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Risk Alert Summary</h2>
          <DonutChart
            segments={[
              { label: 'High Risk', value: highRisk, color: 'bg-error-500' },
              { label: 'Medium Risk', value: 8, color: 'bg-warning-500' },
              { label: 'Normal', value: patients.length - highRisk - 8, color: 'bg-success-500' },
            ]}
            centerLabel="Total"
            centerValue={patients.length}
          />
          <Link to="/doctor/risk-alerts" className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all alerts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent patient updates table */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Patient Updates</h2>
          <Link to="/doctor/patients" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all patients <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4">Patient</th>
                <th className="pb-3 pr-4">Surgery</th>
                <th className="pb-3 pr-4">Recovery</th>
                <th className="pb-3 pr-4">Risk Level</th>
                <th className="pb-3">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <Link to={`/doctor/patients/${p.id}`} className="flex items-center gap-3">
                      <Avatar name={p.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800 hover:text-primary-600">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.age} yrs · {p.gender}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{p.surgery}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div className={classNames('h-full rounded-full', riskConfig[p.risk].bar)} style={{ width: `${p.recovery}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{p.recovery}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={classNames('badge', riskConfig[p.risk].badge)}>
                      <span className={classNames('h-1.5 w-1.5 rounded-full', riskConfig[p.risk].dot)} />
                      {riskConfig[p.risk].label}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{p.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active alerts */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Active Risk Alerts</h2>
          <Link to="/doctor/risk-alerts" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {riskAlerts.filter((a) => a.status === 'active').slice(0, 3).map((alert) => (
            <Link key={alert.id} to={`/doctor/patients/${alert.patientId}`} className="block">
              <div className={classNames(
                'flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-soft',
                alert.level === 'critical' ? 'border-error-200 bg-error-50/50' : 'border-orange-200 bg-orange-50/30',
              )}>
                <div className={classNames('flex h-10 w-10 items-center justify-center rounded-xl', riskConfig[alert.level].badge)}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{alert.patientName}</p>
                    <span className={classNames('badge', riskConfig[alert.level].badge)}>{riskConfig[alert.level].label}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{alert.summary}</p>
                  <div className="mt-1 flex gap-2">
                    {alert.symptoms.map((s, i) => (
                      <span key={i} className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{s}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{alert.reportedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
