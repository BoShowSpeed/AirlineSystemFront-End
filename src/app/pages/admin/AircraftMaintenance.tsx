import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Shield, ChevronDown, ChevronUp, X, Wrench, AlertTriangle, Plus, CheckCircle2, Plane, Pencil } from 'lucide-react';
import { MOCK_AIRCRAFT } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import type { Aircraft, AircraftStatus } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  available:   'border-emerald-200 bg-emerald-50',
  assigned:    'border-blue-200   bg-blue-50',
  maintenance: 'border-amber-200  bg-amber-50',
  retired:     'border-gray-200   bg-gray-50',
};

const STATUS_ICON_BG: Record<string, string> = {
  available:   'bg-emerald-100',
  assigned:    'bg-blue-100',
  maintenance: 'bg-amber-100',
  retired:     'bg-gray-100',
};

const STATUS_ICON_COLOR: Record<string, string> = {
  available:   'text-emerald-600',
  assigned:    'text-blue-600',
  maintenance: 'text-amber-600',
  retired:     'text-gray-500',
};

const LOG_STATUS_COLORS = {
  completed:    'bg-emerald-100 text-emerald-700',
  'in-progress':'bg-amber-100 text-amber-700',
  scheduled:    'bg-blue-100 text-blue-700',
};

const AIRCRAFT_STATUS_OPTIONS: { value: AircraftStatus; label: string }[] = [
  { value: 'available',   label: 'Available' },
  { value: 'assigned',    label: 'Assigned' },
  { value: 'maintenance', label: 'In Maintenance' },
  { value: 'retired',     label: 'Retired' },
];

interface AddAircraftForm {
  registration: string;
  model: string;
  capacity: string;
  manufacturer: string;
  flightHours: string;
  status: AircraftStatus;
}

const EMPTY_FORM: AddAircraftForm = {
  registration: '',
  model: '',
  capacity: '',
  manufacturer: '',
  flightHours: '0',
  status: 'available',
};

const FIELD_CLASS = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] text-gray-800 placeholder:text-gray-400';

