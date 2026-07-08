# Multi-role web app design

A React single-page application for a flight booking and management platform,
with separate experiences for passengers, staff (pilot, copilot, cabin crew,
technician, manager), and administrators.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** for dev server and bundling
- **react-router** for routing
- **Tailwind CSS v4** with **shadcn/ui** (Radix UI) components
- **Recharts**, **MUI icons**, **lucide-react**, **motion**, and related UI libraries

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server (http://localhost:5173):

```bash
npm run dev
```

## Scripts

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                   |
| `npm run build`     | Build for production into `dist/`           |
| `npm run preview`   | Preview the production build locally        |
| `npm run typecheck` | Type-check the project with `tsc` (no emit) |

## Project structure

```
src/
  main.tsx              App entry point
  app/
    App.tsx             Root component (router + context providers)
    routes.ts           Route definitions
    context/            App-wide React context
    layouts/            Root and admin layouts
    pages/              Route pages (passenger, staff/, admin/)
    components/         Shared components + ui/ (shadcn/ui primitives)
    data/               Mock data
  styles/               Global CSS, Tailwind, theme, fonts
```
