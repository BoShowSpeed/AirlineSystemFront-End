import type { Flight, User, StaffMember, Aircraft, Booking } from '../types';

export const AIRPORTS = [
  'New York (JFK)', 'London (LHR)', 'Paris (CDG)', 'Tokyo (NRT)',
  'Dubai (DXB)', 'Singapore (SIN)', 'Los Angeles (LAX)', 'Sydney (SYD)',
  'Amsterdam (AMS)', 'Frankfurt (FRA)', 'Miami (MIA)', 'Chicago (ORD)',
];

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1', number: 'AV101', origin: 'New York', originCode: 'JFK',
    destination: 'London', destinationCode: 'LHR',
    departureTime: '09:00', arrivalTime: '21:15', date: '2026-06-15',
    duration: '7h 15m', class: 'economy', price: 489, status: 'scheduled',
    gate: 'B12', aircraft: 'Boeing 777-300ER', availableSeats: 42,
  },
  {
    id: '2', number: 'AV102', origin: 'New York', originCode: 'JFK',
    destination: 'London', destinationCode: 'LHR',
    departureTime: '14:30', arrivalTime: '02:45', date: '2026-06-15',
    duration: '7h 15m', class: 'business', price: 1250, status: 'confirmed',
    gate: 'C04', aircraft: 'Airbus A380', availableSeats: 8,
  },
  {
    id: '3', number: 'AV203', origin: 'New York', originCode: 'JFK',
    destination: 'Paris', destinationCode: 'CDG',
    departureTime: '11:00', arrivalTime: '23:30', date: '2026-06-15',
    duration: '7h 30m', class: 'economy', price: 529, status: 'delayed',
    gate: 'A08', aircraft: 'Boeing 787-9', availableSeats: 25,
  },
  {
    id: '4', number: 'AV304', origin: 'New York', originCode: 'JFK',
    destination: 'Dubai', destinationCode: 'DXB',
    departureTime: '22:00', arrivalTime: '18:30', date: '2026-06-15',
    duration: '12h 30m', class: 'first_class', price: 3499, status: 'scheduled',
    gate: 'D02', aircraft: 'Airbus A380', availableSeats: 4,
  },
  {
    id: '5', number: 'AV405', origin: 'London', originCode: 'LHR',
    destination: 'Tokyo', destinationCode: 'NRT',
    departureTime: '13:00', arrivalTime: '09:30', date: '2026-06-15',
    duration: '11h 30m', class: 'business', price: 1890, status: 'confirmed',
    gate: 'E15', aircraft: 'Boeing 777-300ER', availableSeats: 12,
  },
  {
    id: '6', number: 'AV506', origin: 'Paris', originCode: 'CDG',
    destination: 'Singapore', destinationCode: 'SIN',
    departureTime: '10:15', arrivalTime: '05:45', date: '2026-06-15',
    duration: '12h 30m', class: 'economy', price: 620, status: 'cancelled',
    gate: 'F09', aircraft: 'Airbus A350-900', availableSeats: 0,
  },
  {
    id: '7', number: 'AV607', origin: 'Los Angeles', originCode: 'LAX',
    destination: 'Tokyo', destinationCode: 'NRT',
    departureTime: '16:45', arrivalTime: '20:15', date: '2026-06-15',
    duration: '10h 30m', class: 'economy', price: 710, status: 'scheduled',
    gate: 'G11', aircraft: 'Boeing 787-9', availableSeats: 60,
  },
  {
    id: '8', number: 'AV708', origin: 'Dubai', originCode: 'DXB',
    destination: 'Frankfurt', destinationCode: 'FRA',
    departureTime: '03:30', arrivalTime: '07:45', date: '2026-06-15',
    duration: '6h 15m', class: 'business', price: 980, status: 'delayed',
    gate: 'H03', aircraft: 'Airbus A350-900', availableSeats: 15,
  },
];

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'passenger', initials: 'SC', phone: '+1 555-0101' },
  { id: '2', name: 'Admin User', email: 'admin@avion.com', role: 'admin', initials: 'AU', phone: '+1 555-0102' },
  { id: '3', name: 'Capt. James Wilson', email: 'jwilson@avion.com', role: 'staff', initials: 'JW', phone: '+1 555-0103' },
  { id: '4', name: 'Olivia Martinez', email: 'omartinez@avion.com', role: 'staff', initials: 'OM', phone: '+1 555-0104' },
  { id: '5', name: 'Emma Thompson', email: 'ethompson@avion.com', role: 'staff', initials: 'ET', phone: '+1 555-0106' },
  { id: '6', name: 'Priya Sharma', email: 'psharma@avion.com', role: 'staff', initials: 'PS', phone: '+1 555-0108' },
  { id: '7', name: 'Tech. Robert Hayes', email: 'rhayes@avion.com', role: 'staff', initials: 'RH', phone: '+1 555-0109' },
];

