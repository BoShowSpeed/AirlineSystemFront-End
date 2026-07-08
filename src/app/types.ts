export type UserRole = 'guest' | 'passenger' | 'staff' | 'admin';
export type TripType = 'one_way' | 'round_trip';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'aba_pay' | 'acleda' | 'wing' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type MaintenanceType = 'routine' | 'emergency' | 'inspection';
export type GateStatus = 'available' | 'occupied' | 'maintenance' | 'closed';
export type StaffRole = 'pilot' | 'copilot' | 'cabin_crew' | 'manager' | 'technician';

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  pilot: 'Captain / Pilot',
  copilot: 'First Officer',
  cabin_crew: 'Cabin Crew',
  manager: 'Cabin Manager',
  technician: 'Maintenance Technician',
};
export type FlightStatus = 'scheduled' | 'boarding' | 'delayed' | 'departed' | 'arrived' | 'confirmed' | 'cancelled';
export type SeatClass = 'first_class' | 'business' | 'economy';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type AvailabilityStatus = 'available' | 'unavailable' | 'on-leave' | 'training';
export type DayAvailabilityStatus = 'available' | 'unavailable' | 'on-leave' | 'training' | 'flight';

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  status: DayAvailabilityStatus;
  note?: string;
}
export type AircraftStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  initials: string;
}

export interface Flight {
  id: string;
  number: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  class: SeatClass;
  price: number;
  status: FlightStatus;
  gate: string;
  aircraft: string;
  availableSeats: number;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  class: SeatClass;
  price: number;
  status: 'available' | 'taken';
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  class: string;
  passengers: number;
  tripType?: TripType;
}

export interface Booking {
  id: string;
  flight: Flight;
  seat: string;
  seatClass: SeatClass;
  passenger: {
    name: string;
    email: string;
    phone: string;
    passport: string;
  };
  price: number;
  tax: number;
  total: number;
  status: BookingStatus;
  bookingRef: string;
  boardingGroup: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  license: string;
  availability: AvailabilityStatus;
  initials: string;
  assignments: string[];
  nextFlight?: string;
  yearsExp: number;
}

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  capacity: number;
  status: AircraftStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  age: number;
  maintenanceLogs: MaintenanceLog[];
}

export interface MaintenanceLog {
  id: string;
  date: string;
  type: string;
  maintenanceType?: MaintenanceType;
  technician: string;
  notes: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}
