const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^bcrypt$': '<rootDir>/src/modules/users/__mocks__/bcrypt-mock.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
