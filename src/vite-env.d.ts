/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Airline API (e.g. "/api" or "http://localhost:8000/api"). */
  readonly VITE_API_URL: string;
  /** "true" to enable the in-browser MSW mock API. */
  readonly VITE_ENABLE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
