import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Plane, Users, DollarSign, Clock, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useFlights } from '../../api/flights';
import { StatusBadge } from '../../components/StatusBadge';

const SPARKLINE_DATA = [
  [42,48,45,51,49,55,52,58],
  [3200,3450,3300,3680,3510,3820,3710,3950],
  [1.2,1.35,1.28,1.42,1.38,1.51,1.45,1.62],
  [88,91,87,93,90,94,92,95],
].map(d => d.map(v => ({ v })));

const KPI_CARDS = [
  { label: 'Total Flights Today', value: '58', delta: '+12%', up: true, icon: Plane, color: 'text-[#2E8FD8]', bg: 'bg-blue-50', spark: SPARKLINE_DATA[0], line: '#2E8FD8' },
  { label: 'Passengers', value: '3,950', delta: '+8%', up: true, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', spark: SPARKLINE_DATA[1], line: '#10B981' },
  { label: 'Revenue (M)', value: '$1.62M', delta: '+14%', up: true, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50', spark: SPARKLINE_DATA[2], line: '#8B5CF6' },
  { label: 'On-Time Rate', value: '95%', delta: '-1%', up: false, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', spark: SPARKLINE_DATA[3], line: '#F59E0B' },
];

const ROUTE_DATA = [
  { from: 'JFK', to: 'LHR', fromX: 25, fromY: 42, toX: 50, toY: 38 },
  { from: 'JFK', to: 'CDG', fromX: 25, fromY: 42, toX: 52, toY: 40 },
  { from: 'LHR', to: 'NRT', fromX: 50, fromY: 38, toX: 82, toY: 38 },
  { from: 'CDG', to: 'SIN', fromX: 52, fromY: 40, toX: 80, toY: 55 },
  { from: 'LAX', to: 'NRT', fromX: 15, fromY: 44, toX: 82, toY: 38 },
];

export default function AdminDashboard() {
  const { data: flights = [] } = useFlights();
  const liveFlights = flights.filter(f => f.status !== 'cancelled').slice(0, 6);
  const alerts = flights.filter(f => f.status === 'delayed' || f.status === 'cancelled');

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[#0A1F44]">Operations Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time overview — June 3, 2026</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-700 mb-1">Active Alerts</div>
            <div className="flex flex-wrap gap-2">
              {alerts.map(f => (
                <span key={f.id} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                  {f.number}: {f.status}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {KPI_CARDS.map(({ label, value, delta, up, icon: Icon, color, bg, spark, line }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {delta}
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0A1F44] mb-0.5">{value}</div>
            <div className="text-xs text-gray-500 mb-3">{label}</div>
            <div className="h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark}>
                  <Line type="monotone" dataKey="v" stroke={line} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Live flights table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[#0A1F44]">Live Flights</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F7FB]">
                {['Flight', 'Route', 'Departs', 'Gate', 'Aircraft', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveFlights.map((f, i) => (
                <tr key={f.id} className={`border-t border-gray-50 hover:bg-[#F4F7FB] transition-colors ${i === liveFlights.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0A1F44]">{f.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.originCode} → {f.destinationCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.departureTime}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#0A1F44]">{f.gate}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">{f.aircraft}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Route map panel */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[#0A1F44]">Route Map</h3>
          </div>
          <div className="p-4">
            {/* SVG world map placeholder */}
            <div className="relative bg-[#EFF6FF] rounded-xl overflow-hidden" style={{ paddingBottom: '65%' }}>
              <svg viewBox="0 0 100 65" className="absolute inset-0 w-full h-full">
                {/* Simplified continent shapes */}
                <path d="M10 20 Q15 15 25 18 Q30 22 28 30 Q22 35 15 32 Z" fill="#CBD5E1" opacity="0.6" />
                <path d="M45 15 Q55 12 65 16 Q70 20 68 32 Q62 38 52 36 Q44 30 44 22 Z" fill="#CBD5E1" opacity="0.6" />
                <path d="M75 15 Q88 14 92 22 Q90 35 82 38 Q74 35 73 25 Z" fill="#CBD5E1" opacity="0.6" />
                <path d="M15 38 Q22 36 28 42 Q30 52 22 55 Q14 53 13 45 Z" fill="#CBD5E1" opacity="0.6" />
                <path d="M32 42 Q40 40 48 46 Q50 55 42 58 Q32 56 30 48 Z" fill="#CBD5E1" opacity="0.6" />

                {/* Flight routes */}
                {ROUTE_DATA.map(({ from, to, fromX, fromY, toX, toY }) => (
                  <g key={`${from}-${to}`}>
                    <path
                      d={`M${fromX} ${fromY} Q${(fromX+toX)/2} ${Math.min(fromY,toY)-10} ${toX} ${toY}`}
                      fill="none" stroke="#2E8FD8" strokeWidth="0.8" strokeDasharray="2,1" opacity="0.7"
                    />
                    <circle cx={fromX} cy={fromY} r="1.5" fill="#0A1F44" />
                    <circle cx={toX} cy={toY} r="1.5" fill="#0A1F44" />
                    <text x={fromX} y={fromY - 3} fontSize="2.5" fill="#0A1F44" textAnchor="middle">{from}</text>
                    <text x={toX} y={toY - 3} fontSize="2.5" fill="#0A1F44" textAnchor="middle">{to}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {[
                { route: 'JFK → LHR', flights: 2, status: 'On time' },
                { route: 'LHR → NRT', flights: 1, status: 'On time' },
                { route: 'JFK → CDG', flights: 1, status: 'Delayed' },
                { route: 'LAX → NRT', flights: 1, status: 'On time' },
              ].map(r => (
                <div key={r.route} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px bg-[#2E8FD8] border-t border-dashed border-[#2E8FD8]" />
                    <span className="text-gray-600">{r.route}</span>
                  </div>
                  <span className={r.status === 'Delayed' ? 'text-amber-600' : 'text-emerald-600'}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Gates Active', value: '24 / 36' },
          { label: 'Aircraft in Air', value: '14' },
          { label: 'Crew On Duty', value: '87' },
          { label: 'Avg Delay', value: '8 min' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-lg font-bold text-[#0A1F44]">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
