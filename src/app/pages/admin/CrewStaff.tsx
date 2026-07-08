import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';
import { Search, X, Plus, Mail, Phone, Briefcase, Plane, Pencil, ChevronDown } from 'lucide-react';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { useApp } from '../../context/AppContext';
import type { StaffMember, DayAvailabilityStatus, StaffRole } from '../../types';
import { STAFF_ROLE_LABELS } from '../../types';

const AVAILABILITY_COLORS: Record<string, string> = {
  available:   'bg-emerald-500',
  unavailable: 'bg-red-500',
  'on-leave':  'bg-gray-400',
  training:    'bg-amber-500',
};

const DAY_STATUS_CONFIG: Record<DayAvailabilityStatus, { bg: string; text: string; short: string }> = {
  available:   { bg: 'bg-emerald-100', text: 'text-emerald-700', short: 'A' },
  unavailable: { bg: 'bg-red-100',     text: 'text-red-700',     short: 'U' },
  'on-leave':  { bg: 'bg-gray-100',    text: 'text-gray-500',    short: 'L' },
  training:    { bg: 'bg-amber-100',   text: 'text-amber-700',   short: 'T' },
  flight:      { bg: 'bg-blue-100',    text: 'text-[#2E8FD8]',   short: '✈' },
};

// June 2026 dates 1–30
const JUNE_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  return { day: d, dateStr: `2026-06-${String(d).padStart(2, '0')}` };
});
// Show a 2-week slice (Jun 2–15) for the overview grid
const OVERVIEW_DAYS = JUNE_DAYS.slice(1, 15); // days 2–15

interface EditForm {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  license: string;
  availability: StaffMember['availability'];
  yearsExp: string;
}

const AVAILABILITY_OPTIONS: { value: StaffMember['availability']; label: string }[] = [
  { value: 'available',   label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'on-leave',    label: 'On Leave' },
  { value: 'training',    label: 'Training' },
];

const ROLE_OPTIONS: { value: StaffRole; label: string }[] = Object.entries(STAFF_ROLE_LABELS).map(
  ([value, label]) => ({ value: value as StaffRole, label })
);

const INPUT = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] text-gray-800 placeholder:text-gray-400';
const INPUT_ERR = 'border-red-400 ring-1 ring-red-300';