export const QUICK_LOGIN_USERS = [
  { label: 'Passenger (Sarah Chen)', user: MOCK_USERS[0] },
  { label: 'Admin User', user: MOCK_USERS[1] },
  { label: 'Captain (James Wilson)', user: MOCK_USERS[2] },
  { label: 'Co-Pilot (Olivia Martinez)', user: MOCK_USERS[3] },
  { label: 'Manager (Emma Thompson)', user: MOCK_USERS[4] },
  { label: 'Cabin Crew (Priya Sharma)', user: MOCK_USERS[5] },
  { label: 'Technician (Robert Hayes)', user: MOCK_USERS[6] },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    flight: MOCK_FLIGHTS[0],
    seat: '14A',
    seatClass: 'economy',
    passenger: { name: 'Sarah Chen', email: 'sarah@example.com', phone: '+1 555-0101', passport: 'US123456789' },
    price: 489,
    tax: 73.35,
    total: 562.35,
    status: 'confirmed',
    bookingRef: 'AVBK001',
    boardingGroup: 'B',
  },
  {
    id: 'BK002',
    flight: MOCK_FLIGHTS[2],
    seat: '22C',
    seatClass: 'economy',
    passenger: { name: 'Sarah Chen', email: 'sarah@example.com', phone: '+1 555-0101', passport: 'US123456789' },
    price: 529,
    tax: 79.35,
    total: 608.35,
    status: 'confirmed',
    bookingRef: 'AVBK002',
    boardingGroup: 'C',
  },
  {
    id: 'BK003',
    flight: MOCK_FLIGHTS[5],
    seat: '08B',
    seatClass: 'economy',
    passenger: { name: 'Sarah Chen', email: 'sarah@example.com', phone: '+1 555-0101', passport: 'US123456789' },
    price: 620,
    tax: 93,
    total: 713,
    status: 'cancelled',
    bookingRef: 'AVBK003',
    boardingGroup: 'A',
  },
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 's1', name: 'Capt. James Wilson', role: 'pilot',
    email: 'jwilson@avion.com', phone: '+1 555-0103',
    license: 'ATP-US-78234', availability: 'available',
    initials: 'JW', assignments: ['AV101', 'AV102'],
    nextFlight: 'AV101 — Jun 15, 09:00', yearsExp: 18,
  },
  {
    id: 's2', name: 'Olivia Martinez', role: 'copilot',
    email: 'omartinez@avion.com', phone: '+1 555-0104',
    license: 'CPL-US-45123', availability: 'available',
    initials: 'OM', assignments: ['AV203'],
    nextFlight: 'AV203 — Jun 15, 11:00', yearsExp: 7,
  },
  {
    id: 's3', name: 'Daniel Park', role: 'cabin_crew',
    email: 'dpark@avion.com', phone: '+1 555-0105',
    license: 'FA-US-12345', availability: 'on-leave',
    initials: 'DP', assignments: [],
    nextFlight: undefined, yearsExp: 4,
  },
  {
    id: 's4', name: 'Emma Thompson', role: 'manager',
    email: 'ethompson@avion.com', phone: '+1 555-0106',
    license: 'FA-US-67890', availability: 'unavailable',
    initials: 'ET', assignments: ['AV304'],
    nextFlight: 'AV304 — Jun 15, 22:00', yearsExp: 12,
  },
  {
    id: 's5', name: 'Marcus Johnson', role: 'pilot',
    email: 'mjohnson@avion.com', phone: '+1 555-0107',
    license: 'ATP-US-90123', availability: 'available',
    initials: 'MJ', assignments: ['AV405'],
    nextFlight: 'AV405 — Jun 15, 13:00', yearsExp: 22,
  },
  {
    id: 's6', name: 'Priya Sharma', role: 'cabin_crew',
    email: 'psharma@avion.com', phone: '+1 555-0108',
    license: 'FA-US-34521', availability: 'available',
    initials: 'PS', assignments: ['AV102', 'AV405'],
    nextFlight: 'AV102 — Jun 15, 14:30', yearsExp: 5,
  },
  {
    id: 's7', name: 'Tech. Robert Hayes', role: 'technician',
    email: 'rhayes@avion.com', phone: '+1 555-0109',
    license: 'AME-US-61234', availability: 'available',
    initials: 'RH', assignments: [],
    nextFlight: undefined, yearsExp: 9,
  },
];

