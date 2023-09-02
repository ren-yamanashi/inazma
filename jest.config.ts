export default {
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: ['<rootDir>/src/__tests__/**/*.spec.ts'],
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
