import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plane, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useFlightSearch } from '../api/flights';
import { StatusBadge } from '../components/StatusBadge';
import { LoginGateModal } from '../components/LoginGateModal';
import { FlightSearchWidget } from '../components/FlightSearchWidget';
import type { Flight } from '../types';

const CLASS_LABELS: Record<string, string> = { economy: 'Economy', business: 'Business', first_class: 'First Class' };
const CLASS_COLORS: Record<string, string> = {
  economy: 'bg-blue-50 text-blue-700',
  business: 'bg-purple-50 text-purple-700',
  first_class: 'bg-amber-50 text-amber-700',
};

export default function SearchResults() {
  const { user, setSelectedFlight, setLoginGateFlight, searchParams } = useApp();
  const navigate = useNavigate();
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['economy', 'business', 'first_class']);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['morning', 'afternoon', 'evening', 'night']);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  // Flights now come from the API (mocked by MSW until the backend is live).
  const { data: flights = [], isLoading, isError, error } = useFlightSearch(searchParams);

  const toggleClass = (cls: string) =>
    setSelectedClasses(p => p.includes(cls) ? p.filter(c => c !== cls) : [...p, cls]);

  const getTimeSlot = (time: string) => {
    const h = parseInt(time.split(':')[0]);
    if (h < 6) return 'night';
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  };

  const filtered = flights
    .filter(f => f.price <= maxPrice)
    .filter(f => selectedClasses.includes(f.class))
    .filter(f => selectedTimes.includes(getTimeSlot(f.departureTime)))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return a.departureTime.localeCompare(b.departureTime);
    });

  const handleBook = (flight: Flight) => {
    if (!user) {
      setLoginGateFlight(flight);
      setShowLoginGate(true);
    } else {
      setSelectedFlight(flight);
      navigate('/seat-selection');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Search bar strip */}
      <div className="bg-[#0A1F44] py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <FlightSearchWidget compact defaultValues={searchParams ?? undefined} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-[#2E8FD8]" />
              <h3 className="text-sm text-[#0A1F44]">Filters</h3>
            </div>

            {/* Price */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Max Price</span>
                <span className="font-medium text-[#0A1F44]">${maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min={200} max={4000} step={50} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2E8FD8]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$200</span><span>$4,000</span>
              </div>
            </div>

            {/* Class */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2 font-medium">Cabin Class</p>
              {['economy', 'business', 'first_class'].map(cls => (
                <label key={cls} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="checkbox" checked={selectedClasses.includes(cls)}
                    onChange={() => toggleClass(cls)}
                    className="w-4 h-4 accent-[#0A1F44] rounded" />
                  <span className="text-sm text-gray-700">{CLASS_LABELS[cls]}</span>
                </label>
              ))}
            </div>

            {/* Time of day */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Departure Time</p>
              {[
                { id: 'morning', label: 'Morning', sub: '6am – 12pm' },
                { id: 'afternoon', label: 'Afternoon', sub: '12pm – 6pm' },
                { id: 'evening', label: 'Evening', sub: '6pm – 12am' },
                { id: 'night', label: 'Night', sub: '12am – 6am' },
              ].map(({ id, label, sub }) => (
                <label key={id} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="checkbox" checked={selectedTimes.includes(id)}
                    onChange={() => setSelectedTimes(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id])}
                    className="w-4 h-4 accent-[#0A1F44] rounded" />
                  <div>
                    <div className="text-sm text-gray-700">{label}</div>
                    <div className="text-xs text-gray-400">{sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-[#0A1F44]">{filtered.length} flights found</h2>
              {searchParams && (
                <p className="text-sm text-gray-500">{searchParams.origin} → {searchParams.destination}, {searchParams.date}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              {['price', 'duration', 'departure'].map(s => (
                <button key={s} onClick={() => setSortBy(s as typeof sortBy)}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    sortBy === s ? 'bg-[#0A1F44] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Loader2 className="w-10 h-10 text-[#2E8FD8] mx-auto mb-3 animate-spin" />
              <h3 className="text-gray-500">Searching flights…</h3>
            </div>
          ) : isError ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
              <h3 className="text-gray-600">Couldn’t load flights</h3>
              <p className="text-sm text-gray-400 mt-1">
                {(error as { message?: string })?.message ?? 'Please try again.'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-500">No flights match your filters</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(flight => (
                <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>
      </div>

      <LoginGateModal open={showLoginGate} onClose={() => setShowLoginGate(false)} />
    </div>
  );
}

function FlightCard({ flight, onBook }: { flight: Flight; onBook: (f: Flight) => void }) {
  const isCancelled = flight.status === 'cancelled';
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Route info */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-[#0A1F44]">{flight.departureTime}</div>
            <div className="text-sm text-gray-500 font-mono">{flight.originCode}</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-400">{flight.duration}</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-[#2E8FD8]" />
              <div className="w-24 h-px bg-gray-200 relative">
                <Plane className="w-3 h-3 text-[#2E8FD8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="w-2 h-2 rounded-full border-2 border-[#2E8FD8]" />
            </div>
            <div className="text-xs text-gray-400">Direct</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#0A1F44]">{flight.arrivalTime}</div>
            <div className="text-sm text-gray-500 font-mono">{flight.destinationCode}</div>
          </div>
        </div>

        {/* Middle info */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Flight</div>
            <div className="text-sm font-semibold text-[#0A1F44]">{flight.number}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Aircraft</div>
            <div className="text-xs text-gray-600">{flight.aircraft}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Gate</div>
            <div className="text-sm font-semibold text-[#0A1F44]">{flight.gate}</div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 min-w-[120px]">
          <StatusBadge status={flight.status} />
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CLASS_COLORS[flight.class]}`}>
            {CLASS_LABELS[flight.class]}
          </span>
          <div className="text-2xl font-bold text-[#0A1F44]">${flight.price.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{flight.availableSeats} seats left</div>
          <button
            disabled={isCancelled}
            onClick={() => onBook(flight)}
            className={`px-5 py-2 rounded-xl text-sm transition-colors ${
              isCancelled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#0A1F44] text-white hover:bg-[#2E8FD8]'
            }`}>
            {isCancelled ? 'Unavailable' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
