import dotenv from 'dotenv';
dotenv.config();  // Load .env file for testing environment

// Mocking import.meta.env for Jest tests
(globalThis as any).import = {
  meta: {
    env: {
      VITE_API_URL: 'mock-api-url',
      VITE_API_KEY: 'mock-api-key',
      VITE_API_SECRET: 'mock-api-secret',
    },
  },
};
