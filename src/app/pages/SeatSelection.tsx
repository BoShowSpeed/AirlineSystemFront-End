import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plane, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Seat } from '../types';

const TAKEN_SEATS = new Set([
  '1A','1C','2D','2F','3A','3C',
  '4A','4B','5E','5F','6C','6D','7A','7F','8B','8E','9C','9D','10A','10F',
  '11A','11B','11C','12D','12E','13F','14A','14B','14C','15D','15E','16F',
  '17A','17B','18C','18D','19E','19F','20A','20B','21C','22A','23D','24E',
  '25F','26A','27B','28C','29D','30A','31E','32F','33A','34B','35C',
]);

const CLASS_STYLE = {
  first_class: { bg: 'bg-amber-400', taken: 'bg-amber-200', label: 'First Class', color: 'border-amber-400' },
  business:    { bg: 'bg-[#2E8FD8]', taken: 'bg-blue-200', label: 'Business',    color: 'border-[#2E8FD8]' },
  economy:     { bg: 'bg-gray-400',  taken: 'bg-gray-200',  label: 'Economy',     color: 'border-gray-400'  },
};

const PRICES = { first_class: 3499, business: 1250, economy: 489 };

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 3; row++) {
    for (const col of ['A', 'C', 'D', 'F']) {
      const id = `${row}${col}`;
      seats.push({ id, row, column: col, class: 'first_class', price: PRICES.first_class, status: TAKEN_SEATS.has(id) ? 'taken' : 'available' });
    }
  }
  for (let row = 4; row <= 10; row++) {
    for (const col of ['A', 'B', 'C', 'D', 'E', 'F']) {
      const id = `${row}${col}`;
      seats.push({ id, row, column: col, class: 'business', price: PRICES.business, status: TAKEN_SEATS.has(id) ? 'taken' : 'available' });
    }
  }
  for (let row = 11; row <= 35; row++) {
    for (const col of ['A', 'B', 'C', 'D', 'E', 'F']) {
      const id = `${row}${col}`;
      seats.push({ id, row, column: col, class: 'economy', price: PRICES.economy, status: TAKEN_SEATS.has(id) ? 'taken' : 'available' });
    }
  }
  return seats;
}

