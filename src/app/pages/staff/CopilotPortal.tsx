import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plane, CalendarRange, LogOut, CheckSquare, Square,
  Navigation, Target, RefreshCw, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StaffMember } from '../../types';
import { MOCK_FLIGHTS } from '../../data/mockData';

interface Props { staffMember: StaffMember }

const COORDINATION = [
  { id: 'brief',   label: 'Captain pre-flight briefing',    detail: 'Completed 08:15 — Capt. Wilson', done: true },
  { id: 'callout', label: 'Standard callouts reviewed',     detail: 'SOP Vol. 2 Ch. 4 — all acknowledged', done: true },
  { id: 'emerg',   label: 'Emergency procedures confirmed', detail: 'FCOM QRH locations checked', done: true },
  { id: 'vspeeds', label: 'V-speeds calculated',            detail: 'V1: 152kt · Vr: 159kt · V2: 165kt', done: false },
  { id: 'altm',    label: 'Altimeter set & QNH verified',   detail: 'QNH 29.92" — cross-check with ATIS', done: false },
  { id: 'fdp',     label: 'FDP limits acknowledged',        detail: 'Max duty: 14h · Report: 07:30', done: false },
];

const CURRENCY = [
  { label: 'Last ILS approach',      value: '15 days ago',  ok: true,  detail: 'Min 90-day currency' },
  { label: 'Night hours (90 days)',   value: '12h',          ok: true,  detail: 'Min 3h required' },
  { label: 'Last sim check',          value: '45 days ago',  ok: true,  detail: 'Every 6 months' },
  { label: 'Next OPC check',          value: 'In 180 days',  ok: true,  detail: 'Operator Prof. Check' },
  { label: 'Line check',              value: 'In 30 days',   ok: false, detail: 'Annual requirement' },
];

export default function CopilotPortal({ staffMember }: Props) {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [coord, setCoord] = useState(COORDINATION.map(i => ({ ...i })));

  const nextFlight = MOCK_FLIGHTS[2]; // AV203 JFK→CDG
  const done = coord.filter(i => i.done).length;
  const toggle = (id: string) =>
    setCoord(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
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
                First Officer · {staffMember.license} · {staffMember.yearsExp} yrs exp.
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

            {/* Flight Plan */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] px-5 py-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Flight Plan</span>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white/70">IFPS Confirmed</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-3xl font-black">{nextFlight.originCode}</div>
                    <div className="text-white/40 text-xs">{nextFlight.origin}</div>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 border-t border-dashed border-white/20" />
                    <Plane className="w-4 h-4 text-[#2E8FD8]" style={{ transform: 'rotate(45deg)' }} />
                    <div className="flex-1 border-t border-dashed border-white/20" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">{nextFlight.destinationCode}</div>
                    <div className="text-white/40 text-xs">{nextFlight.destination}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#F4F7FB] rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Route</div>
                    <div className="text-xs font-mono text-[#0A1F44] leading-relaxed">
                      JFK/BETTE2 HAAYS UR80<br />
                      MIMKU UR73 SOPOK<br />
                      M083F350 CDG
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Cruise', value: 'FL350 · Mach 0.83' },
                      { label: 'Alternates', value: 'BRU · AMS' },
                      { label: 'Est. fuel', value: '42,800 kg' },
                      { label: 'ETOPS', value: '180 min approved' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-semibold text-[#0A1F44]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Approach Briefing */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#2E8FD8]" /> Approach Briefing · CDG
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {[
                    { label: 'Runway', value: '27L (ILS CAT II)' },
                    { label: 'Decision Alt', value: '200 ft AGL' },
                    { label: 'RVR Required', value: '400m' },
                    { label: 'G/S angle', value: '3.0°' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-[#0A1F44]">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F4F7FB] rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Missed Approach</div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    Climb to 4,000ft, then turn left heading 175° to MOPAR, climb to 5,000ft. Contact Paris Approach.
                  </div>
                  <div className="mt-3 text-xs text-gray-400 uppercase tracking-widest mb-1">V-Speeds</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['V1', '152'], ['Vr', '159'], ['V2', '165']].map(([label, val]) => (
                      <div key={label} className="bg-white rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-400">{label}</div>
                        <div className="font-bold text-[#0A1F44]">{val}</div>
                        <div className="text-xs text-gray-400">kt</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Captain Coordination */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#0A1F44]">Captain Coordination</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  done === coord.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{done}/{coord.length}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#2E8FD8] rounded-full transition-all" style={{ width: `${(done / coord.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {coord.map(item => (
                  <button key={item.id} onClick={() => toggle(item.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      item.done ? 'bg-blue-50' : 'bg-[#F4F7FB] hover:bg-gray-100'
                    }`}>
                    {item.done
                      ? <CheckSquare className="w-5 h-5 text-[#2E8FD8] shrink-0 mt-0.5" />
                      : <Square className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />}
                    <div>
                      <div className={`text-sm font-medium ${item.done ? 'text-[#2E8FD8] line-through decoration-[#2E8FD8]/40' : 'text-[#0A1F44]'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right 1/3 ── */}
          <div className="space-y-4">

            {/* Instrument Currency */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 flex items-center gap-2 text-base">
                <RefreshCw className="w-4 h-4 text-[#2E8FD8]" /> Currency Tracker
              </h4>
              <div className="space-y-2.5">
                {CURRENCY.map(({ label, value, ok, detail }) => (
                  <div key={label} className={`p-2.5 rounded-xl border ${ok ? 'border-gray-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className="text-xs font-semibold text-[#0A1F44]">{label}</span>
                      </div>
                      <span className={`text-xs font-bold ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>{value}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 ml-4">{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Ratings */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 flex items-center gap-2 text-base">
                <ShieldCheck className="w-4 h-4 text-[#2E8FD8]" /> Type Ratings
              </h4>
              <div className="space-y-2">
                {[
                  { type: 'Boeing 777', exp: 'Jun 2027', current: true },
                  { type: 'Airbus A350', exp: 'Sep 2026', current: true },
                ].map(({ type, exp, current }) => (
                  <div key={type} className="flex items-center gap-3 p-2.5 bg-[#F4F7FB] rounded-xl">
                    <div className={`w-2 h-2 rounded-full ${current ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-[#0A1F44]">{type}</div>
                      <div className="text-xs text-gray-400">Exp. {exp}</div>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Current</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3">June Stats</h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Flight hours',    value: '68h',  color: 'text-[#2E8FD8]' },
                  { label: 'Sectors',         value: '10',   color: 'text-[#0A1F44]' },
                  { label: 'ILS approaches',  value: '4',    color: 'text-purple-600' },
                  { label: 'Night hours',     value: '12h',  color: 'text-amber-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="space-y-2">
              <button onClick={() => navigate('/staff/availability')}
                className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 hover:bg-[#F4F7FB] transition-colors shadow-sm">
                <span className="flex items-center gap-2"><Navigation className="w-4 h-4 text-[#2E8FD8]" /> My Availability</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={() => navigate('/change-password')}
                className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 hover:bg-[#F4F7FB] transition-colors shadow-sm">
                Change Password <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
