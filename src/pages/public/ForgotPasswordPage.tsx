import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" />
          <Link to="/login" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back to login</Link>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Check your email</h2>
              <p className="mt-2 text-slate-600">
                We've sent a password reset link to <span className="font-semibold text-slate-800">{email}</span>. The link will expire in 30 minutes.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/login" className="btn-primary w-full">Back to Login</Link>
                <button onClick={() => { setSent(false); setEmail(''); }} className="btn-secondary w-full">
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
              <p className="mt-2 text-sm text-slate-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className="input pl-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
                </div>
                <button type="submit" className="btn-primary w-full">Send Reset Link</button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Login</Link>
        </p>
      </div>
    </div>
  );
}
