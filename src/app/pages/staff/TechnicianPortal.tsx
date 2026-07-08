import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CalendarRange, LogOut, Wrench, CheckCircle2, ChevronDown,
  ChevronUp, AlertTriangle, ShieldCheck, ClipboardList, Package,
  ChevronRight, Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StaffMember, MaintenanceType } from '../../types';

interface Props { staffMember: StaffMember }

interface MaintenanceItem {
  id: string;
  aircraft: string;
  model: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  estimatedHours: number;
  priority: 'high' | 'medium' | 'low';
}

interface ItemState {
  expanded: boolean;
  notes: string;
  partsUsed: string;
  completed: boolean;
}

const SCHEDULE: MaintenanceItem[] = [
  {
    id: 'M001',
    aircraft: 'N-AV003',
    model: 'Boeing 787-9',
    type: 'emergency',
    description: 'FMS avionics unit failure — software update & ILS calibration required. Aircraft grounded pending resolution.',
    scheduledDate: 'Jun 5, 2026',
    estimatedHours: 8,
    priority: 'high',
  },
  {
    id: 'M002',
    aircraft: 'N-AV001',
    model: 'Boeing 777-300ER',
    type: 'inspection',
    description: 'Hydraulic fluid sample analysis — Engine 1 & 2 hydraulic lines. Check for contamination and pressure integrity.',
    scheduledDate: 'Jun 6, 2026',
    estimatedHours: 3,
    priority: 'medium',
  },
  {
    id: 'M003',
    aircraft: 'N-AV004',
    model: 'Airbus A350-900',
    type: 'routine',
    description: '500-hour scheduled maintenance check. Includes control surface inspection, APU service, and cabin pressurization test.',
    scheduledDate: 'Jun 6, 2026',
    estimatedHours: 12,
    priority: 'medium',
  },
  {
    id: 'M004',
    aircraft: 'N-AV002',
    model: 'Airbus A380',
    type: 'inspection',
    description: 'Cabin pressurization differential pressure test. Verify door seals and fuselage integrity per airworthiness directive.',
    scheduledDate: 'Jun 8, 2026',
    estimatedHours: 4,
    priority: 'medium',
  },
  {
    id: 'M005',
    aircraft: 'N-AV005',
    model: 'Boeing 737-800',
    type: 'routine',
    description: 'Ground runup test following landing gear sensor replacement. Verify sensor calibration and perform taxi test.',
    scheduledDate: 'Jun 10, 2026',
    estimatedHours: 5,
    priority: 'low',
  },
  {
    id: 'M006',
    aircraft: 'N-AV001',
    model: 'Boeing 777-300ER',
    type: 'routine',
    description: 'Pre-flight walk-around and engine oil top-up. Record all findings in the aircraft technical log.',
    scheduledDate: 'Jun 5, 2026',
    estimatedHours: 1,
    priority: 'low',
  },
];

