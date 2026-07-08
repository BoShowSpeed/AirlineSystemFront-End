# Airline Portal — Frontend ↔ Backend API Contract

This is the contract the **React frontend** codes against. The backend (Laravel)
should implement these endpoints and return **exactly these JSON shapes** so the
frontend needs no changes when switching from the mock API to the real one.

- **Base URL:** provided to the frontend via `VITE_API_URL` (e.g. `http://localhost:8000/api`).
- **Auth:** `Authorization: Bearer <token>` header (Laravel Sanctum token).
- **Content type:** `application/json`.
- **Errors:** always `{ "message": string, "errors"?: { field: string[] } }`
  with an appropriate HTTP status (401, 403, 404, 422, …).

> While the backend is under construction, these same endpoints are mocked in the
> browser with **MSW** (`src/mocks/handlers.ts`) using the existing demo data, so
> frontend work is not blocked. Toggle with `VITE_ENABLE_MOCKS` in `.env`.

---

## Shared response shapes

These mirror the TypeScript interfaces in `src/app/types.ts`. The API is expected
to return this **flat** shape (compose it from the normalized DB tables using
Laravel API Resources).

### Flight

```jsonc
{
  "id": "1",
  "number": "AV101",
  "origin": "New York",
  "originCode": "JFK",
  "destination": "London",
  "destinationCode": "LHR",
  "departureTime": "09:00",       // HH:mm
  "arrivalTime": "21:15",
  "date": "2026-06-15",           // YYYY-MM-DD
  "duration": "7h 15m",
  "class": "economy",             // economy | business | first_class
  "price": 489,
  "status": "scheduled",          // scheduled | boarding | delayed | departed | arrived | confirmed | cancelled
  "gate": "B12",
  "aircraft": "Boeing 777-300ER",
  "availableSeats": 42
}
```

(Other shapes — `Booking`, `Seat`, `StaffMember`, `Aircraft`, `User` — are defined
in `src/app/types.ts`; keep field names and enum values identical.)

---

## Endpoints

### Auth
| Method | Path                     | Body / Query                               | Returns |
| ------ | ------------------------ | ------------------------------------------ | ------- |
| POST   | `/auth/register`         | `{ name, email, password, phone? }`        | `{ token, user }` |
| POST   | `/auth/login`            | `{ email, password }`                      | `{ token, user }` |
| POST   | `/auth/logout`           | –                                          | `204` |
| GET    | `/auth/me`               | –                                          | `User` |
| PUT    | `/auth/change-password`  | `{ current_password, new_password }`       | `204` |

### Flights (implemented in the mock)
| Method | Path                | Query                                                        | Returns |
| ------ | ------------------- | ----------------------------------------------------------- | ------- |
| GET    | `/flights/search`   | `origin, destination, date, returnDate?, class, passengers, tripType` | `Flight[]` |
| GET    | `/flights/:id`      | –                                                           | `Flight` |
| GET    | `/flights/:id/seats`| –                                                           | `Seat[]` |

> Search params `origin`/`destination` arrive as labels like `"New York (JFK)"`.
> The mock matches on the IATA code in parentheses; the real API can do the same
> or accept explicit codes — coordinate the exact format with the frontend.

### Bookings
| Method | Path                       | Body / Query                    | Returns |
| ------ | -------------------------- | ------------------------------- | ------- |
| GET    | `/bookings`                | (current user's)                | `Booking[]` |
| GET    | `/bookings/:ref`           | –                               | `Booking` |
| POST   | `/bookings`                | `{ flightId, seat, passenger }` | `Booking` |
| POST   | `/bookings/:id/payment`    | `{ paymentMethod }`             | `Booking` (with `paymentStatus`) |
| GET    | `/bookings/:ref/ticket`    | –                               | boarding-pass payload |

### Staff (role: staff)
| Method | Path                        | Body                          | Returns |
| ------ | --------------------------- | ----------------------------- | ------- |
| GET    | `/staff/me/assignments`     | –                             | assignment list |
| GET    | `/staff/me/availability`    | –                             | `DayAvailability[]` |
| PUT    | `/staff/me/availability`    | `{ date, status, note? }`     | `DayAvailability` |

### Admin (role: admin)
| Method            | Path                              | Returns |
| ----------------- | --------------------------------- | ------- |
| GET/POST/PUT/DELETE | `/admin/flights[/:id]`          | `Flight` / `Flight[]` |
| GET/POST/PUT      | `/admin/staff[/:id]`              | `StaffMember` / `StaffMember[]` |
| GET/POST/PUT      | `/admin/aircraft[/:id]`           | `Aircraft` / `Aircraft[]` |
| POST              | `/admin/aircraft/:id/maintenance` | `MaintenanceLog` |
| GET               | `/admin/dashboard/kpis`           | dashboard metrics |

---

## Things to agree on with the frontend

1. **CORS** — allow the frontend origin (`http://localhost:5173` in dev).
2. **Auth transport** — Bearer token in header (assumed here), not cookie sessions.
3. **Pagination** — envelope + `?page=` for the admin list endpoints.
4. **Airport format** — codes vs. `"City (XXX)"` labels for search.
5. **Enum values** — must match `src/app/types.ts` exactly (e.g. `first_class`, `on-leave`).
