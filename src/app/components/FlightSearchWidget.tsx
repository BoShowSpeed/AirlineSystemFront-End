import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowLeftRight, CalendarDays, Users, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIRPORTS } from '../data/mockData';
import type { SearchParams, TripType } from '../types';

interface Props {
  compact?: boolean;
  defaultValues?: Partial<SearchParams>;
}

export function FlightSearchWidget({ compact = false, defaultValues }: Props) {
  const { setSearchParams } = useApp();
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>(defaultValues?.tripType ?? 'one_way');
  const [origin, setOrigin] = useState(defaultValues?.origin ?? '');
  const [destination, setDestination] = useState(defaultValues?.destination ?? '');
  const [date, setDate] = useState(defaultValues?.date ?? '2026-06-15');
  const [returnDate, setReturnDate] = useState(defaultValues?.returnDate ?? '');
  const [flightClass, setFlightClass] = useState(defaultValues?.class ?? 'economy');
  const [passengers, setPassengers] = useState(defaultValues?.passengers ?? 1);

  const swap = () => {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ origin, destination, date, returnDate, class: flightClass, passengers, tripType });
    navigate('/search');
  };

  const selectClass = 'w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] appearance-none cursor-pointer';

  return (
    <form onSubmit={handleSearch} className={`bg-white rounded-2xl shadow-xl p-4 md:p-6 ${compact ? '' : 'max-w-3xl w-full'}`}>
      {!compact && (
        <div className="flex gap-4 mb-4 text-sm">
          {([['one_way', 'One Way'], ['round_trip', 'Round Trip']] as const).map(([value, label]) => (
            <label key={value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio" name="tripType" value={value}
                checked={tripType === value}
                onChange={() => setTripType(value)}
                className="accent-[#0A1F44]"
              />
              <span className="text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-5'} gap-3`}>
        {/* Origin */}
        <div className="relative md:col-span-1">
          <label className="block text-xs text-gray-500 mb-1 font-medium">From</label>
          <div className="relative">
            <select value={origin} onChange={e => setOrigin(e.target.value)} className={selectClass} required>
              <option value="">Select origin</option>
              {AIRPORTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Swap button */}
        <div className="hidden md:flex items-end justify-center pb-0.5">
          <button type="button" onClick={swap}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0A1F44] hover:text-white hover:border-[#0A1F44] transition-colors">
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination */}
        <div className="relative md:col-span-1">
          <label className="block text-xs text-gray-500 mb-1 font-medium">To</label>
          <div className="relative">
            <select value={destination} onChange={e => setDestination(e.target.value)} className={selectClass} required>
              <option value="">Select destination</option>
              {AIRPORTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Departure date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Departure</label>
          <div className="relative">
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className={selectClass} required />
            <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Class + Passengers + Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1 font-medium">Class</label>
            <div className="relative">
              <select value={flightClass} onChange={e => setFlightClass(e.target.value)} className={selectClass}>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first_class">First Class</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="w-20">
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              <Users className="w-3.5 h-3.5 inline" />
            </label>
            <div className="relative">
              <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className={selectClass}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Return date row (round trip only) */}
      {tripType === 'round_trip' && !compact && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-start-4 md:col-span-1">
            <label className="block text-xs text-gray-500 mb-1 font-medium">Return</label>
            <div className="relative">
              <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                min={date} className={selectClass} required={tripType === 'round_trip'} />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <button type="submit"
        className="mt-4 w-full bg-[#2E8FD8] hover:bg-[#1a75be] text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-colors">
        <Search className="w-4 h-4" />
        Search Flights
      </button>
    </form>
  );
}
