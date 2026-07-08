import { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { Plane, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { homeFor } from '../components/ProtectedRoute';

const BENEFITS = [
  'Book flights to 180+ destinations',
  'Real-time flight status updates',
  'Digital boarding passes',
  'Exclusive member fares',
  'Priority customer support',
];

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'register'>(
    (params.get('mode') as 'signin' | 'register') ?? 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, selectedFlight } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const authedUser =
        mode === 'signin'
          ? await login(email, password)
          : await register({ name, email, phone, password });

      // Where to go: mid-booking flow > the page they were sent from > role home.
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      if (selectedFlight) navigate('/seat-selection');
      else if (from && from !== '/auth') navigate(from);
      else navigate(homeFor(authedUser.role));
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent';

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0A1F44] relative overflow-hidden p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute border border-white rounded-full"
              style={{ width: `${(i + 1) * 150}px`, height: `${(i + 1) * 150}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="absolute top-1/4 right-0 opacity-10">
          <Plane className="w-96 h-96 text-white rotate-12" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-[#2E8FD8] rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AVI<span className="text-[#2E8FD8]">ON</span></span>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your journey<br />begins here
          </h1>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            Join millions of travelers who trust Avion for seamless, world-class flights.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-3 text-white/80 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#2E8FD8] shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/30 text-xs">© 2026 Avion Airways</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0A1F44] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F4F7FB] rounded-xl p-1 mb-8">
            {(['signin', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
                  mode === m
                    ? 'bg-white text-[#0A1F44] shadow-sm font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h2 className="text-[#0A1F44] mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {mode === 'signin' ? 'Enter your credentials to access your account.' : 'Fill in your details to get started.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className={inputClass} placeholder="Sarah Chen" required />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className={inputClass} placeholder="you@example.com" required />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className={inputClass} placeholder="+1 555-0100" />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="text-right">
                <button type="button" className="text-xs text-[#2E8FD8] hover:underline">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full bg-[#0A1F44] hover:bg-[#0d2a5e] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3.5 transition-colors mt-2 flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting
                ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {mode === 'signin' && (
            <div className="mt-6 p-4 bg-[#F4F7FB] rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Demo accounts:</p>
              {[
                { email: 'sarah@example.com', label: 'Passenger' },
                { email: 'admin@avion.com', label: 'Admin' },
                { email: 'jwilson@avion.com', label: 'Staff' },
              ].map(({ email: e, label }) => (
                <button key={e} type="button" onClick={() => setEmail(e)}
                  className="block text-xs text-[#2E8FD8] hover:underline mb-0.5">
                  {label}: {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
