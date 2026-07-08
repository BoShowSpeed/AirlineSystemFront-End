import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';

/** Start the MSW mock API when enabled (dev, no real backend yet). */
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'true') return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

function render() {
  createRoot(document.getElementById('root')!).render(<App />);
}

// Always render the app, even if the mock worker fails to start — otherwise a
// mock-setup error would leave the page blank.
enableMocking()
  .catch((err) => console.error('[mocks] failed to start:', err))
  .finally(render);
