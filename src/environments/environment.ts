import { timeout } from "rxjs";

export const environment = {
  production: false,
  apiBaseUrl: '/api',
    urlClio: 'https://app.clio.com/api/v4',
  auth: {
    mock: true,
    idle: {
      timeoutMs: 5 * 60 * 1000, // 15 minutes
      warningDurationMs: 1 * 60 * 1000 // 2 minutes
    }
   },
   paralegalSearchApi: 'Paralegal Colombia'
};

