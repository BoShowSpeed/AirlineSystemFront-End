import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router';
import { Plane, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { homeFor, AUTH_PATHS } from '../components/ProtectedRoute';
import type { UserRole } from '../types';

export type AuthVariant = 'passenger' | 'staff' | 'admin';

interface VariantConfig {
  /** The role this portal signs in. Login is rejected for any other role. */
  role: UserRole;
  /** Only passengers can self-register; staff/admin are provisioned by an admin. */
  allowRegister: boolean;
  eyebrow: string;
  headline: ReactNode;
  blurb: string;
  features: string[];
  /** Accent (buttons / icons) and left-panel background. */
  accent: string;
  accentHover: string;
  panelBg: string;
  signInTitle: string;
  demo: { email: string; label: string }[];
}

const VARIANTS: Record<AuthVariant, VariantConfig> = {
  passenger: {
    role: 'passenger',
    allowRegister: true,
    eyebrow: 'Traveler Account',
    headline: (<>Your journey<br />begins here</>),
    blurb: 'Join millions of travelers who trust Avion for seamless, world-class flights.',
    features: [
      'Book flights to 180+ destinations',
      'Real-time flight status updates',
      'Digital boarding passes',
      'Exclusive member fares',
      'Priority customer support',
    ],
    accent: '#2E8FD8',
    accentHover: '#1a75be',
    panelBg: '#0A1F44',
    signInTitle: 'Welcome back',
    demo: [{ email: 'sarah@example.com', label: 'Passenger' }],
  },
  staff: {
    role: 'staff',
    allowRegister: false,
    eyebrow: 'Crew & Staff Portal',
    headline: (<>Manage your roster,<br />gate to gate</>),
    blurb: 'Sign in to view assignments, set your availability, and access crew briefings.',
    features: [
      'View your flight assignments',
      'Set and update your availability',
      'Access crew briefings and rosters',
      'Coordinate with your operations team',
    ],
    accent: '#10B981',
    accentHover: '#0e9f6e',
    panelBg: '#0B3D2E',
    signInTitle: 'Staff sign in',
    demo: [{ email: 'jwilson@avion.com', label: 'Staff' }],
  },
  admin: {
    role: 'admin',
    allowRegister: false,
    eyebrow: 'Operations Control',
    headline: (<>Command center<br />for every flight</>),
    blurb: 'Restricted access. Sign in to manage flights, crew, aircraft, and system operations.',
    features: [
      'Live operations dashboard',
      'Manage flights and schedules',
      'Assign crew and aircraft',
      'Full system oversight',
    ],
    accent: '#8B5CF6',
    accentHover: '#7c46e6',
    panelBg: '#1E1B4B',
    signInTitle: 'Admin sign in',
    demo: [{ email: 'admin@avion.com', label: 'Admin' }],
  },
};

const ROLE_LABEL: Record<UserRole, string> = {
  guest: 'guest', passenger: 'passenger', staff: 'staff', admin: 'admin',
};

/** Links to the other portals, shown at the bottom of each page. */
const PORTAL_LINKS: { variant: AuthVariant; to: string; label: string; icon: typeof Users }[] = [
  { variant: 'passenger', to: '/auth', label: 'Traveler sign in', icon: Plane },
  { variant: 'staff', to: '/staff/login', label: 'Staff sign in', icon: Users },
  { variant: 'admin', to: '/admin/login', label: 'Admin sign in', icon: ShieldCheck },
];

interface Props {
  variant?: AuthVariant;
}

export default function AuthPage({ variant = 'passenger' }: Props) {
  const cfg = VARIANTS[variant];
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'register'>(
    cfg.allowRegister && params.get('mode') === 'register' ? 'register' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, logout, selectedFlight } = useApp();
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

      // Enforce the portal's role: reject an account that belongs elsewhere so
      // each sign-in page only admits its own role.
      if (authedUser.role !== cfg.role) {
        logout();
        setError(
          `That's a ${ROLE_LABEL[authedUser.role]} account. Please use the ${ROLE_LABEL[authedUser.role]} sign-in page.`
        );
        return;
      }

      // Where to go: mid-booking flow > the page they were sent from > role home.
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      if (selectedFlight) navigate('/seat-selection');
      else if (from && !AUTH_PATHS.includes(from)) navigate(from);
      else navigate(homeFor(authedUser.role));
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent';

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden p-12" style={{ backgroundColor: cfg.panelBg }}>
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.accent }}>
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AVI<span style={{ color: cfg.accent }}>ON</span></span>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: cfg.accent }}>{cfg.eyebrow}</span>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {cfg.headline}
          </h1>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            {cfg.blurb}
          </p>
          <ul className="space-y-3">
            {cfg.features.map(b => (
              <li key={b} className="flex items-center gap-3 text-white/80 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: cfg.accent }} />
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

          {/* Tabs — only where self-registration is allowed */}
          {cfg.allowRegister ? (
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
          ) : (
            <div className="flex items-center gap-2 mb-8 text-xs font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: `${cfg.accent}14`, color: cfg.accent }}>
              <ShieldCheck className="w-4 h-4" /> {cfg.eyebrow} · restricted access
            </div>
          )}

          <h2 className="text-[#0A1F44] mb-1">
            {mode === 'signin' ? cfg.signInTitle : 'Create your account'}
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
                  className={inputClass} style={{ '--tw-ring-color': cfg.accent } as React.CSSProperties} placeholder="Sarah Chen" required />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className={inputClass} style={{ '--tw-ring-color': cfg.accent } as React.CSSProperties} placeholder="you@example.com" required />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className={inputClass} style={{ '--tw-ring-color': cfg.accent } as React.CSSProperties} placeholder="+1 555-0100" />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`} style={{ '--tw-ring-color': cfg.accent } as React.CSSProperties} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="text-right">
                <button type="button" className="text-xs hover:underline" style={{ color: cfg.accent }}>Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full text-white rounded-xl py-3.5 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: cfg.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = cfg.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = cfg.accent)}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting
                ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {mode === 'signin' && (
            <div className="mt-6 p-4 bg-[#F4F7FB] rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Demo account{cfg.demo.length > 1 ? 's' : ''}:</p>
              {cfg.demo.map(({ email: e, label }) => (
                <button key={e} type="button" onClick={() => setEmail(e)}
                  className="block text-xs hover:underline mb-0.5" style={{ color: cfg.accent }}>
                  {label}: {e}
                </button>
              ))}
            </div>
          )}

          {/* Cross-links to the other portals */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-2">
            {PORTAL_LINKS.filter(p => p.variant !== variant).map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">
                <Icon className="w-3.5 h-3.5" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
