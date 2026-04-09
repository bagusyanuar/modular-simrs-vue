import { createHttpClient } from '@genrs/http';

/**
 * Shared HTTP Client for Infrastructure layer.
 * Uses environment variables for configuration.
 */
export const httpClient = createHttpClient({
  baseURL: import.meta.env.VITE_GLOBAL_API_BASE_URL || 'http://neurovi-simulation.test:8000/api',
  timeout: 15000,
});

export default httpClient;
