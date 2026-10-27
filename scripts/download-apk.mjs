// Downloads the public Sauce Labs My Demo App APK into test/UI-test/App/Android/mda.apk.
// Skips the download when the file is already there.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APK_URL =
  'https://github.com/saucelabs/my-demo-app-android/releases/download/2.3.0/mda-2.3.0-27.apk';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'test/UI-test/App/Android/mda.apk');

if (existsSync(target)) {
  console.log(`APK already present: ${target}`);
  process.exit(0);
}

console.log(`Downloading My Demo App APK...\n  ${APK_URL}`);
const res = await fetch(APK_URL);
if (!res.ok) {
  console.error(`Download failed: HTTP ${res.status}. Download it manually from`);
  console.error('https://github.com/saucelabs/my-demo-app-android/releases');
  console.error(`and save it as ${target}`);
  process.exit(1);
}
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, Buffer.from(await res.arrayBuffer()));
console.log(`Saved to ${target}`);
