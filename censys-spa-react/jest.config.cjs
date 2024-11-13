module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use Node environment to support import.meta
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.app.json' }], // Explicitly use tsconfig.node.json for Jest
    '^.+\\.(svg)$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};
