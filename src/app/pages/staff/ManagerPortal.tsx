import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CalendarRange, LogOut, Users, CheckCircle2, XCircle,
  Clock, AlertTriangle, ChevronRight, Bell, Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StaffMember } from '../../types';

interface Props { staffMember: StaffMember }

const TODAY_CREWS = [
  {
    flight: 'AV101', route: 'JFK→LHR', time: '09:00', gate: 'B12', status: 'scheduled',
    crew: [
      { initials: 'JW', name: 'J. Wilson',    role: 'Captain'  },
      { initials: 'OM', name: 'O. Martinez',  role: 'First Officer' },
      { initials: 'PS', name: 'P. Sharma',    role: 'FA Zone A' },
      { initials: 'DP', name: 'D. Park',      role: 'FA Zone B' },
    ],
  },
  {
    flight: 'AV102', route: 'JFK→LHR', time: '14:30', gate: 'C04', status: 'confirmed',
    crew: [
      { initials: 'MJ', name: 'M. Johnson',   role: 'Captain'  },
      { initials: 'OM', name: 'O. Martinez',  role: 'First Officer' },
      { initials: 'ET', name: 'E. Thompson',  role: 'Cabin Manager' },
      { initials: 'PS', name: 'P. Sharma',    role: 'FA Zone A' },
    ],
  },
  {
    flight: 'AV304', route: 'JFK→DXB', time: '22:00', gate: 'D02', status: 'scheduled',
    crew: [
      { initials: 'MJ', name: 'M. Johnson',   role: 'Captain'  },
      { initials: 'ET', name: 'E. Thompson',  role: 'Cabin Manager' },
    ],
  },
];

type ActionType = 'leave' | 'swap' | 'overtime';

interface PendingAction {
  id: string;
  type: ActionType;
  name: string;
  detail: string;
  urgent: boolean;
  resolved: boolean;
}

const INITIAL_ACTIONS: PendingAction[] = [
  { id: 'a1', type: 'leave',    name: 'Daniel Park',     detail: 'Leave request: Jun 20–25 (6 days)', urgent: false, resolved: false },
  { id: 'a2', type: 'swap',     name: 'Priya Sharma',    detail: 'Flight swap request: AV405 → AV102', urgent: false, resolved: false },
  { id: 'a3', type: 'overtime', name: 'Olivia Martinez', detail: 'Overtime approval: 8h extra duty Jun 18', urgent: true, resolved: false },
];

const TEAM_STATUS = [
  { label: 'Available',   count: 4, color: 'bg-emerald-500', pct: 57 },
  { label: 'On Leave',    count: 1, color: 'bg-gray-400',    pct: 14 },
  { label: 'Training',    count: 1, color: 'bg-amber-400',   pct: 14 },
  { label: 'On Flight',   count: 1, color: 'bg-[#2E8FD8]',  pct: 14 },
];

const INCIDENTS = [
  { date: 'Jun 3', desc: 'Passenger complaint — seat adjustment issue', status: 'Resolved', ok: true },
  { date: 'Jun 1', desc: 'Minor medical incident — cabin Zone B', status: 'Closed',   ok: true },
];

const COMPLIANCE = [
  { label: 'Medical renewals due',  detail: '2 staff in 30 days', warn: true  },
  { label: 'Safety training',       detail: '1 crew member overdue', warn: true  },
  { label: 'Emergency drills',      detail: 'All current', warn: false },
  { label: 'Drug & alcohol tests',  detail: 'Quarterly — next Jul 1', warn: false },
];

