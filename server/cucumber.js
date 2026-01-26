module.exports = {
  default: {
    require: ['tests/step_definitions/**/*.js', 'tests/support/**/*.js'],
    paths: ['tests/features/**/*.feature'],
    format: ['progress', 'html:tests/reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
