export default {
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/__test__/**/*.spec.ts'],
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
