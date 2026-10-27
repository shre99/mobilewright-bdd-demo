module.exports = {
  default: [
    'test/UI-test/E2E0/**/*.feature',
    '--import test/UI-test/step-definitions/**/*.mjs',
    `--format json:reports/cucumber-report-${Date.now()}.json`,
    '--format summary',
    '--format progress-bar',
  ].join(' '),
  // Used by scripts/run-android.sh. cucumber-js merges a profile's own paths with the
  // paths given on the CLI, so this profile has no hardcoded path: running one feature
  // file then runs only that file.
  android: [
    '--import test/UI-test/step-definitions/**/*.mjs',
    `--format json:reports/cucumber-report-${Date.now()}.json`,
    '--format summary',
    '--format progress-bar',
  ].join(' '),
};
