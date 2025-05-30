const nxPreset = require('@nx/jest/preset').default

module.exports = {
  ...nxPreset,
  bail: false,
  collectCoverage: false,
  coverageReporters: ['clover', 'json', 'text', 'lcov', 'text-summary', 'html'],
}
