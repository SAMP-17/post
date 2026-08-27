import { Link } from 'react-router-dom';
import {
  FileText,
  Pill,
  Activity,
  CalendarClock,
  AlertTriangle,
  LayoutDashboard,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const features = [
  { icon: FileText, title: 'Personalized Discharge Plans', desc: 'Provide patients with customized recovery instructions tailored to their surgery and condition.' },
  { icon: Pill, title: 'Medication Monitoring', desc: 'Track medication schedules and adherence in real time to ensure patients stay on course.' },
  { icon: Activity, title: 'Recovery Tracking', desc: 'Monitor recovery progress and patient-reported symptoms throughout the healing journey.' },
  { icon: CalendarClock, title: 'Follow-Up Management', desc: 'Automate appointment scheduling and reminders so no follow-up is ever missed.' },
  { icon: AlertTriangle, title: 'Early Risk Alerts', desc: 'Identify potential complications early with intelligent symptom analysis and risk scoring.' },
  { icon: LayoutDashboard, title: 'Healthcare Dashboard', desc: 'Centralized patient monitoring for healthcare professionals across their entire panel.' },
];

const stats = [
  { value: '500+', label: 'Patients Monitored' },
  { value: '95%', label: 'Medication Adherence' },
  { value: '1,200+', label: 'Follow-Ups Managed' },
  { value: '24/7', label: 'Recovery Monitoring' },
];

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</a>
            <a href="#stats" className="text-sm font-medium text-slate-600 hover:text-slate-900">Statistics</a>
            <a href="#how" className="text-sm font-medium text-slate-600 hover:text-slate-900">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-teal-50/30 to-white" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
              <HeartPulse className="h-4 w-4" />
              Post-Operative Care & Recovery Management
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Better Recovery Starts with <span className="bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">Better Follow-Up</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              A centralized platform that helps patients and healthcare professionals manage post-operative recovery, discharge planning, medication schedules, follow-up appointments, and early risk detection.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="btn-primary px-7 py-3 text-base">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary px-7 py-3 text-base">Login</Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success-500" /> No setup required</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary-500" /> HIPAA-aware design</span>
            </div>
          </div>

          {/* Hero illustration card */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">For Patients</h3>
                <p className="mt-1 text-sm text-slate-500">Track your recovery, medications, and appointments in one place.</p>
              </div>
              <div className="card p-5 text-center ring-2 ring-primary-500/20">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <HeartPulse className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">Continuous Care</h3>
                <p className="mt-1 text-sm text-slate-500">Bridge the gap between hospital discharge and full recovery at home.</p>
              </div>
              <div className="card p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                  <LayoutDashboard className="h-6 w-6 text-accent-600" />
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">For Professionals</h3>
                <p className="mt-1 text-sm text-slate-500">Monitor your entire patient panel with real-time risk alerts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need for post-operative care</h2>
          <p className="mt-4 text-lg text-slate-600">Comprehensive tools that bring patients and healthcare professionals together for better recovery outcomes.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="card group p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 ring-1 ring-primary-100 transition group-hover:scale-110">
                <f.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-gradient-to-br from-primary-600 to-teal-600 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-extrabold text-white lg:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-primary-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How CareTrack works</h2>
          <p className="mt-4 text-lg text-slate-600">Three simple steps to better post-operative outcomes.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { step: '01', icon: FileText, title: 'Create a Discharge Plan', desc: 'Healthcare professionals build a personalized recovery plan at the point of discharge.' },
            { step: '02', icon: Activity, title: 'Patients Track Recovery', desc: 'Patients log symptoms, medications, and daily recovery updates from home.' },
            { step: '03', icon: AlertTriangle, title: 'Early Risk Detection', desc: 'Care teams receive instant alerts when patients report concerning symptoms.' },
          ].map((s, i) => (
            <div key={i} className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="absolute right-0 top-0 text-5xl font-black text-slate-100">{s.step}</span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-primary-950 px-8 py-14 text-center">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to improve recovery outcomes?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">Join CareTrack today and experience a smarter way to manage post-operative care.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="btn bg-white px-7 py-3 text-base text-slate-900 hover:bg-slate-100">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn border border-white/30 px-7 py-3 text-base text-white hover:bg-white/10">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <Logo />
              <p className="mt-3 max-w-sm text-sm text-slate-500">Post-Operative Care & Recovery Management Platform. Better recovery starts with better follow-up.</p>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              {footerLinks.map((l) => (
                <a key={l.label} href={l.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">{l.label}</a>
              ))}
            </nav>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-400">© 2026 CareTrack. Built for better post-operative care. This is a demonstration platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
