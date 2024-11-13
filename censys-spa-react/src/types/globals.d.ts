import dotenv from 'dotenv';
dotenv.config();  // Load .env file for testing environment

// Mock import.meta.env for Jest
globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'mock-api-url',
      VITE_API_KEY: process.env.VITE_API_KEY || 'mock-api-key',
      VITE_API_SECRET: process.env.VITE_API_SECRET || 'mock-api-secret'
    }
  }
};
