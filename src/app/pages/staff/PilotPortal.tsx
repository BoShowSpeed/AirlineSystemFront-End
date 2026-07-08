import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plane, CalendarRange, LogOut, CheckSquare, Square,
  Clock, Users, Wind, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StaffMember } from '../../types';
import { MOCK_FLIGHTS } from '../../data/mockData';

interface Props { staffMember: StaffMember }

const CHECKLIST = [
  { id: 'wx',    label: 'Weather review',         detail: 'VFR, winds 240°/12kt gusting 18kt', done: true },
  { id: 'notam', label: 'NOTAM check',            detail: 'No active restrictions JFK→LHR', done: true },
  { id: 'fuel',  label: 'Fuel load confirmed',    detail: '45,200 kg · reserves: 6,800 kg', done: true },
  { id: 'plan',  label: 'Flight plan filed',      detail: 'ATC clearance received (DEP: 09:00Z)', done: true },
  { id: 'brief', label: 'Crew briefing',          detail: 'PIC + FA briefing required at 07:30', done: false },
  { id: 'walk',  label: 'Aircraft walk-around',   detail: 'External inspection · Boeing 777-300ER', done: false },
  { id: 'board', label: 'Passenger boarding',     detail: 'Awaiting gate agent confirmation', done: false },
  { id: 'wb',    label: 'Final weight & balance', detail: 'Load sheet sign-off pending', done: false },
];

const CREW_MANIFEST = [
  { initials: 'JW', name: 'Capt. James Wilson', role: 'Captain · PIC', isYou: true },
  { initials: 'OM', name: 'Olivia Martinez',    role: 'First Officer', isYou: false },
  { initials: 'ET', name: 'Emma Thompson',      role: 'Cabin Manager', isYou: false },
  { initials: 'PS', name: 'Priya Sharma',       role: 'FA · Zone A',   isYou: false },
  { initials: 'DP', name: 'Daniel Park',        role: 'FA · Zone B',   isYou: false },
];

const CURRENCIES = [
  { label: 'ATP License',      expiry: 'Dec 2027', daysLeft: 570, warn: false },
  { label: 'Class 1 Medical',  expiry: 'Sep 2026', daysLeft: 116, warn: false },
  { label: '777 Type Rating',  expiry: 'Mar 2027', daysLeft: 284, warn: false },
  { label: 'CRM Training',     expiry: 'Jul 2026', daysLeft:  44, warn: true  },
];

