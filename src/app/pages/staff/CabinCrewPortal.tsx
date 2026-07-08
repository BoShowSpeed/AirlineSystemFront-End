import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plane, CalendarRange, LogOut, CheckSquare, Square,
  AlertTriangle, Star, UserCheck, ChevronRight, Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StaffMember } from '../../types';
import { MOCK_FLIGHTS } from '../../data/mockData';

interface Props { staffMember: StaffMember }

const SAFETY_CHECKS = [
  { id: 'fire',  label: 'Fire extinguishers checked', detail: 'Port & starboard — charged & sealed', done: true },
  { id: 'vest',  label: 'Life vests at all seats',    detail: 'Rows 1–35 verified', done: true },
  { id: 'oxy',   label: 'O₂ masks test confirmed',    detail: 'Drop test completed pre-boarding', done: true },
  { id: 'exits', label: 'Emergency exits armed',      detail: 'All 8 doors armed & cross-checked', done: false },
  { id: 'demo',  label: 'Safety demo equipment',      detail: 'Seatbelt, mask, vest props staged', done: false },
];

const SERVICE_TIMELINE = [
  { time: '14:00', label: 'Pre-boarding cabin check', done: true,  active: false },
  { time: '14:15', label: 'Boarding & welcome guests', done: false, active: true  },
  { time: '14:30', label: 'Doors armed — safety demo', done: false, active: false },
  { time: '15:30', label: 'Meal & beverage service',   done: false, active: false },
  { time: '17:00', label: 'Duty-free & secondary svc', done: false, active: false },
  { time: '20:30', label: 'Cabin secure · landing prep',done: false, active: false },
  { time: '21:15', label: 'Doors disarmed · deplaning', done: false, active: false },
];

