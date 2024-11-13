import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // or 'node' depending on your environment
  setupFiles: ['./jest.setup.ts'], // Add the setup file here
  moduleNameMapper: {
    '\\.(svg|jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js', // For static assets like images
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343], // Ignore TypeScript diagnostics (if necessary)
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta', // Mock import.meta for Jest
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
        tsconfig: 'tsconfig.json', // Use your TypeScript config
        useESM: true,  // If you're using ESM modules
        babelConfig: true,  // Use Babel for additional transformations (if needed)
        plugins: ['babel-plugin-transform-vite-meta-env'], // Ensure Vite's import.meta.env is transformed
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!axios)"  // If you need to transform dependencies like axios
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // globals section should be removed entirely
};

export default config;
