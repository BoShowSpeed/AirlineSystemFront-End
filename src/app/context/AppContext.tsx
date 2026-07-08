import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Flight, SearchParams, Booking, DayAvailability, StaffMember } from '../types';
import { MOCK_STAFF } from '../data/mockData';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  type RegisterPayload,
} from '../api/auth';
import { getAuthToken, setAuthToken } from '../api/client';

// Pre-seeded staff availability for demo (staffId → date → entry)
const SEED_AVAILABILITY: Record<string, Record<string, DayAvailability>> = {
  s1: {
    '2026-06-02': { date: '2026-06-02', status: 'flight', note: 'AV101 JFK→LHR' },
    '2026-06-03': { date: '2026-06-03', status: 'flight', note: 'AV102 JFK→LHR' },
    '2026-06-05': { date: '2026-06-05', status: 'training' },
    '2026-06-06': { date: '2026-06-06', status: 'flight', note: 'AV203 JFK→CDG' },
    '2026-06-08': { date: '2026-06-08', status: 'available' },
    '2026-06-09': { date: '2026-06-09', status: 'available' },
    '2026-06-10': { date: '2026-06-10', status: 'unavailable', note: 'Medical appointment' },
    '2026-06-14': { date: '2026-06-14', status: 'available' },
    '2026-06-15': { date: '2026-06-15', status: 'flight', note: 'AV101 JFK→LHR' },
  },
  s2: {
    '2026-06-06': { date: '2026-06-06', status: 'flight', note: 'AV203 JFK→CDG' },
    '2026-06-10': { date: '2026-06-10', status: 'available' },
    '2026-06-11': { date: '2026-06-11', status: 'available' },
    '2026-06-12': { date: '2026-06-12', status: 'on-leave', note: 'Annual leave' },
    '2026-06-13': { date: '2026-06-13', status: 'on-leave', note: 'Annual leave' },
  },
  s3: {
    '2026-06-01': { date: '2026-06-01', status: 'on-leave', note: 'Approved leave' },
    '2026-06-02': { date: '2026-06-02', status: 'on-leave' },
    '2026-06-03': { date: '2026-06-03', status: 'on-leave' },
    '2026-06-04': { date: '2026-06-04', status: 'on-leave' },
    '2026-06-05': { date: '2026-06-05', status: 'on-leave' },
  },
  s4: {
    '2026-06-15': { date: '2026-06-15', status: 'flight', note: 'AV304 JFK→DXB' },
    '2026-06-09': { date: '2026-06-09', status: 'unavailable', note: 'Personal' },
    '2026-06-16': { date: '2026-06-16', status: 'available' },
  },
  s5: {
    '2026-06-15': { date: '2026-06-15', status: 'flight', note: 'AV405 LHR→NRT' },
    '2026-06-08': { date: '2026-06-08', status: 'training', note: 'Simulator' },
    '2026-06-12': { date: '2026-06-12', status: 'available' },
  },
  s6: {
    '2026-06-15': { date: '2026-06-15', status: 'flight', note: 'AV102 JFK→LHR' },
    '2026-06-10': { date: '2026-06-10', status: 'available' },
    '2026-06-11': { date: '2026-06-11', status: 'available' },
  },
};

interface AppContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  /** True while we're restoring a session from a stored token on first load. */
  isRestoringSession: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams | null) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedSeat: string | null;
  setSelectedSeat: (seat: string | null) => void;
  booking: Booking | null;
  setBooking: (booking: Booking | null) => void;
  loginGateFlight: Flight | null;
  setLoginGateFlight: (flight: Flight | null) => void;
  staffAvailability: Record<string, Record<string, DayAvailability>>;
  setStaffDayAvailability: (staffId: string, entry: DayAvailability) => void;
  staffMembers: StaffMember[];
  addStaffMember: (member: StaffMember) => void;
  updateStaffMember: (member: StaffMember) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  // Restore the session on first load: if a token is stored, fetch the user.
  useEffect(() => {
    if (!getAuthToken()) {
      setIsRestoringSession(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => setAuthToken(null)) // stale/invalid token → drop it
      .finally(() => setIsRestoringSession(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedIn } = await apiLogin({ email, password });
    setAuthToken(token);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user: created } = await apiRegister(payload);
    setAuthToken(token);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    void apiLogout(); // best-effort server call; also clears the token
    setAuthToken(null);
    setUser(null);
  }, []);

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loginGateFlight, setLoginGateFlight] = useState<Flight | null>(null);
  const [staffAvailability, setStaffAvailability] = useState<Record<string, Record<string, DayAvailability>>>(SEED_AVAILABILITY);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(MOCK_STAFF);

  const addStaffMember = (member: StaffMember) =>
    setStaffMembers(prev => [member, ...prev]);

  const updateStaffMember = (member: StaffMember) =>
    setStaffMembers(prev => prev.map(s => s.id === member.id ? member : s));

  const setStaffDayAvailability = (staffId: string, entry: DayAvailability) => {
    setStaffAvailability(prev => ({
      ...prev,
      [staffId]: { ...(prev[staffId] ?? {}), [entry.date]: entry },
    }));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      isRestoringSession, login, register, logout,
      searchParams, setSearchParams,
      selectedFlight, setSelectedFlight,
      selectedSeat, setSelectedSeat,
      booking, setBooking,
      loginGateFlight, setLoginGateFlight,
      staffAvailability, setStaffDayAvailability,
      staffMembers, addStaffMember, updateStaffMember,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
