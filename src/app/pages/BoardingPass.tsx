import { useNavigate } from 'react-router';
import { Download, Wallet, Plane, ArrowLeft, TicketCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_BOOKINGS } from '../data/mockData';

function QRCode() {
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1,1],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1,1,0,1],
    [0,0,1,0,1,1,0,1,0,1,1,0,0,1,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,1,0,0,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,1],
    [1,0,0,0,0,0,1,1,0,1,1,0,1,1,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,1],
  ];
  return (
    <div className="inline-block p-2 bg-white rounded-lg">
      {cells.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((cell, ci) => (
            <div key={ci} className={`w-2 h-2 ${cell ? 'bg-[#0A1F44]' : 'bg-white'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BoardingPass() {
  const { booking, user } = useApp();
  const navigate = useNavigate();

  const pass = booking ?? {
    flight: MOCK_BOOKINGS[0].flight,
    seat: MOCK_BOOKINGS[0].seat,
    seatClass: MOCK_BOOKINGS[0].seatClass,
    passenger: { name: user?.name ?? 'Sarah Chen', email: user?.email ?? '', phone: '', passport: '' },
    bookingRef: MOCK_BOOKINGS[0].bookingRef,
    boardingGroup: 'B',
    price: MOCK_BOOKINGS[0].price,
    tax: 73.35,
    total: 562.35,
    status: 'confirmed' as const,
    id: 'BK001',
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0A1F44] mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <TicketCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-[#0A1F44]">Boarding Pass</h2>
            <p className="text-sm text-gray-500">Your booking is confirmed. Have a great flight!</p>
          </div>
        </div>

        {/* Boarding pass card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex relative">
          {/* Left section */}
          <div className="flex-1 p-6 bg-white">
            {/* Airline header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0A1F44] rounded-lg flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-[#0A1F44]">AVI<span className="text-[#2E8FD8]">ON</span></span>
              </div>
              <span className="text-xs text-gray-400 font-mono">BOARDING PASS</span>
            </div>

            {/* Passenger */}
            <div className="mb-5">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Passenger</div>
              <div className="text-xl font-bold text-[#0A1F44] uppercase">{pass.passenger.name}</div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4 mb-5">
              <div>
                <div className="text-3xl font-bold text-[#0A1F44]">{pass.flight.originCode}</div>
                <div className="text-xs text-gray-500 mt-0.5">{pass.flight.origin}</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <Plane className="w-5 h-5 text-[#2E8FD8]" />
                <div className="w-full h-px bg-gray-200 mt-1" />
                <div className="text-xs text-gray-400 mt-1">{pass.flight.duration}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#0A1F44]">{pass.flight.destinationCode}</div>
                <div className="text-xs text-gray-500 mt-0.5">{pass.flight.destination}</div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Date', value: pass.flight.date.split('-').slice(1).join('/') },
                { label: 'Departs', value: pass.flight.departureTime },
                { label: 'Gate', value: pass.flight.gate },
                { label: 'Seat', value: pass.seat },
                { label: 'Class', value: pass.seatClass.charAt(0).toUpperCase() + pass.seatClass.slice(1) },
                { label: 'Group', value: pass.boardingGroup },
                { label: 'Flight', value: pass.flight.number },
                { label: 'Ref', value: pass.bookingRef.slice(0, 6) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm font-semibold text-[#0A1F44]">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative flex flex-col items-center w-6 shrink-0">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-[#F4F7FB] border border-gray-100" />
            <div className="flex-1 border-l-2 border-dashed border-gray-200 mt-3 mb-3" />
            <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-[#F4F7FB] border border-gray-100" />
          </div>

          {/* Right stub */}
          <div className="w-44 bg-[#0A1F44] p-5 flex flex-col items-center gap-4 shrink-0">
            <div className="text-center">
              <div className="text-white/60 text-xs uppercase tracking-widest mb-0.5">Ticket</div>
              <div className="text-white font-mono text-xs">{pass.bookingRef}</div>
            </div>

            <QRCode />

            <div className="text-center">
              <div className="text-white/60 text-xs mb-0.5">Seat</div>
              <div className="text-white font-bold text-xl">{pass.seat}</div>
            </div>

            <div className="text-center">
              <div className="text-white/60 text-xs mb-0.5">Group</div>
              <div className="text-white font-bold text-xl">{pass.boardingGroup}</div>
            </div>

            <div className="mt-auto text-center">
              <div className="text-[#2E8FD8] text-xs font-mono">{pass.flight.number}</div>
              <div className="text-white/40 text-xs">{pass.flight.originCode}→{pass.flight.destinationCode}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#0d2a5e] text-white py-3 rounded-xl transition-colors text-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white py-3 rounded-xl transition-colors text-sm">
            <Wallet className="w-4 h-4" /> Add to Wallet
          </button>
        </div>

        {/* Important info */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Important:</span> Please arrive at the gate at least 45 minutes before departure.
            Have this pass and a valid photo ID ready for scanning.
          </p>
        </div>
      </div>
    </div>
  );
}
