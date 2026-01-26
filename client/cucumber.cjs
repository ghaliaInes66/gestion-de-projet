module.exports = {
  default: {
    import: [
      'tests/support/world.js',
      'tests/support/hooks.js',
      'tests/step_definitions/*.js'
    ],
    paths: ['tests/features/*.feature'],
    format: ['progress', 'html:tests/reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  },
  e2e: {
    import: [
      'tests/support/world.js',
      'tests/support/hooks.js',
      'tests/step_definitions/*.js'
    ],
    format: ['progress', 'html:tests/reports/e2e-report.html'],
    paths: ['tests/features/*.feature']
  }
};
