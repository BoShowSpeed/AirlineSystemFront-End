import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Edit3, X, ArrowUpDown, Search, Users } from 'lucide-react';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import type { Flight } from '../../types';

type SortKey = 'number' | 'departureTime' | 'gate' | 'status';

export default function FlightManagement() {
  const [flights, setFlights] = useState([...MOCK_FLIGHTS]);
  const [sortKey, setSortKey] = useState<SortKey>('departureTime');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  // Schedule form state
  const [form, setForm] = useState({
    number: '', origin: '', destination: '', departureTime: '', arrivalTime: '',
    date: '2026-06-20', gate: '', aircraft: 'Boeing 777-300ER', class: 'economy',
  });

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = flights
    .filter(f => [f.number, f.originCode, f.destinationCode, f.gate].some(v => v.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const v = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === 'asc' ? v : -v;
    });

  const cancelFlight = (id: string) => {
    setFlights(prev => prev.map(f => f.id === id ? { ...f, status: 'cancelled' } : f));
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlight: Flight = {
      id: String(Date.now()),
      number: form.number,
      origin: form.origin, originCode: form.origin.slice(0, 3).toUpperCase(),
      destination: form.destination, destinationCode: form.destination.slice(0, 3).toUpperCase(),
      departureTime: form.departureTime, arrivalTime: form.arrivalTime,
      date: form.date, duration: '8h 00m',
      class: form.class as Flight['class'],
      price: 599, status: 'scheduled',
      gate: form.gate, aircraft: form.aircraft, availableSeats: 180,
    };
    setFlights(prev => [newFlight, ...prev]);
    setShowSchedule(false);
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => sort(k)} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#0A1F44] transition-colors group">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === k ? 'text-[#2E8FD8]' : 'text-gray-300 group-hover:text-gray-400'}`} />
    </button>
  );

  const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8]';

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[#0A1F44]">Flight Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{flights.length} flights scheduled</p>
        </div>
        <button onClick={() => setShowSchedule(true)}
          className="flex items-center gap-2 bg-[#0A1F44] hover:bg-[#2E8FD8] text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> Schedule Flight
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] shadow-sm"
          placeholder="Search flights by number, route, or gate..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F7FB] border-b border-gray-100">
                <th className="text-left px-4 py-3"><SortBtn k="number" label="Flight" /></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Route</th>
                <th className="text-left px-4 py-3"><SortBtn k="departureTime" label="Departure" /></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Arrival</th>
                <th className="text-left px-4 py-3"><SortBtn k="gate" label="Gate" /></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Aircraft</th>
                <th className="text-left px-4 py-3"><SortBtn k="status" label="Status" /></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className={`border-t border-gray-50 hover:bg-[#F4F7FB] transition-colors`}>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0A1F44]">{f.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.originCode} → {f.destinationCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.departureTime} · {f.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.arrivalTime}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#0A1F44]">{f.gate}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{f.aircraft}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowSchedule(true)}
                        className="text-xs text-[#2E8FD8] hover:underline flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      {f.status !== 'cancelled' && (
                        <button onClick={() => cancelFlight(f.id)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                      <button className="text-xs text-gray-500 hover:underline flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Crew
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule flight slide-over */}
      <Dialog.Root open={showSchedule} onOpenChange={setShowSchedule}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-semibold text-[#0A1F44]">Schedule New Flight</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Flight Number</label>
                  <input value={form.number} onChange={e => setForm(p => ({...p, number: e.target.value}))}
                    className={inputClass} placeholder="AV901" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Origin</label>
                    <input value={form.origin} onChange={e => setForm(p => ({...p, origin: e.target.value}))}
                      className={inputClass} placeholder="New York" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Destination</label>
                    <input value={form.destination} onChange={e => setForm(p => ({...p, destination: e.target.value}))}
                      className={inputClass} placeholder="London" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Departure</label>
                    <input type="time" value={form.departureTime} onChange={e => setForm(p => ({...p, departureTime: e.target.value}))}
                      className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Arrival</label>
                    <input type="time" value={form.arrivalTime} onChange={e => setForm(p => ({...p, arrivalTime: e.target.value}))}
                      className={inputClass} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
                      className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Gate</label>
                    <input value={form.gate} onChange={e => setForm(p => ({...p, gate: e.target.value}))}
                      className={inputClass} placeholder="A12" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Aircraft</label>
                  <select value={form.aircraft} onChange={e => setForm(p => ({...p, aircraft: e.target.value}))} className={inputClass}>
                    {['Boeing 777-300ER','Airbus A380','Boeing 787-9','Airbus A350-900','Boeing 737-800'].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Class Configuration</label>
                  <select value={form.class} onChange={e => setForm(p => ({...p, class: e.target.value}))} className={inputClass}>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowSchedule(false)}
                    className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 bg-[#0A1F44] text-white rounded-xl py-3 text-sm hover:bg-[#2E8FD8] transition-colors">
                    Schedule Flight
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