export default function AircraftMaintenance() {
  const [aircraft, setAircraft] = useState(MOCK_AIRCRAFT);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showMaintModal, setShowMaintModal] = useState<Aircraft | null>(null);
  const [editTarget, setEditTarget] = useState<Aircraft | null>(null);
  const [editForm, setEditForm] = useState<AddAircraftForm>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof AddAircraftForm, string>>>({});
  const [activeTab, setActiveTab] = useState<'fleet' | 'add'>('fleet');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [addForm, setAddForm] = useState<AddAircraftForm>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<Partial<Record<keyof AddAircraftForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [maintForm, setMaintForm] = useState({
    type: 'A-Check', startDate: '', endDate: '', technician: '', notes: '',
  });

  const toggleExpand = (id: string) => setExpanded(p => p === id ? null : id);

  const openEdit = (ac: Aircraft) => {
    setEditTarget(ac);
    setEditForm({
      registration: ac.registration,
      model: ac.model,
      capacity: String(ac.capacity),
      manufacturer: ac.manufacturer,
      flightHours: String((ac as any).flightHours ?? 0),
      status: ac.status,
    });
    setEditErrors({});
  };

  const validateEdit = (): boolean => {
    const errs: Partial<Record<keyof AddAircraftForm, string>> = {};
    if (!editForm.registration.trim()) errs.registration = 'Registration number is required.';
    if (!editForm.model.trim()) errs.model = 'Model is required.';
    const cap = parseInt(editForm.capacity, 10);
    if (!editForm.capacity || isNaN(cap) || cap < 1) errs.capacity = 'Enter a valid capacity (≥ 1).';
    const fh = parseInt(editForm.flightHours, 10);
    if (editForm.flightHours !== '' && (isNaN(fh) || fh < 0)) errs.flightHours = 'Flight hours must be 0 or more.';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveEdit = () => {
    if (!validateEdit() || !editTarget) return;
    setAircraft(prev => prev.map(a => a.id !== editTarget.id ? a : {
      ...a,
      registration: editForm.registration.trim(),
      model: editForm.model.trim(),
      capacity: parseInt(editForm.capacity, 10),
      manufacturer: editForm.manufacturer.trim(),
      status: editForm.status,
    }));
    setEditTarget(null);
  };

  const filtered = aircraft.filter(a => statusFilter === 'All' || a.status === statusFilter.toLowerCase());

  const validate = (): boolean => {
    const errs: Partial<Record<keyof AddAircraftForm, string>> = {};
    if (!addForm.registration.trim()) errs.registration = 'Registration number is required.';
    if (!addForm.model.trim()) errs.model = 'Model is required.';
    const cap = parseInt(addForm.capacity, 10);
    if (!addForm.capacity || isNaN(cap) || cap < 1) errs.capacity = 'Enter a valid capacity (≥ 1).';
    const fh = parseInt(addForm.flightHours, 10);
    if (addForm.flightHours !== '' && (isNaN(fh) || fh < 0)) errs.flightHours = 'Flight hours must be 0 or more.';
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAddForm(EMPTY_FORM);
    setAddErrors({});
    setSubmitted(false);
  };

  const field = (key: keyof AddAircraftForm) => ({
    value: addForm[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAddForm(p => ({ ...p, [key]: e.target.value }));
      setAddErrors(p => { const n = { ...p }; delete n[key]; return n; });
    },
  });

  return (
    <div className="p-6 min-h-screen">
      {/* Page header + tabs */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[#0A1F44]">Aircraft & Maintenance</h2>
          <p className="text-sm text-gray-500">{aircraft.length} aircraft in fleet</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
          {([['fleet', 'Fleet Overview'], ['add', 'Add Aircraft']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-[#0A1F44] text-white shadow-sm' : 'text-gray-600 hover:text-[#0A1F44]'
              }`}>
              {tab === 'add' && <Plus className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FLEET TAB ── */}
      {activeTab === 'fleet' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Available',      count: aircraft.filter(a => a.status === 'available').length,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Assigned',       count: aircraft.filter(a => a.status === 'assigned').length,    color: 'text-blue-600',    bg: 'bg-blue-50'    },
              { label: 'In Maintenance', count: aircraft.filter(a => a.status === 'maintenance').length, color: 'text-amber-600',   bg: 'bg-amber-50'   },
              { label: 'Retired',        count: aircraft.filter(a => a.status === 'retired').length,     color: 'text-gray-500',    bg: 'bg-gray-100'   },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 text-center cursor-pointer`}
                onClick={() => setStatusFilter(label === 'In Maintenance' ? 'maintenance' : label === 'In Maintenance' ? 'maintenance' : label)}>
                <div className={`text-2xl font-bold ${color}`}>{count}</div>
                <div className="text-xs text-gray-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex gap-2 flex-wrap mb-4">
            {['All', 'Available', 'Assigned', 'Maintenance', 'Retired'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f === 'Maintenance' ? 'maintenance' : f)}
                className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                  statusFilter === (f === 'Maintenance' ? 'maintenance' : f === 'All' ? 'All' : f.toLowerCase())
                    ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-[#0A1F44] hover:text-white hover:border-[#0A1F44]'
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Aircraft cards */}
          <div className="space-y-3">
            {filtered.map(ac => (
              <div key={ac.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${STATUS_COLORS[ac.status] ?? 'border-gray-200'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${STATUS_ICON_BG[ac.status] ?? 'bg-gray-100'}`}>
                        <Shield className={`w-6 h-6 ${STATUS_ICON_COLOR[ac.status] ?? 'text-gray-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-[#0A1F44]">{ac.registration}</h3>
                          <StatusBadge status={ac.status} />
                        </div>
                        <div className="text-sm text-gray-500">{ac.model}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{ac.manufacturer} · {ac.age} years old</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#0A1F44]">{ac.capacity}</div>
                        <div className="text-xs text-gray-400">Capacity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">{ac.lastMaintenance}</div>
                        <div className="text-xs text-gray-400">Last Check</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-medium ${new Date(ac.nextMaintenance) < new Date('2026-08-01') ? 'text-amber-600' : 'text-gray-600'}`}>
                          {ac.nextMaintenance}
                        </div>
                        <div className="text-xs text-gray-400">Next Check</div>
                        {new Date(ac.nextMaintenance) < new Date('2026-08-01') && (
                          <AlertTriangle className="w-3 h-3 text-amber-500 mx-auto mt-0.5" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(ac)}
                          className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 bg-white px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setShowMaintModal(ac)}
                          className="flex items-center gap-1.5 text-sm bg-[#0A1F44] text-white px-3 py-2 rounded-xl hover:bg-[#2E8FD8] transition-colors">
                          <Wrench className="w-3.5 h-3.5" /> Schedule
                        </button>
                        <button onClick={() => toggleExpand(ac.id)}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                          {expanded === ac.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {expanded === ac.id && (
                  <div className="border-t border-gray-100 p-5 bg-[#FAFBFC]">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-[#0A1F44] mb-3">Seat Configuration</h4>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="space-y-2">
                            {[
                              { class: 'First Class', seats: 12, color: 'bg-amber-400' },
                              { class: 'Business',    seats: 42, color: 'bg-[#2E8FD8]' },
                              { class: 'Economy',     seats: ac.capacity - 54, color: 'bg-gray-300' },
                            ].map(({ class: cls, seats, color }) => (
                              <div key={cls} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-sm shrink-0 ${color}`} />
                                <div className="text-xs text-gray-600 w-20">{cls}</div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className={`h-full ${color} rounded-full`} style={{ width: `${(seats / ac.capacity) * 100}%` }} />
                                </div>
                                <div className="text-xs text-gray-500 w-12 text-right">{seats} seats</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#0A1F44] mb-3">Maintenance Log</h4>
                        <div className="space-y-2">
                          {ac.maintenanceLogs.map(log => (
                            <div key={log.id} className="bg-white rounded-xl p-3 border border-gray-100">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-medium text-[#0A1F44]">{log.type}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${LOG_STATUS_COLORS[log.status as keyof typeof LOG_STATUS_COLORS] ?? ''}`}>
                                      {log.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">{log.date} · {log.technician}</div>
                                  <div className="text-xs text-gray-400 mt-1 truncate">{log.notes}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Plane className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No aircraft match this filter.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ADD AIRCRAFT TAB ── */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#0A1F44] mb-1">Aircraft Registered</h3>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-[#0A1F44]">{addForm.registration}</span> · {addForm.model}
              </p>
              <p className="text-xs text-gray-400 mb-6">
                {addForm.manufacturer && `${addForm.manufacturer} · `}
                Capacity {addForm.capacity} · {parseInt(addForm.flightHours || '0', 10).toLocaleString()} flight hours
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Add Another
                </button>
                <button onClick={() => setActiveTab('fleet')}
                  className="px-5 py-2.5 rounded-xl bg-[#0A1F44] text-white text-sm hover:bg-[#2E8FD8] transition-colors">
                  View Fleet
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
                  <div className="w-9 h-9 bg-[#0A1F44]/10 rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-[#0A1F44]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A1F44]">New Aircraft</h3>
                    <p className="text-xs text-gray-400">Register an aircraft to the fleet</p>
                  </div>
                </div>

                {/* Registration & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field('registration')}
                      className={`${FIELD_CLASS} ${addErrors.registration ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      placeholder="N-AV006"
                      spellCheck={false}
                    />
                    {addErrors.registration && <p className="text-xs text-red-500 mt-1">{addErrors.registration}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field('model')}
                      className={`${FIELD_CLASS} ${addErrors.model ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      placeholder="Boeing 787-9"
                    />
                    {addErrors.model && <p className="text-xs text-red-500 mt-1">{addErrors.model}</p>}
                  </div>
                </div>

                {/* Manufacturer & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Manufacturer</label>
                    <input
                      {...field('manufacturer')}
                      className={FIELD_CLASS}
                      placeholder="Boeing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Passenger Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...field('capacity')}
                      className={`${FIELD_CLASS} ${addErrors.capacity ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      placeholder="296"
                    />
                    {addErrors.capacity && <p className="text-xs text-red-500 mt-1">{addErrors.capacity}</p>}
                  </div>
                </div>

                {/* Flight Hours & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Flight Hours</label>
                    <input
                      type="number"
                      min={0}
                      {...field('flightHours')}
                      className={`${FIELD_CLASS} ${addErrors.flightHours ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      placeholder="0"
                    />
                    {addErrors.flightHours && <p className="text-xs text-red-500 mt-1">{addErrors.flightHours}</p>}
                    <p className="text-xs text-gray-400 mt-1">Total accumulated flight hours</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <div className="relative">
                      <select
                        value={addForm.status}
                        onChange={e => setAddForm(p => ({ ...p, status: e.target.value as AircraftStatus }))}
                        className={`${FIELD_CLASS} appearance-none pr-9`}>
                        {AIRCRAFT_STATUS_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Review card */}
                {(addForm.registration || addForm.model) && (
                  <div className="bg-[#F4F7FB] rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Preview</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-[#0A1F44]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0A1F44] text-sm">
                          {addForm.registration || '—'} &nbsp;·&nbsp; {addForm.model || '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {addForm.manufacturer || 'Unknown manufacturer'} &nbsp;·&nbsp;
                          Cap. {addForm.capacity || '?'} &nbsp;·&nbsp;
                          {parseInt(addForm.flightHours || '0', 10).toLocaleString()} hrs &nbsp;·&nbsp;
                          <span className="capitalize">{addForm.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={handleReset}
                    className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    Clear
                  </button>
                  <button type="submit"
                    className="flex-1 bg-[#0A1F44] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#2E8FD8] transition-colors">
                    Register Aircraft
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Edit aircraft modal */}
      <Dialog.Root open={!!editTarget} onOpenChange={v => !v && setEditTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-[#0A1F44]">Edit Aircraft</Dialog.Title>
                  {editTarget && <p className="text-xs text-gray-400 mt-0.5">{editTarget.registration} · {editTarget.model}</p>}
                </div>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-4">
                {/* Registration & Model */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Registration <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={editForm.registration}
                      onChange={e => { setEditForm(p => ({ ...p, registration: e.target.value })); setEditErrors(p => { const n = { ...p }; delete n.registration; return n; }); }}
                      className={`${FIELD_CLASS} ${editErrors.registration ? 'border-red-400' : ''}`}
                    />
                    {editErrors.registration && <p className="text-xs text-red-500 mt-1">{editErrors.registration}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={editForm.model}
                      onChange={e => { setEditForm(p => ({ ...p, model: e.target.value })); setEditErrors(p => { const n = { ...p }; delete n.model; return n; }); }}
                      className={`${FIELD_CLASS} ${editErrors.model ? 'border-red-400' : ''}`}
                    />
                    {editErrors.model && <p className="text-xs text-red-500 mt-1">{editErrors.model}</p>}
                  </div>
                </div>

                {/* Manufacturer & Capacity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Manufacturer</label>
                    <input
                      value={editForm.manufacturer}
                      onChange={e => setEditForm(p => ({ ...p, manufacturer: e.target.value }))}
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" min={1}
                      value={editForm.capacity}
                      onChange={e => { setEditForm(p => ({ ...p, capacity: e.target.value })); setEditErrors(p => { const n = { ...p }; delete n.capacity; return n; }); }}
                      className={`${FIELD_CLASS} ${editErrors.capacity ? 'border-red-400' : ''}`}
                    />
                    {editErrors.capacity && <p className="text-xs text-red-500 mt-1">{editErrors.capacity}</p>}
                  </div>
                </div>

                {/* Flight Hours & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Flight Hours</label>
                    <input
                      type="number" min={0}
                      value={editForm.flightHours}
                      onChange={e => { setEditForm(p => ({ ...p, flightHours: e.target.value })); setEditErrors(p => { const n = { ...p }; delete n.flightHours; return n; }); }}
                      className={`${FIELD_CLASS} ${editErrors.flightHours ? 'border-red-400' : ''}`}
                    />
                    {editErrors.flightHours && <p className="text-xs text-red-500 mt-1">{editErrors.flightHours}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <div className="relative">
                      <select
                        value={editForm.status}
                        onChange={e => setEditForm(p => ({ ...p, status: e.target.value as AircraftStatus }))}
                        className={`${FIELD_CLASS} appearance-none pr-9`}>
                        {AIRCRAFT_STATUS_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Dialog.Close asChild>
                    <button className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button onClick={saveEdit}
                    className="flex-1 bg-[#0A1F44] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#2E8FD8] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Schedule maintenance modal */}
      <Dialog.Root open={!!showMaintModal} onOpenChange={v => !v && setShowMaintModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <Dialog.Title className="text-lg font-semibold text-[#0A1F44]">Schedule Maintenance</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>
              {showMaintModal && (
                <p className="text-sm text-gray-500 mb-4">
                  Aircraft: <span className="font-medium text-[#0A1F44]">{showMaintModal.registration} — {showMaintModal.model}</span>
                </p>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Maintenance Type</label>
                  <select value={maintForm.type} onChange={e => setMaintForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8]">
                    {['A-Check', 'B-Check', 'C-Check', 'D-Check', 'Engine Inspection', 'Avionics Repair', 'Emergency Repair'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Start Date</label>
                    <input type="date" value={maintForm.startDate}
                      onChange={e => setMaintForm(p => ({ ...p, startDate: e.target.value }))}
                      className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8]" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">End Date</label>
                    <input type="date" value={maintForm.endDate}
                      onChange={e => setMaintForm(p => ({ ...p, endDate: e.target.value }))}
                      className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8]" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Lead Technician</label>
                  <input value={maintForm.technician}
                    onChange={e => setMaintForm(p => ({ ...p, technician: e.target.value }))}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8]"
                    placeholder="Tech. Robert Hayes" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
                  <textarea value={maintForm.notes}
                    onChange={e => setMaintForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] resize-none h-24"
                    placeholder="Describe the maintenance work..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Dialog.Close asChild>
                    <button className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50">Cancel</button>
                  </Dialog.Close>
                  <button onClick={() => setShowMaintModal(null)}
                    className="flex-1 bg-[#0A1F44] text-white rounded-xl py-2.5 text-sm hover:bg-[#2E8FD8] transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
