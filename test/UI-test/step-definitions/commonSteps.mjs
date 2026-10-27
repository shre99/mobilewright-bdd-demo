import { Given, When, Then } from '@cucumber/cucumber';

// Keyword dispatchers: every Gherkin step routes through one of these into a page-object
// method. A new screen or field adds a `case` here, not a new step definition.
// No locators in this file: they belong to the page objects.

// ── 1. Navigation ──────────────────────────────────────────────────────────────
const SCREENS = {
  catalog: (world) => world.catalogPage.assertDisplayed(),
  login: (world) => world.loginPage.assertDisplayed(),
};

function resolveScreen(world, screenName) {
  const resolve = SCREENS[screenName];
  if (!resolve) throw new Error(`Unknown screen "${screenName}" — add it to SCREENS in commonSteps.mjs`);
  return resolve(world);
}

Given('Vijay is on the {string} screen', async function (screenName) {
  await resolveScreen(this, screenName);
});

Then('Vijay is redirected to the {string} screen', async function (screenName) {
  await resolveScreen(this, screenName);
});

// ── 2. Data entry ──────────────────────────────────────────────────────────────
When('Vijay enters the {string} as {string}', async function (fieldType, value) {
  switch (fieldType) {
    case 'username':
      await this.loginPage.enterUsername(value);
      break;
    case 'password':
      await this.loginPage.enterPassword(value);
      break;
    default:
      throw new Error(`Unknown data entry field "${fieldType}" — add a case to commonSteps.mjs`);
  }
});

// ── 3. Tap actions ─────────────────────────────────────────────────────────────
When('Vijay taps the {string}', async function (target) {
  switch (target) {
    case 'menu button':
      await this.appHeader.openMenu();
      break;
    case 'log in menu item':
      await this.appHeader.tapLogInMenuItem();
      break;
    case 'login button':
      await this.loginPage.tapLogIn();
      break;
    default:
      throw new Error(`Unknown tap target "${target}" — add a case to commonSteps.mjs`);
  }
});

// ── 4. Confirmation ────────────────────────────────────────────────────────────
Then('Vijay confirms the {string}', async function (assertionType) {
  switch (assertionType) {
    case 'log out menu item':
      await this.appHeader.assertLogOutMenuItemVisible();
      break;
    default:
      throw new Error(`Unknown confirmation "${assertionType}" — add a case to commonSteps.mjs`);
  }
});

// Value-carrying variant: checks a specific piece of text.
Then('Vijay confirms the {string} as {string}', async function (assertionType, value) {
  switch (assertionType) {
    case 'username error':
      await this.loginPage.assertUsernameError(value);
      break;
    case 'password error':
      await this.loginPage.assertPasswordError(value);
      break;
    default:
      throw new Error(`Unknown confirmation "${assertionType}" — add a case to commonSteps.mjs`);
  }
});