export default function PilotPortal({ staffMember }: Props) {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(CHECKLIST.map(i => ({ ...i })));

  const nextFlight = MOCK_FLIGHTS[0];
  const completed = checklist.filter(i => i.done).length;
  const toggle = (id: string) =>
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
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
              <div className="text-white/60 text-sm">
                Captain / Pilot · {staffMember.license} · {staffMember.yearsExp} yrs exp.
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

            {/* Next Mission */}
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6e] rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Next Assignment</span>
                <span className="bg-[#2E8FD8]/20 border border-[#2E8FD8]/40 text-[#7dc4f0] text-xs font-semibold px-3 py-1 rounded-full">
                  Report: Jun 15 · 07:30
                </span>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div>
                  <div className="text-4xl font-black tracking-tight">{nextFlight.originCode}</div>
                  <div className="text-white/40 text-xs mt-0.5">{nextFlight.origin}</div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 border-t border-dashed border-white/20" />
                  <Plane className="w-5 h-5 text-[#2E8FD8]" style={{ transform: 'rotate(45deg)' }} />
                  <div className="flex-1 border-t border-dashed border-white/20" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black tracking-tight">{nextFlight.destinationCode}</div>
                  <div className="text-white/40 text-xs mt-0.5">{nextFlight.destination}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Flight', value: nextFlight.number },
                  { label: 'Departs', value: nextFlight.departureTime },
                  { label: 'Duration', value: nextFlight.duration },
                  { label: 'Gate', value: nextFlight.gate },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-xs text-white/40">{label}</div>
                    <div className="text-sm font-bold mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-white/30">{nextFlight.aircraft} · {nextFlight.date}</div>
            </div>

            {/* Pre-departure Checklist */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#0A1F44]">Pre-departure Checklist</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  completed === checklist.length
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>{completed}/{checklist.length} Complete</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completed / checklist.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {checklist.map(item => (
                  <button key={item.id} onClick={() => toggle(item.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      item.done ? 'bg-emerald-50' : 'bg-[#F4F7FB] hover:bg-gray-100'
                    }`}>
                    {item.done
                      ? <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      : <Square className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />}
                    <div>
                      <div className={`text-sm font-medium ${item.done ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-[#0A1F44]'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crew Manifest */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2E8FD8]" /> Crew Manifest · {nextFlight.number}
              </h3>
              <div className="space-y-2">
                {CREW_MANIFEST.map(m => (
                  <div key={m.name} className={`flex items-center gap-3 p-3 rounded-xl ${
                    m.isYou ? 'bg-[#EFF6FF] border border-[#2E8FD8]/30' : 'bg-[#F4F7FB]'
                  }`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      m.isYou ? 'bg-[#2E8FD8] text-white' : 'bg-[#0A1F44] text-white'
                    }`}>{m.initials}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#0A1F44]">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.role}</div>
                    </div>
                    {m.isYou && (
                      <span className="text-xs font-semibold text-[#2E8FD8] bg-[#2E8FD8]/10 px-2 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right 1/3 ── */}
          <div className="space-y-4">

            {/* Duty & Rest Tracker */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-[#2E8FD8]" /> Duty & Rest (FAR 117)
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Monthly hours</span><span className="font-semibold text-[#0A1F44]">84h / 100h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2E8FD8] rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Annual hours</span><span className="font-semibold text-[#0A1F44]">412h / 1000h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '41%' }} />
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <div className="text-xs text-gray-500">Current rest period</div>
                  <div className="text-xl font-bold text-emerald-600 mt-0.5">14h 20m remaining</div>
                  <div className="text-xs text-gray-400 mt-0.5">Duty commences: Jun 15 · 07:30</div>
                </div>
              </div>
            </div>

            {/* License & Medical */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 flex items-center gap-2 text-base">
                <ShieldCheck className="w-4 h-4 text-[#2E8FD8]" /> License & Currency
              </h4>
              <div className="space-y-2">
                {CURRENCIES.map(({ label, expiry, daysLeft, warn }) => (
                  <div key={label} className={`flex items-center gap-3 p-2.5 rounded-xl ${warn ? 'bg-amber-50 border border-amber-100' : ''}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${daysLeft < 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0A1F44]">{label}</div>
                      <div className="text-xs text-gray-400">Exp. {expiry}</div>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${daysLeft < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {daysLeft}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* June Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3">June Stats</h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Sectors flown',  value: '12',    color: 'text-[#2E8FD8]' },
                  { label: 'Flight hours',   value: '84h',   color: 'text-[#0A1F44]' },
                  { label: 'Routes operated',value: '4',     color: 'text-purple-600' },
                  { label: 'Days available', value: '22/30', color: 'text-emerald-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ATIS / Weather */}
            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-[#2E8FD8]" />
                <h4 className="text-sm font-semibold text-[#0A1F44]">JFK ATIS</h4>
              </div>
              <div className="space-y-1 text-xs text-gray-600 font-mono">
                <div>Winds: 240°/12kt G18kt</div>
                <div>Visibility: 10SM SKC</div>
                <div>Temp: 22°C / Dew: 11°C</div>
                <div>QNH: 29.92 inHg</div>
                <div className="text-[#2E8FD8] mt-1">Rwy in use: 31L / 31R</div>
              </div>
            </div>

            {/* Quick nav */}
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
