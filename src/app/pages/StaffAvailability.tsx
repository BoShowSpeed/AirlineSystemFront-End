import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Info, Plane, Pencil, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { DayAvailabilityStatus, DayAvailability } from '../types';

const STATUS_CONFIG: Record<DayAvailabilityStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  available:   { label: 'Available',   bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  unavailable: { label: 'Unavailable', bg: 'bg-red-100',     text: 'text-red-700',     border: 'border-red-300',     dot: 'bg-red-500' },
  'on-leave':  { label: 'On Leave',    bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-300',    dot: 'bg-gray-400' },
  training:    { label: 'Training',    bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-300',   dot: 'bg-amber-500' },
  flight:      { label: 'Flight',      bg: 'bg-blue-100',    text: 'text-[#2E8FD8]',   border: 'border-blue-300',    dot: 'bg-[#2E8FD8]' },
};

const CYCLE_ORDER: DayAvailabilityStatus[] = ['available', 'unavailable', 'on-leave', 'training'];

const DAYS_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert to Mon-based: Sun(0)→6, Mon(1)→0, etc.
  const startOffset = (firstDay + 6) % 7;
  return { daysInMonth, startOffset };
}

function padDate(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${padDate(month + 1)}-${padDate(day)}`;
}

export default function StaffAvailability() {
  const { user, staffAvailability, setStaffDayAvailability } = useApp();
  const navigate = useNavigate();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // June = 5 (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [saved, setSaved] = useState(false);

  const staffId = user?.id ?? 's1'; // use logged-in staff's id; fallback for demo
  const myAvailability = staffAvailability[staffId] ?? {};

  const { daysInMonth, startOffset } = getDaysInMonth(year, month);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };

  const cycleDay = (day: number) => {
    const dateStr = toDateStr(year, month, day);
    const existing = myAvailability[dateStr];
    if (existing?.status === 'flight') return; // can't edit flight days
    const currentStatus = existing?.status;
    const currentIdx = currentStatus ? CYCLE_ORDER.indexOf(currentStatus) : -1;
    const nextStatus = CYCLE_ORDER[(currentIdx + 1) % CYCLE_ORDER.length];
    setStaffDayAvailability(staffId, { date: dateStr, status: nextStatus, note: existing?.note });
    setSelectedDay(day);
    setNoteInput(existing?.note ?? '');
    setSaved(false);
  };

  const saveNote = () => {
    if (selectedDay === null) return;
    const dateStr = toDateStr(year, month, selectedDay);
    const existing = myAvailability[dateStr];
    if (!existing) return;
    setStaffDayAvailability(staffId, { ...existing, note: noteInput });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearDay = (day: number) => {
    const dateStr = toDateStr(year, month, day);
    const existing = myAvailability[dateStr];
    if (!existing || existing.status === 'flight') return;
    setStaffDayAvailability(staffId, { date: dateStr, status: 'available' });
    if (selectedDay === day) setSelectedDay(null);
    setSaved(false);
  };

  const selectedEntry = selectedDay !== null ? myAvailability[toDateStr(year, month, selectedDay)] : null;

  // Count statuses for the month
  const counts = Object.values(myAvailability)
    .filter(e => e.date.startsWith(`${year}-${padDate(month + 1)}`))
    .reduce((acc, e) => { acc[e.status] = (acc[e.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/staff')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0A1F44] mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Staff Portal
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <h2 className="text-[#0A1F44]">My Availability</h2>
            <p className="text-sm text-gray-500 mt-0.5">Set your availability so the admin team can assign flights appropriately.</p>
          </div>
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl px-4 py-2.5 flex items-start gap-2 max-w-xs">
            <Info className="w-4 h-4 text-[#2E8FD8] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">Click a day to cycle its status. Flight days cannot be edited.</p>
          </div>
        </div>

        {/* Monthly summary */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {CYCLE_ORDER.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className={`rounded-xl p-3 border ${cfg.border} ${cfg.bg}`}>
                <div className={`text-xl font-bold ${cfg.text}`}>{counts[s] ?? 0}</div>
                <div className={`text-xs ${cfg.text} opacity-80 mt-0.5`}>{cfg.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Calendar */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="font-semibold text-[#0A1F44]">{MONTH_NAMES[month]} {year}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              {/* Day labels */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS_HEADER.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Offset cells */}
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`off-${i}`} />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = toDateStr(year, month, day);
                  const entry = myAvailability[dateStr];
                  const isToday = dateStr === todayStr;
                  const isSelected = selectedDay === day;
                  const isFlight = entry?.status === 'flight';
                  const cfg = entry ? STATUS_CONFIG[entry.status] : null;

                  return (
                    <button
                      key={day}
                      onClick={() => cycleDay(day)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all group
                        ${isFlight ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                        ${isSelected ? 'ring-2 ring-[#0A1F44] ring-offset-1' : ''}
                        ${cfg ? `${cfg.bg} ${cfg.text}` : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
                        ${isToday && !cfg ? 'ring-2 ring-[#2E8FD8] bg-[#EFF6FF] text-[#2E8FD8]' : ''}
                      `}>
                      <span className="font-semibold text-xs">{day}</span>
                      {isFlight && <Plane className="w-3 h-3 mt-0.5 opacity-70" />}
                      {entry && !isFlight && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${cfg?.dot}`} />
                      )}
                      {/* Clear button on hover */}
                      {entry && !isFlight && (
                        <button
                          onClick={e => { e.stopPropagation(); clearDay(day); }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 text-white rounded-full items-center justify-center hidden group-hover:flex">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="px-4 pb-4 flex flex-wrap gap-3">
              {(Object.entries(STATUS_CONFIG) as [DayAvailabilityStatus, typeof STATUS_CONFIG[DayAvailabilityStatus]][]).map(([status, cfg]) => (
                <div key={status} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Side panel: selected day details */}
          <div className="space-y-4">
            {selectedDay !== null && selectedEntry ? (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#0A1F44]">
                    {MONTH_NAMES[month]} {selectedDay}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[selectedEntry.status].bg} ${STATUS_CONFIG[selectedEntry.status].text}`}>
                    {STATUS_CONFIG[selectedEntry.status].label}
                  </span>
                </div>

                {selectedEntry.status === 'flight' ? (
                  <div className="bg-[#EFF6FF] rounded-xl p-3 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#2E8FD8] shrink-0" />
                    <p className="text-xs text-gray-600">{selectedEntry.note ?? 'Flight assignment'}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        <Pencil className="w-3.5 h-3.5 inline mr-1" />Note (optional)
                      </label>
                      <textarea
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] resize-none h-20"
                        placeholder="e.g. Medical appointment, family event..."
                      />
                    </div>
                    <button onClick={saveNote}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${
                        saved ? 'bg-emerald-500 text-white' : 'bg-[#0A1F44] hover:bg-[#2E8FD8] text-white'
                      }`}>
                      {saved
                        ? <><span>✓</span> Saved</>
                        : <><Save className="w-3.5 h-3.5" /> Save Note</>
                      }
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">Click the day again to change status</p>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-400">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm">Click a day to set status or add a note</p>
              </div>
            )}

            {/* Quick tips */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h4 className="text-xs font-semibold text-[#0A1F44] mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex gap-2"><span className="text-emerald-500 shrink-0">→</span>Click a blank day to mark it <strong>Available</strong></li>
                <li className="flex gap-2"><span className="text-red-400 shrink-0">→</span>Click again to cycle to <strong>Unavailable</strong></li>
                <li className="flex gap-2"><span className="text-gray-400 shrink-0">→</span>Keep cycling for <strong>On Leave</strong> or <strong>Training</strong></li>
                <li className="flex gap-2"><span className="text-[#2E8FD8] shrink-0">✈</span><strong>Flight days</strong> are set by admin and can't be changed</li>
                <li className="flex gap-2"><span className="text-gray-400 shrink-0">✕</span>Hover a day and click × to <strong>clear</strong> its status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
