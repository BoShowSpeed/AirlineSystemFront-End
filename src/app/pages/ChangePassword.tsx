import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { changePassword } from '../api/auth';

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ChangePassword() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const requirements = REQUIREMENTS.map(r => ({ ...r, met: r.test(next) }));
  const allMet = requirements.every(r => r.met);
  const matches = next === confirm && next.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (!allMet) { setError('New password does not meet all requirements.'); return; }
    if (!matches) { setError('New password and confirmation do not match.'); return; }
    setLoading(true);
    try {
      await changePassword({ current_password: current, new_password: next });
      setSuccess(true);
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Could not update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent pr-12';

  const backPath = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard';

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-[#0A1F44] mb-2">Password Updated</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your password has been changed successfully. Use your new password next time you sign in.
          </p>
          <button onClick={() => navigate(backPath)}
            className="w-full bg-[#0A1F44] hover:bg-[#2E8FD8] text-white py-3 rounded-xl transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-[#F4F7FB]">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0A1F44] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className="w-11 h-11 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#2E8FD8]" />
            </div>
            <div>
              <h2 className="text-[#0A1F44]">Change Password</h2>
              {user && (
                <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter current password"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNext ? 'text' : 'password'}
                  value={next}
                  onChange={e => setNext(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Create a strong password"
                  required
                />
                <button type="button" onClick={() => setShowNext(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength requirements */}
              {next.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {requirements.map(({ label, met }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${met ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        {met
                          ? <CheckCircle2 className="w-3 h-3" />
                          : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        }
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {/* Strength bar */}
              {next.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map(i => {
                      const filled = requirements.filter(r => r.met).length >= i;
                      const colors = ['bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'];
                      return (
                        <div key={i} className={`flex-1 rounded-full transition-colors ${filled ? colors[requirements.filter(r => r.met).length - 1] : 'bg-gray-200'}`} />
                      );
                    })}
                  </div>
                  <div className="text-xs mt-1 text-gray-400">
                    {['', 'Weak', 'Fair', 'Good', 'Strong'][requirements.filter(r => r.met).length]}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={`${inputClass} pl-10 ${confirm.length > 0 ? (matches ? 'ring-2 ring-emerald-400 border-emerald-300' : 'ring-2 ring-red-300 border-red-200') : ''}`}
                  placeholder="Repeat new password"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && !matches && (
                <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
              )}
              {matches && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !allMet || !matches || !current}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 ${
                loading || !allMet || !matches || !current
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0A1F44] hover:bg-[#2E8FD8] text-white'
              }`}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" /> Updating...</>
                : 'Update Password'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          If you've forgotten your current password, <button className="text-[#2E8FD8] hover:underline">reset it via email</button>.
        </p>
      </div>
    </div>
  );
}
