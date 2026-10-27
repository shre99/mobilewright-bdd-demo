import { readFileSync } from 'node:fs';
import { generate } from 'multiple-cucumber-html-reporter';
import config from '../mobilewright.config.mjs';

const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

generate({
  jsonDir: 'reports/',
  reportPath: 'living-documentation/',
  saveCollectedJSON: true,
  pageTitle: 'Mobilewright BDD Demo',
  reportName: 'Mobilewright BDD Demo - Living Documentation',
  metadata: {
    device: config.deviceId ?? 'first online device',
    platform: { name: 'Android', version: '' },
    app: { name: config.bundleId, version: '' },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: `${name} ${version}` },
      { label: 'App', value: 'Sauce Labs My Demo App' },
    ],
  },
});

console.log('Report written to living-documentation/index.html');
