import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plane, TicketCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_BOOKINGS } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { FlightSearchWidget } from '../components/FlightSearchWidget';

export default function PassengerDashboard() {
  const { user, setSelectedFlight } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const upcoming = MOCK_BOOKINGS.filter(b => b.status !== 'cancelled');
  const history = MOCK_BOOKINGS;

  const goToBoarding = () => {
    navigate('/boarding-pass');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Header */}
      <div className="bg-[#0A1F44] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Welcome back,</p>
              <h1 className="text-white">
                {user?.name.split(' ')[0]} ✈️
              </h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold">{upcoming.length}</div>
                <div className="text-xs text-white/60">Upcoming</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold">{history.length}</div>
                <div className="text-xs text-white/60">Total Flights</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold">4,820</div>
                <div className="text-xs text-white/60">Miles Earned</div>
              </div>
            </div>
          </div>
          <FlightSearchWidget compact />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Next flight highlight */}
        {upcoming[0] && (
          <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-10">
              <Plane className="w-48 h-48 -rotate-12 translate-x-8 translate-y-2" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/70 uppercase tracking-wide">Next Flight</span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-3xl font-bold">{upcoming[0].flight.originCode}</div>
                    <div className="text-white/60 text-sm">{upcoming[0].flight.origin}</div>
                    <div className="text-white text-lg mt-1">{upcoming[0].flight.departureTime}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-white/50 mb-1">{upcoming[0].flight.duration}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-px bg-white/30" />
                      <Plane className="w-4 h-4 text-[#2E8FD8]" />
                      <div className="w-16 h-px bg-white/30" />
                    </div>
                    <div className="text-xs text-white/50 mt-1">Direct</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{upcoming[0].flight.destinationCode}</div>
                    <div className="text-white/60 text-sm">{upcoming[0].flight.destination}</div>
                    <div className="text-white text-lg mt-1">{upcoming[0].flight.arrivalTime}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="text-right">
                    <div className="text-xs text-white/60">Seat</div>
                    <div className="text-xl font-bold">{upcoming[0].seat}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/60">Gate</div>
                    <div className="text-xl font-bold">{upcoming[0].flight.gate}</div>
                  </div>
                  <button onClick={() => goToBoarding()}
                    className="bg-[#2E8FD8] hover:bg-[#1a75be] text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors">
                    <TicketCheck className="w-4 h-4" /> Boarding Pass
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-6 text-sm">
                <span className="text-white/60">Flight <span className="text-white font-medium">{upcoming[0].flight.number}</span></span>
                <span className="text-white/60">Date <span className="text-white font-medium">{upcoming[0].flight.date}</span></span>
                <span className="text-white/60">Ref <span className="text-white font-medium">{upcoming[0].bookingRef}</span></span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 inline-flex shadow-sm w-auto">
          {(['upcoming', 'history'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm capitalize transition-all ${
                activeTab === t ? 'bg-[#0A1F44] text-white' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'upcoming' ? '🛫 Upcoming' : '📋 History'}
            </button>
          ))}
        </div>

        {activeTab === 'upcoming' ? (
          <div className="space-y-3">
            {upcoming.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4 flex-wrap hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-[#2E8FD8]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1F44]">{b.flight.originCode} → {b.flight.destinationCode}</div>
                    <div className="text-xs text-gray-500">{b.flight.number} · {b.flight.date} · Seat {b.seat}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  <button onClick={() => goToBoarding()}
                    className="text-sm text-[#2E8FD8] hover:underline flex items-center gap-1">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F4F7FB]">
                  {['Booking Ref', 'Route', 'Date', 'Seat', 'Price', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((b, i) => (
                  <tr key={b.id} className={`border-b border-gray-50 hover:bg-[#F4F7FB] transition-colors ${i === history.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3 text-sm font-mono text-[#2E8FD8]">{b.bookingRef}</td>
                    <td className="px-4 py-3 text-sm text-[#0A1F44] font-medium">{b.flight.originCode} → {b.flight.destinationCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.flight.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.seat}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0A1F44]">${b.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