export const MOCK_AIRCRAFT: Aircraft[] = [
  {
    id: 'a1', registration: 'N-AV001', model: 'Boeing 777-300ER', manufacturer: 'Boeing',
    capacity: 396, status: 'available',
    lastMaintenance: '2026-04-15', nextMaintenance: '2026-10-15', age: 4,
    maintenanceLogs: [
      { id: 'ml1', date: '2026-04-15', type: 'C-Check', technician: 'Tech. Robert Hayes', notes: 'Routine C-Check completed. All systems nominal.', status: 'completed' },
      { id: 'ml2', date: '2026-02-10', type: 'Engine Inspection', technician: 'Tech. Linda Wu', notes: 'Engine 2 compressor blade replacement.', status: 'completed' },
      { id: 'ml3', date: '2026-10-15', type: 'B-Check', technician: 'TBD', notes: 'Scheduled routine B-Check.', status: 'scheduled' },
    ],
  },
  {
    id: 'a2', registration: 'N-AV002', model: 'Airbus A380', manufacturer: 'Airbus',
    capacity: 525, status: 'assigned',
    lastMaintenance: '2026-03-20', nextMaintenance: '2026-09-20', age: 6,
    maintenanceLogs: [
      { id: 'ml4', date: '2026-03-20', type: 'A-Check', technician: 'Tech. Carlos Ruiz', notes: 'A-Check completed. Wing inspection passed.', status: 'completed' },
      { id: 'ml5', date: '2026-09-20', type: 'C-Check', technician: 'TBD', notes: 'Major structural inspection scheduled.', status: 'scheduled' },
    ],
  },
  {
    id: 'a3', registration: 'N-AV003', model: 'Boeing 787-9', manufacturer: 'Boeing',
    capacity: 296, status: 'maintenance',
    lastMaintenance: '2026-05-01', nextMaintenance: '2026-11-01', age: 3,
    maintenanceLogs: [
      { id: 'ml6', date: '2026-05-01', type: 'Avionics Repair', technician: 'Tech. Jin Park', notes: 'FMS software update and ILS calibration.', status: 'in-progress' },
    ],
  },
  {
    id: 'a4', registration: 'N-AV004', model: 'Airbus A350-900', manufacturer: 'Airbus',
    capacity: 314, status: 'available',
    lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10', age: 5,
    maintenanceLogs: [
      { id: 'ml7', date: '2026-02-10', type: 'B-Check', technician: 'Tech. Sarah Mills', notes: 'Full B-Check. Replaced hydraulic pump.', status: 'completed' },
    ],
  },
  {
    id: 'a5', registration: 'N-AV005', model: 'Boeing 737-800', manufacturer: 'Boeing',
    capacity: 162, status: 'retired',
    lastMaintenance: '2026-01-05', nextMaintenance: '2026-07-05', age: 8,
    maintenanceLogs: [
      { id: 'ml8', date: '2026-01-05', type: 'Emergency Repair', technician: 'Tech. Tom Bradley', notes: 'Landing gear sensor fault. Awaiting parts.', status: 'in-progress' },
    ],
  },
];

export const KPI_SPARKLINE_DATA = [
  { flights: [42, 48, 45, 51, 49, 55, 52, 58], passengers: [3200, 3450, 3300, 3680, 3510, 3820, 3710, 3950], revenue: [1.2, 1.35, 1.28, 1.42, 1.38, 1.51, 1.45, 1.62], ontime: [88, 91, 87, 93, 90, 94, 92, 95] },
];