const PASSENGER_ALERTS = [
  { Icon: Star,        label: '3x VIP / Gold members',       detail: 'Priority service rows 1–4',        color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { Icon: Heart,       label: '4x Special meals',            detail: 'VGML ×2 · KSML ×1 · GFML ×1',     color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-100'  },
  { Icon: UserCheck,   label: '1x Wheelchair assist',        detail: 'Seat 8A — pre-board required',      color: 'text-purple-600',bg: 'bg-purple-50',border: 'border-purple-100'},
  { Icon: AlertTriangle,label: '2x Unaccompanied minors',   detail: 'Seats 14C, 22D — extra attention',  color: 'text-rose-600',  bg: 'bg-rose-50',  border: 'border-rose-100'  },
];

const TRAINING = [
  { label: 'Safety Drills',        due: 'Aug 2026', daysLeft: 84, ok: true  },
  { label: 'First Aid / CPR',      due: 'Dec 2026', daysLeft: 208, ok: true },
  { label: 'Security Awareness',   due: 'Jun 2026', daysLeft: -5, ok: false },
  { label: 'Dangerous Goods',      due: 'Oct 2026', daysLeft: 136, ok: true },
];

export default function CabinCrewPortal({ staffMember }: Props) {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [checks, setChecks] = useState(SAFETY_CHECKS.map(i => ({ ...i })));

  const nextFlight = MOCK_FLIGHTS[1]; // AV102 JFK→LHR
  const done = checks.filter(i => i.done).length;
  const toggle = (id: string) =>
    setChecks(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const logout = () => { setUser(null); navigate('/'); };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Header */}
      <div className="bg-[#0A1F44] text-white py-5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2E8FD8] flex items-center justify-center font-bold text-lg">
              {staffMember.initials}
            </div>
            <div>
              <div className="text-lg font-semibold">{staffMember.name}</div>
              <div className="text-white/60 text-sm flex items-center gap-2">
                Cabin Crew · {staffMember.license} · Zone A Assigned
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2 py-0.5 rounded-full">
                  Zone A
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/staff/availability')}
              className="flex items-center gap-2 bg-[#2E8FD8] hover:bg-[#1a75be] text-white text-sm px-4 py-2 rounded-xl transition-colors">
              <CalendarRange className="w-4 h-4" /> Set Availability
            </button>
            <button onClick={logout}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left 2/3 ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Zone Assignment Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0A1F44]">
                  Zone Assignment · {nextFlight.number}
                </h3>
                <div className="text-xs bg-[#EFF6FF] text-[#2E8FD8] font-semibold px-3 py-1 rounded-full">
                  {nextFlight.date} · {nextFlight.departureTime}
                </div>
              </div>

              {/* Cabin diagram */}
              <div className="bg-[#F4F7FB] rounded-xl p-4 mb-4">
                <div className="text-xs text-gray-400 mb-3 text-center">Aircraft Cabin · {nextFlight.aircraft}</div>
                <div className="flex gap-2 justify-center items-start">
                  {/* Nose */}
                  <div className="w-8 flex items-center justify-center self-center">
                    <Plane className="w-5 h-5 text-gray-400" style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                  {/* Cabin sections */}
                  <div className="flex-1 max-w-xs space-y-1.5">
                    <div className="bg-[#0A1F44] text-white text-xs text-center py-2 rounded-lg font-semibold">
                      First · Rows 1–3
                    </div>
                    <div className="bg-[#2E8FD8] text-white text-xs text-center py-2 rounded-lg font-semibold relative">
                      Business · Rows 4–10
                    </div>
                    <div className="bg-emerald-500 text-white text-xs text-center py-2.5 rounded-lg font-bold ring-2 ring-emerald-400 ring-offset-1 relative">
                      ★ Zone A (You) · Rows 11–23
                    </div>
                    <div className="bg-gray-200 text-gray-600 text-xs text-center py-2 rounded-lg">
                      Zone B · Rows 24–35
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Route', value: `${nextFlight.originCode} → ${nextFlight.destinationCode}` },
                  { label: 'Seats in zone', value: '78 seats' },
                  { label: 'Cabin Manager', value: 'Emma Thompson' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F4F7FB] rounded-xl p-2.5">
                    <div className="text-gray-400 mb-0.5">{label}</div>
                    <div className="font-semibold text-[#0A1F44]">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4">Service Timeline</h3>
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />
                <div className="space-y-3">
                  {SERVICE_TIMELINE.map(({ time, label, done: isDone, active }) => (
                    <div key={time} className="flex items-start gap-4 relative">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                        isDone  ? 'bg-emerald-500 border-emerald-500'  :
                        active  ? 'bg-[#2E8FD8] border-[#2E8FD8]'     :
                        'bg-white border-gray-200'
                      }`}>
                        {isDone && <div className="w-2 h-2 bg-white rounded-full" />}
                        {active && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      </div>
                      <div className={`flex-1 flex items-center justify-between pb-2 ${active ? '' : ''}`}>
                        <span className={`text-sm ${isDone ? 'text-gray-400 line-through' : active ? 'text-[#2E8FD8] font-semibold' : 'text-gray-600'}`}>
                          {label}
                        </span>
                        <span className={`text-xs font-mono shrink-0 ml-2 ${active ? 'text-[#2E8FD8] font-bold' : 'text-gray-400'}`}>
                          {time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Passenger Alerts */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4">Passenger Alerts</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PASSENGER_ALERTS.map(({ Icon, label, detail, color, bg, border }) => (
                  <div key={label} className={`${bg} border ${border} rounded-xl p-3.5 flex items-start gap-3`}>
                    <div className={`${color} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${color}`}>{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right 1/3 ── */}
          <div className="space-y-4">

            {/* Safety Equipment Check */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[#0A1F44] text-base">Safety Checks</h4>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  done === checks.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{done}/{checks.length}</span>
              </div>
              <div className="space-y-2">
                {checks.map(item => (
                  <button key={item.id} onClick={() => toggle(item.id)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                      item.done ? 'bg-emerald-50' : 'bg-[#F4F7FB] hover:bg-gray-100'
                    }`}>
                    {item.done
                      ? <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      : <Square className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
                    <div>
                      <div className={`text-xs font-semibold ${item.done ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-[#0A1F44]'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Training Recurrent */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3">Recurrent Training</h4>
              <div className="space-y-2">
                {TRAINING.map(({ label, due, daysLeft, ok }) => (
                  <div key={label} className={`flex items-center gap-3 p-2.5 rounded-xl ${!ok ? 'bg-red-50 border border-red-100' : ''}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${!ok ? 'bg-red-500' : daysLeft < 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0A1F44]">{label}</div>
                      <div className="text-xs text-gray-400">
                        {!ok ? <span className="text-red-600 font-semibold">OVERDUE {Math.abs(daysLeft)}d</span> : `Due ${due}`}
                      </div>
                    </div>
                    {ok && <span className={`text-xs font-bold shrink-0 ${daysLeft < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{daysLeft}d</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Crew Notices */}
            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-[#0A1F44] mb-2">Crew Notices</h4>
              <div className="space-y-2">
                {[
                  'New Business class service sequence effective Jun 1',
                  'Mandatory safety briefing: Jun 10, 09:00',
                  'New emergency chime codes — see FCOM update',
                ].map((n, i) => (
                  <div key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-[#2E8FD8] shrink-0">•</span>{n}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate('/change-password')}
              className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 hover:bg-[#F4F7FB] transition-colors shadow-sm">
              Change Password <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