export default function CrewStaff() {
  const { staffAvailability, staffMembers, updateStaffMember } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<StaffMember>(staffMembers[0]);
  const [search, setSearch] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [assignFlight, setAssignFlight] = useState('');
  const [tab, setTab] = useState<'directory' | 'availability'>('directory');
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof EditForm, string>>>({});

  const openEdit = (s: StaffMember) => {
    setEditForm({
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: s.role,
      license: s.license,
      availability: s.availability,
      yearsExp: String(s.yearsExp),
    });
    setEditErrors({});
    setShowEdit(true);
  };

  const validateEdit = (): boolean => {
    if (!editForm) return false;
    const errs: Partial<Record<keyof EditForm, string>> = {};
    if (!editForm.name.trim()) errs.name = 'Name is required.';
    if (!editForm.email.trim() || !editForm.email.includes('@')) errs.email = 'Valid email required.';
    if (!editForm.license.trim()) errs.license = 'License number is required.';
    const yrs = parseInt(editForm.yearsExp, 10);
    if (isNaN(yrs) || yrs < 0) errs.yearsExp = 'Enter a valid number of years.';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveEdit = () => {
    if (!validateEdit() || !editForm) return;
    const updated: StaffMember = {
      ...selected,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      role: editForm.role,
      license: editForm.license.trim(),
      availability: editForm.availability,
      yearsExp: parseInt(editForm.yearsExp, 10),
      initials: editForm.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    };
    updateStaffMember(updated);
    setSelected(updated);
    setShowEdit(false);
  };

  const ef = <K extends keyof EditForm>(key: K) => ({
    value: editForm?.[key] ?? '' as EditForm[K],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditForm(p => p ? { ...p, [key]: e.target.value } : p);
      setEditErrors(p => { const n = { ...p }; delete n[key]; return n; });
    },
  });

  const filtered = staffMembers.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) ||
      STAFF_ROLE_LABELS[s.role].toLowerCase().includes(q);
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[#0A1F44]">Crew & Staff</h2>
          <p className="text-sm text-gray-500">{staffMembers.length} crew members</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab switch */}
          <div className="flex gap-1 bg-[#F4F7FB] rounded-xl p-1">
            {(['directory', 'availability'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-all ${
                  tab === t ? 'bg-white text-[#0A1F44] shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/admin/crew/add')}
            className="flex items-center gap-2 bg-[#0A1F44] hover:bg-[#2E8FD8] text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {tab === 'directory' ? (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Staff list */}
          <div className="lg:col-span-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] shadow-sm"
                placeholder="Search crew..." />
            </div>
            <div className="space-y-2">
              {filtered.map(s => (
                <button key={s.id} onClick={() => setSelected(s)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all ${
                    selected.id === s.id ? 'bg-[#0A1F44] text-white shadow-sm' : 'bg-white hover:bg-[#F4F7FB] border border-gray-100'
                  }`}>
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      selected.id === s.id ? 'bg-[#2E8FD8] text-white' : 'bg-[#EFF6FF] text-[#0A1F44]'
                    }`}>
                      {s.initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${selected.id === s.id ? 'border-[#0A1F44]' : 'border-white'} ${AVAILABILITY_COLORS[s.availability] ?? 'bg-gray-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${selected.id === s.id ? 'text-white' : 'text-[#0A1F44]'}`}>{s.name}</div>
                    <div className={`text-xs ${selected.id === s.id ? 'text-white/60' : 'text-gray-500'}`}>{STAFF_ROLE_LABELS[s.role]}</div>
                  </div>
                  <StatusBadge status={s.availability} size="sm" showDot={false} />
                </button>
              ))}
            </div>
          </div>

          {/* Staff detail */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#2E8FD8] flex items-center justify-center text-xl font-bold">
                  {selected.initials}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg">{selected.name}</h3>
                  <p className="text-white/60 text-sm">{STAFF_ROLE_LABELS[selected.role]} · {selected.yearsExp} years exp.</p>
                  <div className="mt-2">
                    <StatusBadge status={selected.availability} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(selected)}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-white/20">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setShowAssign(true)}
                    className="bg-[#2E8FD8] hover:bg-[#1a75be] text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <Briefcase className="w-3.5 h-3.5" /> Assign to Flight
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Contact</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />{selected.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />{selected.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">License</div>
                  <div className="bg-[#F4F7FB] rounded-xl p-3">
                    <div className="text-sm font-mono text-[#0A1F44]">{selected.license}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Valid through Dec 2027</div>
                  </div>
                </div>
              </div>

              {/* Mini availability preview for selected staff */}
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">June Availability (Jun 2–15)</div>
                <div className="flex gap-1 flex-wrap">
                  {OVERVIEW_DAYS.map(({ day, dateStr }) => {
                    const entry = staffAvailability[selected.id]?.[dateStr];
                    const cfg = entry ? DAY_STATUS_CONFIG[entry.status] : null;
                    return (
                      <div key={day} title={entry ? `Jun ${day}: ${entry.status}${entry.note ? ' — ' + entry.note : ''}` : `Jun ${day}: Not set`}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-default transition-all ${
                          cfg ? `${cfg.bg} ${cfg.text}` : 'bg-gray-50 text-gray-400'
                        }`}>
                        {cfg ? cfg.short : day}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                  {(Object.entries(DAY_STATUS_CONFIG) as [DayAvailabilityStatus, typeof DAY_STATUS_CONFIG[DayAvailabilityStatus]][]).map(([s, c]) => (
                    <div key={s} className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${c.bg} ${c.text}`}>{c.short}</span>
                      <span>{s === 'on-leave' ? 'Leave' : s === 'flight' ? 'Flight' : s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">Current Assignments</div>
                {selected.assignments.length > 0 ? (
                  <div className="space-y-2">
                    {selected.assignments.map(a => {
                      const flight = MOCK_FLIGHTS.find(f => f.number === a);
                      return (
                        <div key={a} className="flex items-center gap-3 bg-[#F4F7FB] rounded-xl p-3">
                          <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-[#2E8FD8]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#0A1F44]">{a}</div>
                            {flight && <div className="text-xs text-gray-500">{flight.originCode} → {flight.destinationCode} · {flight.date} · {flight.departureTime}</div>}
                          </div>
                          {flight && <div className="ml-auto"><StatusBadge status={flight.status} size="sm" /></div>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#F4F7FB] rounded-xl p-4 text-center text-sm text-gray-400">No current assignments</div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">Assignment Timeline</div>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                  {['Jun 15 · AV101 JFK→LHR · 09:00', 'Jun 15 · AV102 JFK→LHR · 14:30', 'Jun 18 · AV203 JFK→CDG · 11:00'].map((item, i) => (
                    <div key={i} className="relative mb-3 pl-4">
                      <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full ${i === 0 ? 'bg-[#2E8FD8]' : 'bg-gray-300'}`} />
                      <div className={`text-sm ${i === 0 ? 'text-[#0A1F44] font-medium' : 'text-gray-500'}`}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Availability overview tab ── */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-[#0A1F44]">Crew Availability — June 2026 (Jun 2–15)</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time view of all staff availability as set in their portals</p>
            </div>
            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              {(Object.entries(DAY_STATUS_CONFIG) as [DayAvailabilityStatus, typeof DAY_STATUS_CONFIG[DayAvailabilityStatus]][]).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${c.bg} ${c.text}`}>{c.short}</div>
                  <span className="capitalize">{s === 'on-leave' ? 'On Leave' : s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F7FB]">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 min-w-[160px] sticky left-0 bg-[#F4F7FB] z-10">Staff</th>
                  {OVERVIEW_DAYS.map(({ day }) => (
                    <th key={day} className="text-center text-xs font-medium text-gray-500 px-1 py-3 min-w-[44px]">
                      <div>Jun</div>
                      <div className="text-[#0A1F44]">{day}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffMembers.map(s => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#0A1F44] text-xs font-bold flex items-center justify-center">
                            {s.initials}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${AVAILABILITY_COLORS[s.availability] ?? 'bg-gray-300'}`} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#0A1F44] whitespace-nowrap">{s.name}</div>
                          <div className="text-xs text-gray-400">{STAFF_ROLE_LABELS[s.role]}</div>
                        </div>
                      </div>
                    </td>
                    {OVERVIEW_DAYS.map(({ day, dateStr }) => {
                      const entry = staffAvailability[s.id]?.[dateStr];
                      const cfg = entry ? DAY_STATUS_CONFIG[entry.status] : null;
                      return (
                        <td key={day} className="px-1 py-3 text-center">
                          <div title={entry ? `${entry.status}${entry.note ? ': ' + entry.note : ''}` : 'Not set'}
                            className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-xs font-bold cursor-default ${
                              cfg ? `${cfg.bg} ${cfg.text}` : 'bg-gray-50 text-gray-300'
                            }`}>
                            {cfg ? (entry?.status === 'flight' ? <Plane className="w-3 h-3" /> : cfg.short) : '·'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 bg-[#F4F7FB]">
            <p className="text-xs text-gray-400">
              Staff update their availability in the <strong>Staff Portal → My Availability</strong>. Flight days (✈) are auto-set when assignments are made.
            </p>
          </div>
        </div>
      )}

      {/* Edit Staff modal */}
      <Dialog.Root open={showEdit} onOpenChange={v => !v && setShowEdit(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-[#0A1F44]">Edit Staff Member</Dialog.Title>
                  <p className="text-xs text-gray-400 mt-0.5">{selected.name}</p>
                </div>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>

              {editForm && (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input {...ef('name')} className={`${INPUT} ${editErrors.name ? INPUT_ERR : ''}`} placeholder="James Wilson" />
                    {editErrors.name && <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                      <input type="email" {...ef('email')} className={`${INPUT} ${editErrors.email ? INPUT_ERR : ''}`} placeholder="staff@avion.com" />
                      {editErrors.email && <p className="text-xs text-red-500 mt-1">{editErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input type="tel" {...ef('phone')} className={INPUT} placeholder="+1 555-0100" />
                    </div>
                  </div>

                  {/* Role & Availability */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                      <div className="relative">
                        <select {...ef('role')} className={`${INPUT} appearance-none pr-9`}>
                          {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label>
                      <div className="relative">
                        <select {...ef('availability')} className={`${INPUT} appearance-none pr-9`}>
                          {AVAILABILITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* License & Years Exp */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License No. <span className="text-red-500">*</span></label>
                      <input {...ef('license')} className={`${INPUT} font-mono ${editErrors.license ? INPUT_ERR : ''}`} placeholder="ATP-US-78234" spellCheck={false} />
                      {editErrors.license && <p className="text-xs text-red-500 mt-1">{editErrors.license}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Years Experience</label>
                      <input type="number" min={0} {...ef('yearsExp')} className={`${INPUT} ${editErrors.yearsExp ? INPUT_ERR : ''}`} />
                      {editErrors.yearsExp && <p className="text-xs text-red-500 mt-1">{editErrors.yearsExp}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Dialog.Close asChild>
                      <button className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">Cancel</button>
                    </Dialog.Close>
                    <button onClick={saveEdit}
                      className="flex-1 bg-[#0A1F44] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#2E8FD8] transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Assign to Flight modal */}
      <Dialog.Root open={showAssign} onOpenChange={setShowAssign}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <Dialog.Title className="text-lg font-semibold text-[#0A1F44]">Assign to Flight</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-sm text-gray-500 mb-4">Assigning <span className="font-medium text-[#0A1F44]">{selected?.name}</span> to a flight</p>
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                {MOCK_FLIGHTS.filter(f => f.status !== 'cancelled').map(f => (
                  <label key={f.id} className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer hover:bg-[#F4F7FB] transition-colors"
                    style={{ borderColor: assignFlight === f.id ? '#0A1F44' : '#e5e7eb' }}>
                    <input type="radio" name="flight" value={f.id} checked={assignFlight === f.id}
                      onChange={e => setAssignFlight(e.target.value)} className="accent-[#0A1F44]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#0A1F44]">{f.number} · {f.originCode} → {f.destinationCode}</div>
                      <div className="text-xs text-gray-500">{f.date} · {f.departureTime} · Gate {f.gate}</div>
                    </div>
                    <StatusBadge status={f.status} size="sm" />
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Dialog.Close asChild>
                  <button className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">Cancel</button>
                </Dialog.Close>
                <button onClick={() => setShowAssign(false)} disabled={!assignFlight}
                  className={`flex-1 rounded-xl py-2.5 text-sm ${assignFlight ? 'bg-[#0A1F44] text-white hover:bg-[#2E8FD8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`}>
                  Confirm Assignment
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
