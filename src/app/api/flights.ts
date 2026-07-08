import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { Flight, SearchParams } from '../types';

/** GET /flights/search — list flights matching the search criteria. */
export async function searchFlights(params: Partial<SearchParams>): Promise<Flight[]> {
  const { data } = await apiClient.get<Flight[]>('/flights/search', {
    params: {
      origin: params.origin,
      destination: params.destination,
      date: params.date,
      returnDate: params.returnDate,
      class: params.class,
      passengers: params.passengers,
      tripType: params.tripType,
    },
  });
  return data;
}

/** GET /flights/:id — a single flight. */
export async function getFlight(id: string): Promise<Flight> {
  const { data } = await apiClient.get<Flight>(`/flights/${id}`);
  return data;
}

/**
 * Query hook for the flight search page.
 * Passing `null` (no search performed yet) still lists all flights,
 * matching the previous mock-data behavior.
 */
export function useFlightSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: ['flights', 'search', params],
    queryFn: () => searchFlights(params ?? {}),
  });
}

export function useFlight(id: string | undefined) {
  return useQuery({
    queryKey: ['flights', id],
    queryFn: () => getFlight(id!),
    enabled: !!id,
  });
}
