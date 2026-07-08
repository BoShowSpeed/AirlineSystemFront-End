import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** The MSW worker that intercepts requests in the browser during development. */
export const worker = setupWorker(...handlers);
