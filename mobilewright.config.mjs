import { defineConfig } from 'mobilewright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// When a device is picked with MOBILE_DEVICE_ID, point every plain `adb` call (Driver.mjs,
// BasePage.mjs) at the same device. Without this, adb fails with "more than one device"
// when a phone and an emulator are both connected.
if (process.env.MOBILE_DEVICE_ID && !process.env.ANDROID_SERIAL) {
  process.env.ANDROID_SERIAL = process.env.MOBILE_DEVICE_ID;
}

export default defineConfig({
  platform: 'android',
  // Sauce Labs My Demo App (public demo app). APK is downloaded by `npm run setup`.
  bundleId: 'com.saucelabs.mydemoapp.android',
  // Leave MOBILE_DEVICE_ID unset to use the first online emulator/device (auto-discovery).
  // Set it to an adb serial (e.g. emulator-5554 or 192.168.1.20:5555) to pick one.
  ...(process.env.MOBILE_DEVICE_ID && { deviceId: process.env.MOBILE_DEVICE_ID }),
  // Must be absolute: mobilecli installs the app from its own working directory,
  // so a relative path fails with "adb: failed to stat ... No such file or directory".
  installApps: join(__dirname, 'test/UI-test/App/Android/mda.apk'),
  timeout: 30_000,
});