export default function SeatSelection() {
  const { selectedFlight, setSelectedSeat } = useApp();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const seats = useMemo(generateSeats, []);

  const getRows = (start: number, end: number) => {
    const rows: Record<number, Seat[]> = {};
    seats.filter(s => s.row >= start && s.row <= end).forEach(s => {
      rows[s.row] = rows[s.row] ?? [];
      rows[s.row].push(s);
    });
    return Object.entries(rows).map(([r, seats]) => ({ row: Number(r), seats }));
  };

  const pickedSeat = seats.find(s => s.id === picked);

  const confirm = () => {
    if (picked) {
      setSelectedSeat(picked);
      navigate('/booking');
    }
  };

  const SeatButton = ({ seat }: { seat: Seat }) => {
    const isSelected = seat.id === picked;
    const cls = CLASS_STYLE[seat.class];
    const available = seat.status === 'available';

    const seatEl = (
      <button
        disabled={!available}
        onClick={() => setPicked(isSelected ? null : seat.id)}
        className={`w-7 h-7 rounded-t-lg border-2 text-xs font-bold transition-all ${
          !available
            ? `${cls.taken} border-transparent cursor-not-allowed opacity-50`
            : isSelected
            ? `${cls.bg} border-white text-white shadow-lg scale-110`
            : `bg-white border-gray-200 hover:border-current hover:${cls.color} text-gray-400 hover:text-[#0A1F44]`
        }`}>
        {seat.column}
      </button>
    );

    if (!available || isSelected) return seatEl;

    return (
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>{seatEl}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-[#0A1F44] text-white text-xs px-3 py-2 rounded-xl shadow-xl z-50"
            sideOffset={8}>
            <div className="font-bold">Seat {seat.id}</div>
            <div className="text-white/70 capitalize">{seat.class} · ${seat.price}</div>
            <Tooltip.Arrow className="fill-[#0A1F44]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  };

  const Section = ({ title, rows, seatClass }: { title: string; rows: ReturnType<typeof getRows>; seatClass: keyof typeof CLASS_STYLE }) => (
    <div className="mb-6">
      <div className={`text-center text-xs font-semibold uppercase tracking-widest py-1.5 mb-3 rounded-lg ${
        seatClass === 'first_class' ? 'bg-amber-50 text-amber-700' :
        seatClass === 'business' ? 'bg-blue-50 text-[#2E8FD8]' :
        'bg-gray-50 text-gray-500'
      }`}>{title}</div>
      <div className="space-y-2">
        {rows.map(({ row, seats: rowSeats }) => {
          const left = rowSeats.filter(s => ['A', 'B', 'C'].includes(s.column) || (seatClass === 'first_class' && ['A', 'C'].includes(s.column)));
          const right = rowSeats.filter(s => ['D', 'E', 'F'].includes(s.column) || (seatClass === 'first_class' && ['D', 'F'].includes(s.column)));
          return (
            <div key={row} className="flex items-center gap-3">
              <div className="w-6 text-xs text-gray-400 text-right">{row}</div>
              <div className="flex gap-1">{left.map(s => <SeatButton key={s.id} seat={s} />)}</div>
              <div className="w-8 text-center text-xs text-gray-300">—</div>
              <div className="flex gap-1">{right.map(s => <SeatButton key={s.id} seat={s} />)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-[#F4F7FB] pb-32">
        {/* Header */}
        <div className="bg-[#0A1F44] py-6 px-4 text-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white mb-1">Select Your Seat</h2>
            {selectedFlight && (
              <p className="text-white/60 text-sm">
                {selectedFlight.number} · {selectedFlight.originCode} → {selectedFlight.destinationCode} · {selectedFlight.date}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-6">
          {/* Legend */}
          <div className="bg-white rounded-2xl p-4 mb-4 flex flex-wrap gap-4 justify-center shadow-sm">
            {[
              { color: 'bg-amber-400', label: 'First Class' },
              { color: 'bg-[#2E8FD8]', label: 'Business' },
              { color: 'bg-gray-300', label: 'Economy' },
              { color: 'bg-white border-2 border-gray-200', label: 'Available' },
              { color: 'bg-gray-200 opacity-50', label: 'Taken' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
                <div className={`w-5 h-5 rounded-t-md ${color}`} />
                {label}
              </div>
            ))}
          </div>

          {/* Plane nose */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Plane className="w-12 h-12 text-[#0A1F44] rotate-90" />
              <div className="text-xs text-gray-400 text-center mt-1">Front</div>
            </div>
          </div>

          {/* Column header */}
          <div className="flex items-center gap-3 mb-2 px-9">
            {['A', 'B', 'C', '', 'D', 'E', 'F'].map((c, i) => (
              <div key={i} className={`text-xs text-gray-400 font-medium text-center ${c === '' ? 'w-8' : 'w-7'}`}>{c}</div>
            ))}
          </div>

          {/* Cabin map */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <Section title="First Class" rows={getRows(1, 3)} seatClass="first_class" />
            <Section title="Business Class" rows={getRows(4, 10)} seatClass="business" />
            <Section title="Economy Class" rows={getRows(11, 35)} seatClass="economy" />
          </div>
        </div>

        {/* Fixed bottom confirm bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-40 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            {pickedSeat ? (
              <div>
                <div className="text-sm text-gray-500">Selected seat</div>
                <div className="font-bold text-[#0A1F44]">
                  {pickedSeat.id}
                  <span className="ml-2 text-sm font-normal text-gray-500 capitalize">({pickedSeat.class})</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Info className="w-4 h-4" /> Click a seat to select it
              </div>
            )}
            <div className="flex items-center gap-4">
              {pickedSeat && (
                <div className="text-right">
                  <div className="text-xl font-bold text-[#0A1F44]">${pickedSeat.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">per person</div>
                </div>
              )}
              <button onClick={confirm} disabled={!picked}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  picked
                    ? 'bg-[#0A1F44] text-white hover:bg-[#2E8FD8]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}>
                Confirm Seat <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