export default function ManagerPortal({ staffMember }: Props) {
  const { setUser, staffMembers } = useApp();
  const navigate = useNavigate();
  const [actions, setActions] = useState(INITIAL_ACTIONS);

  const resolve = (id: string) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  const pending = actions.filter(a => !a.resolved);
  const logout = () => { setUser(null); navigate('/'); };

  const STATUS_COLORS: Record<string, string> = {
    scheduled: 'text-[#2E8FD8]', confirmed: 'text-emerald-600', delayed: 'text-amber-600',
  };

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
                Cabin Manager / Purser · {staffMember.license} · {staffMember.yearsExp} yrs
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

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Crews Scheduled', value: '3',   icon: Briefcase, color: 'text-[#2E8FD8]', bg: 'bg-[#EFF6FF]' },
            { label: 'Staff Assigned',  value: `${staffMembers.length}`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Actions', value: `${pending.length}`, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Compliance Flags',value: '2',   icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left 2/3 ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Today's Crew Assignments */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4">Today's Crew Assignments</h3>
              <div className="space-y-3">
                {TODAY_CREWS.map(({ flight, route, time, gate, status, crew }) => (
                  <div key={flight} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-[#0A1F44] text-sm">{flight}</span>
                        <span className="text-gray-400 text-sm mx-1.5">·</span>
                        <span className="text-sm text-gray-600">{route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{time} · Gate {gate}
                        </span>
                        <span className={`text-xs font-semibold capitalize ${STATUS_COLORS[status] ?? 'text-gray-500'}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {crew.map(({ initials, name, role }) => (
                        <div key={initials} className="flex items-center gap-1.5 bg-[#F4F7FB] rounded-lg px-2.5 py-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#0A1F44] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#0A1F44] leading-none">{name}</div>
                            <div className="text-xs text-gray-400 leading-none mt-0.5">{role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0A1F44]">Pending Actions</h3>
                {pending.length > 0 && (
                  <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    {pending.length} pending
                  </span>
                )}
              </div>
              {pending.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">All actions cleared ✓</div>
              ) : (
                <div className="space-y-3">
                  {pending.map(({ id, type, name, detail, urgent }) => (
                    <div key={id} className={`flex items-start gap-4 p-4 rounded-xl border ${urgent ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-[#F4F7FB]'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-[#0A1F44]">{name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                            type === 'leave'    ? 'bg-blue-100 text-blue-700'  :
                            type === 'swap'     ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{type}</span>
                          {urgent && <span className="text-xs text-amber-600 font-bold">Urgent</span>}
                        </div>
                        <div className="text-xs text-gray-500">{detail}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => resolve(id)}
                          className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors" title="Approve">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button onClick={() => resolve(id)}
                          className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors" title="Decline">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Incident Log */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-[#0A1F44] mb-4">Recent Incidents</h3>
              <div className="space-y-2">
                {INCIDENTS.map(({ date, desc, status, ok }) => (
                  <div key={date} className="flex items-center gap-3 p-3 bg-[#F4F7FB] rounded-xl">
                    <div className="w-2 h-2 rounded-full shrink-0 bg-emerald-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#0A1F44]">{desc}</div>
                      <div className="text-xs text-gray-400">{date}</div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right 1/3 ── */}
          <div className="space-y-4">

            {/* Team Status */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-4 flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-[#2E8FD8]" /> Team Status
              </h4>
              <div className="space-y-2.5">
                {TEAM_STATUS.map(({ label, count, color, pct }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="text-gray-600">{label}</span>
                      </div>
                      <span className="font-bold text-[#0A1F44]">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 text-base">Compliance Tracker</h4>
              <div className="space-y-2">
                {COMPLIANCE.map(({ label, detail, warn }) => (
                  <div key={label} className={`p-2.5 rounded-xl border ${warn ? 'bg-red-50 border-red-100' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${warn ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-semibold text-[#0A1F44]">{label}</span>
                    </div>
                    <div className={`text-xs mt-0.5 ml-4 ${warn ? 'text-red-600 font-medium' : 'text-gray-400'}`}>{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-[#0A1F44] mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {['Send notice to crew', 'Schedule team briefing', 'View full roster', 'Download duty report'].map(action => (
                  <button key={action}
                    className="w-full text-left text-xs text-[#2E8FD8] font-medium py-1.5 px-2 rounded-lg hover:bg-[#2E8FD8]/10 transition-colors flex items-center justify-between">
                    {action} <ChevronRight className="w-3 h-3" />
                  </button>
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