const TYPE_CONFIG: Record<MaintenanceType, { label: string; bg: string; text: string; border: string; dot: string }> = {
  emergency:  { label: 'Emergency',  bg: 'bg-red-50',   text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-500'    },
  inspection: { label: 'Inspection', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500'  },
  routine:    { label: 'Routine',    bg: 'bg-blue-50',  text: 'text-[#2E8FD8]', border: 'border-blue-200',  dot: 'bg-[#2E8FD8]' },
};

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-gray-300',
};

const CERTIFICATIONS = [
  { label: 'AME License',             expiry: 'Dec 2028', daysLeft: 940, warn: false },
  { label: 'Avionics Systems Rating',  expiry: 'Mar 2027', daysLeft: 284, warn: false },
  { label: 'Engine Rating (CFM56)',    expiry: 'Nov 2026', daysLeft: 166, warn: false },
  { label: 'RII Authorization',        expiry: 'Aug 2026', daysLeft:  87, warn: true  },
];

type FilterTab = 'upcoming' | 'completed';

export default function TechnicianPortal({ staffMember }: Props) {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [tab, setTab] = useState<FilterTab>('upcoming');
  const [itemState, setItemState] = useState<Record<string, ItemState>>(
    Object.fromEntries(
      SCHEDULE.map(item => [item.id, { expanded: false, notes: '', partsUsed: '', completed: false }])
    )
  );

  const logout = () => { setUser(null); navigate('/'); };

  const toggle = (id: string) =>
    setItemState(prev => ({ ...prev, [id]: { ...prev[id], expanded: !prev[id].expanded } }));

  const update = (id: string, field: 'notes' | 'partsUsed', value: string) =>
    setItemState(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const markDone = (id: string) =>
    setItemState(prev => ({ ...prev, [id]: { ...prev[id], completed: true, expanded: false } }));

  const visibleItems = SCHEDULE.filter(item =>
    tab === 'completed' ? itemState[item.id].completed : !itemState[item.id].completed
  );

  const completedCount = SCHEDULE.filter(item => itemState[item.id].completed).length;

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
                Maintenance Technician · {staffMember.license} · {staffMember.yearsExp} yrs exp.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-white/50 hidden sm:block">
              Shift: 07:00–19:00 · Bay 12 · Hangar 3
            </div>
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
            { label: 'Total Jobs',     value: SCHEDULE.length,                                    color: 'text-[#0A1F44]',    bg: 'bg-[#EFF6FF]',  icon: ClipboardList },
            { label: 'Completed',      value: completedCount,                                     color: 'text-emerald-600',  bg: 'bg-emerald-50', icon: CheckCircle2 },
            { label: 'Remaining',      value: SCHEDULE.length - completedCount,                   color: 'text-amber-600',    bg: 'bg-amber-50',   icon: Clock },
            { label: 'Emergency Jobs', value: SCHEDULE.filter(i => i.type === 'emergency').length, color: 'text-red-600',     bg: 'bg-red-50',     icon: AlertTriangle },
          ].map(({ label, value, color, bg, icon: Icon }) => (
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

          {/* ── Left 2/3: Maintenance Schedule ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tab bar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                {([['upcoming', 'Upcoming'], ['completed', 'Completed']] as const).map(([value, label]) => (
                  <button key={value} onClick={() => setTab(value)}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                      tab === value ? 'bg-[#0A1F44] text-white font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {label} {value === 'completed' && completedCount > 0 && (
                      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${tab === 'completed' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}`}>
                        {completedCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-400">{visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}</div>
            </div>

            {/* Maintenance items */}
            {visibleItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <div className="text-gray-400 text-sm">No {tab} maintenance jobs</div>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleItems.map(item => {
                  const typeCfg = TYPE_CONFIG[item.type];
                  const state = itemState[item.id];
                  return (
                    <div key={item.id}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 ${
                        state.completed ? 'border-emerald-400 opacity-80' :
                        item.type === 'emergency' ? 'border-red-400' :
                        item.type === 'inspection' ? 'border-amber-400' :
                        'border-[#2E8FD8]'
                      }`}>

                      {/* Card header — always visible */}
                      <button
                        onClick={() => toggle(item.id)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors">

                        {/* Priority dot */}
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${PRIORITY_DOT[item.priority]}`} />

                        {/* Aircraft + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#0A1F44] text-sm">{item.aircraft}</span>
                            <span className="text-gray-400 text-xs">·</span>
                            <span className="text-gray-500 text-xs">{item.model}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.text}`}>
                              {typeCfg.label}
                            </span>
                            {state.completed && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Done</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate">{item.description}</div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.scheduledDate}</span>
                            <span>Est. {item.estimatedHours}h</span>
                            <span className="font-mono">{item.id}</span>
                          </div>
                        </div>

                        {/* Expand chevron */}
                        {state.expanded
                          ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                      </button>

                      {/* Expanded detail panel */}
                      {state.expanded && (
                        <div className="px-5 pb-5 border-t border-gray-50">

                          {/* Type + description */}
                          <div className={`mt-4 p-3.5 rounded-xl border ${typeCfg.bg} ${typeCfg.border} mb-4`}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${typeCfg.dot}`} />
                              <span className={`text-xs font-bold uppercase tracking-wide ${typeCfg.text}`}>
                                {typeCfg.label} Maintenance
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{item.description}</p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {/* Technician Notes */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                <Wrench className="w-3.5 h-3.5 text-[#2E8FD8]" />
                                Technician Notes
                              </label>
                              {state.completed ? (
                                <div className="bg-[#F4F7FB] rounded-xl p-3 text-xs text-gray-600 min-h-[80px] leading-relaxed">
                                  {state.notes || <span className="text-gray-400 italic">No notes recorded.</span>}
                                </div>
                              ) : (
                                <textarea
                                  value={state.notes}
                                  onChange={e => update(item.id, 'notes', e.target.value)}
                                  rows={4}
                                  placeholder="Describe work performed, findings, observations, and any deviations from standard procedure..."
                                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent placeholder-gray-400 leading-relaxed"
                                />
                              )}
                            </div>

                            {/* Parts Used */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-[#2E8FD8]" />
                                Parts Used
                              </label>
                              {state.completed ? (
                                <div className="bg-[#F4F7FB] rounded-xl p-3 text-xs text-gray-600 min-h-[80px] font-mono leading-relaxed">
                                  {state.partsUsed || <span className="text-gray-400 italic font-sans">No parts recorded.</span>}
                                </div>
                              ) : (
                                <textarea
                                  value={state.partsUsed}
                                  onChange={e => update(item.id, 'partsUsed', e.target.value)}
                                  rows={4}
                                  placeholder="e.g.&#10;FMS Unit P/N 822-1248-001 × 1&#10;O-ring Kit P/N 2710-00-892 × 2&#10;Hydraulic fluid MIL-PRF-5606 × 4L"
                                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent placeholder-gray-400 font-mono leading-relaxed"
                                />
                              )}
                            </div>
                          </div>

                          {/* Action row */}
                          {!state.completed && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="text-xs text-gray-400">
                                Supervisor sign-off required before submission
                              </div>
                              <button
                                onClick={() => markDone(item.id)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5 py-2 rounded-xl transition-colors font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Complete
                              </button>
                            </div>
                          )}

                          {state.completed && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-4 h-4" />
                              Maintenance completed and logged
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right 1/3 ── */}
          <div className="space-y-4">

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3 flex items-center gap-2 text-base">
                <ShieldCheck className="w-4 h-4 text-[#2E8FD8]" /> Certifications
              </h4>
              <div className="space-y-2.5">
                {CERTIFICATIONS.map(({ label, expiry, daysLeft, warn }) => (
                  <div key={label} className={`p-2.5 rounded-xl border ${warn ? 'bg-amber-50 border-amber-100' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${daysLeft < 90 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className="text-xs font-semibold text-[#0A1F44]">{label}</span>
                      </div>
                      <span className={`text-xs font-bold ${daysLeft < 90 ? 'text-amber-600' : 'text-emerald-600'}`}>{daysLeft}d</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 ml-4">Exp. {expiry}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="text-[#0A1F44] mb-3">Shift Info</h4>
              <div className="space-y-2">
                {[
                  { label: 'Today',       value: '07:00 – 19:00', bold: true },
                  { label: 'Type',        value: 'Day Shift' },
                  { label: 'OT',          value: 'Approved (+8h)' },
                  { label: 'Supervisor',  value: 'Eng. Linda Wu' },
                  { label: 'Bay',         value: 'Hangar 3 · Bay 12' },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{label}</span>
                    <span className={`text-[#0A1F44] ${bold ? 'font-bold' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety alert */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-700">Safety Reminder</h4>
              </div>
              <div className="space-y-1 text-xs text-amber-700">
                <div>• FOD walk required before engine start</div>
                <div>• PPE mandatory in all hangar areas</div>
                <div>• Toolbox audit: Fri Jun 7, 17:00</div>
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
