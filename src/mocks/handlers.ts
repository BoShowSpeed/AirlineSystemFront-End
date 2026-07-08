import { http, HttpResponse, delay } from 'msw';
import { MOCK_FLIGHTS, MOCK_USERS } from '../app/data/mockData';
import type { User } from '../app/types';

/**
 * MSW request handlers — an in-browser stand-in for the Airline API.
 *
 * These match the agreed API contract (see docs/api-contract.md) so that when
 * the real Laravel backend is ready you can flip VITE_ENABLE_MOCKS to false and
 * point VITE_API_URL at it — no frontend code changes.
 *
 * The leading wildcard on each path makes handlers match regardless of whether
 * VITE_API_URL is relative ("/api") or absolute ("http://localhost:8000/api").
 */

/** Extract an IATA code like "JFK" from a label like "New York (JFK)". */
function iata(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/\(([A-Za-z]{3})\)/);
  return match ? match[1].toUpperCase() : null;
}

// ---- Fake auth helpers ------------------------------------------------------
// A mock token just carries the user id so /auth/me can resolve the session.
const TOKEN_PREFIX = 'mock-token-';
const makeToken = (userId: string) => `${TOKEN_PREFIX}${userId}`;
const userIdFromToken = (token: string | null) =>
  token && token.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;

function bearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

// Users created via /auth/register this session (not persisted across reload).
const registeredUsers: User[] = [];
const findById = (id: string) =>
  MOCK_USERS.find((u) => u.id === id) ?? registeredUsers.find((u) => u.id === id);
const findByEmail = (email: string) =>
  MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
  registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

export const handlers = [
  // ---- Auth ----------------------------------------------------------------
  // POST /auth/login  (any password accepted for demo accounts)
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(300);
    const { email } = (await request.json()) as { email: string; password: string };
    const user = findByEmail(email);
    if (!user) {
      return HttpResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    return HttpResponse.json({ token: makeToken(user.id), user });
  }),

  // POST /auth/register
  http.post('*/api/auth/register', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { name: string; email: string; phone?: string; password: string };
    if (findByEmail(body.email)) {
      return HttpResponse.json(
        { message: 'An account with this email already exists.', errors: { email: ['Email already taken.'] } },
        { status: 422 },
      );
    }
    const user: User = {
      id: `u${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: 'passenger',
      initials: body.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    };
    registeredUsers.push(user);
    return HttpResponse.json({ token: makeToken(user.id), user }, { status: 201 });
  }),

  // GET /auth/me  (restores a session from the Bearer token)
  http.get('*/api/auth/me', ({ request }) => {
    const id = userIdFromToken(bearerToken(request));
    const user = id ? findById(id) : undefined;
    if (!user) {
      return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
    }
    return HttpResponse.json(user);
  }),

  // POST /auth/logout
  http.post('*/api/auth/logout', async () => {
    await delay(100);
    return new HttpResponse(null, { status: 204 });
  }),

  // PUT /auth/change-password
  http.put('*/api/auth/change-password', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { current_password: string; new_password: string };
    if (!body.new_password || body.new_password.length < 6) {
      return HttpResponse.json(
        { message: 'Password does not meet requirements.', errors: { new_password: ['Must be at least 6 characters.'] } },
        { status: 422 },
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ---- Flights -------------------------------------------------------------
  // GET /flights/search?origin=&destination=&date=&class=&passengers=
  http.get('*/api/flights/search', async ({ request }) => {
    await delay(300); // simulate network latency so loading states are visible
    const url = new URL(request.url);
    const origin = iata(url.searchParams.get('origin'));
    const destination = iata(url.searchParams.get('destination'));

    let results = MOCK_FLIGHTS;
    if (origin) results = results.filter((f) => f.originCode === origin);
    if (destination) results = results.filter((f) => f.destinationCode === destination);

    return HttpResponse.json(results);
  }),

  // GET /flights/:id
  http.get('*/api/flights/:id', async ({ params }) => {
    await delay(200);
    const flight = MOCK_FLIGHTS.find((f) => f.id === params.id);
    if (!flight) {
      return HttpResponse.json({ message: 'Flight not found' }, { status: 404 });
    }
    return HttpResponse.json(flight);
  }),
];
