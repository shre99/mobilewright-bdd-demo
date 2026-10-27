import { execSync } from 'node:child_process';
import { setWorldConstructor, setDefaultTimeout, Before, After } from '@cucumber/cucumber';
import { android } from 'mobilewright';
import config from '../../../../mobilewright.config.mjs';
import AppHeader from '../../pages/AppHeader.mjs';
import CatalogPage from '../../pages/CatalogPage.mjs';
import LoginPage from '../../pages/LoginPage.mjs';

setDefaultTimeout(config.timeout ?? 30_000);

function isAppInstalled() {
  const packages = execSync(`adb shell pm list packages ${config.bundleId}`).toString();
  return packages.includes(config.bundleId);
}

// Each scenario starts from a clean app. If the app is already installed, clearing its data
// is much faster than reinstalling it. The APK is only installed when it is missing.
function prepareApp() {
  if (!isAppInstalled()) return config.installApps;
  execSync(`adb shell pm clear ${config.bundleId}`, { stdio: 'ignore' });
  return undefined;
}

class MobileWorld {
  async launch() {
    const installApps = prepareApp();
    this.device = await android.launch({
      bundleId: config.bundleId,
      deviceId: config.deviceId,
      installApps,
    });
    this.screen = this.device.screen;

    // One instance of every page object per scenario, shared with the step definitions.
    this.appHeader = new AppHeader(this.screen);
    this.catalogPage = new CatalogPage(this.screen);
    this.loginPage = new LoginPage(this.screen);
  }

  async teardown() {
    await this.device?.close();
  }
}

setWorldConstructor(MobileWorld);

Before(async function () {
  await this.launch();
});

After(async function () {
  await this.teardown();
});
