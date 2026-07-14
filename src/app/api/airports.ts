import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

/** Raw airport record as returned by the Laravel backend. */
interface RawAirport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

/** Laravel paginator envelope: `{ data: [...], current_page, last_page, ... }`. */
interface Paginated<T> {
  data: T[];
}

/** Format a backend airport as the "City (IATA)" label the UI selects use. */
function toAirportLabel(a: RawAirport): string {
  return `${a.city} (${a.iata_code})`;
}

/**
 * GET /airports — the list of airports as "City (IATA)" labels, sorted.
 * Requests a large page so the dropdown holds every airport in one call.
 */
export async function getAirports(): Promise<string[]> {
  const { data } = await apiClient.get<Paginated<RawAirport>>('/airports', {
    params: { per_page: 100 },
  });
  return data.data.map(toAirportLabel).sort((a, b) => a.localeCompare(b));
}

/** Query hook for airport dropdowns. Returns `[]` until loaded. */
export function useAirports() {
  return useQuery({
    queryKey: ['airports'],
    queryFn: getAirports,
    staleTime: 1000 * 60 * 60, // airports rarely change
  });
}
