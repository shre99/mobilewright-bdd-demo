# Mobilewright BDD Demo

A reference project for mobile UI automation with **Mobilewright** + **Cucumber (Gherkin)** + **Page Object Model**. The tests target the public [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android) for Android.

**You don't need an emulator or a phone.** Everything in the hands-on runs offline: a Cucumber dry run, plus a step-key check that confirms every Gherkin step is wired to code.

There are two ways to go through it:

| Option | How |
|---|---|
| **A. Do it yourself** | Go through Steps 1 to 5 in order. Each step has its commands and a **Verify** line. |
| **B. Let Claude help** | Open this repo in Claude Code (or paste this file into Claude) with the master prompt below. Each step also has a small **Ask Claude** prompt if you get stuck on one step. |

> **Master prompt for Claude:**
> ```
> I'm doing the hands-on in this repo's README. Go through Steps 1 to 5 in order.
> For each step: run its commands, run its Verify check, and show me the output.
> Before writing any test code, read CLAUDE.md and test/UI-test/rule.md and follow them
> exactly. Don't install an emulator, Android Studio or the APK; this hands-on is
> offline only. Explain each layer in one or two plain sentences as we go.
> Stop and ask me before changing anything outside this repo.
> ```

**Do the steps in order.** Each one builds on the previous.

---

## Progress checklist

- [ ] 1. Prerequisites
- [ ] 2. Clone and set up
- [ ] 3. Understand the folder structure
- [ ] 4. Follow one step through the layers
- [ ] 5. Exercise: add the Cart screen

---

## Step 1: Prerequisites

- **Node.js 18 or later**
- **Git**
- **VS Code** (optional: the official *Cucumber* extension, for Gherkin highlighting and Ctrl+click from a step to its code)

**Verify:** `node -v && git --version` prints a Node version of 18 or higher and a Git version.

> **Ask Claude:** "Check whether Node.js 18+ and Git are installed on my machine. If Node is missing or older, help me install Node 22 with nvm. `node -v` shows: <paste>."

---

## Step 2: Clone and set up (one command)

```bash
git clone https://github.com/shre99/mobilewright-bdd-demo.git
cd mobilewright-bdd-demo
npm run setup
```

`npm run setup` runs `npm install` and then `npm run check`, which does two offline checks:

1. `bdd:dry-run`: Cucumber matches every Gherkin step to a step definition without opening an app.
2. `check:steps`: every quoted key in a feature file (like `"login button"`) has a matching `case` in `commonSteps.mjs`.

**Verify:** the output ends with

```
4 scenarios (4 skipped)
29 steps (29 skipped)
All 29 step keys have a matching dispatcher case.
```

`skipped` is expected: a dry run doesn't execute the steps.

> **Ask Claude:** "I ran `npm run setup` in mobilewright-bdd-demo and got this error: <paste>. Help me fix it without installing an emulator."

---

## Step 3: Understand the folder structure

```
mobilewright-bdd-demo/
├── CLAUDE.md                 rules for AI assistants working in this repo
├── mobilewright.config.mjs   platform, app id, device, APK path, timeout
├── cucumber.js               Cucumber profiles (default + android)
├── scripts/
│   ├── check-steps.mjs       offline check: every step key has a dispatcher case
│   ├── run-android.sh        (device runs only) finds/boots a device, runs Cucumber
│   ├── download-apk.mjs      (device runs only) downloads the demo APK
│   └── living-doc.mjs        builds the HTML report from Cucumber JSON
└── test/UI-test/
    ├── E2E0/                 WHAT: feature files in plain English, one folder per area
    │   └── login/01.login.feature
    ├── step-definitions/
    │   ├── commonSteps.mjs   GLUE: keyword dispatchers (sentence → page method)
    │   └── support/Driver.mjs  World + Before/After hooks (launch, clean, close)
    ├── pages/                HOW: one page object per screen, all extend BasePage
    │   ├── BasePage.mjs  AppHeader.mjs  CatalogPage.mjs  LoginPage.mjs
    ├── constants/testIds.mjs every locator in one place
    ├── App/Android/          APK under test (device runs only)
    └── rule.md               Gherkin and framework rules
```

The layers, top to bottom. Each layer only talks to the one below it:

| Layer | File(s) | Responsible for |
|---|---|---|
| Feature | `E2E0/**/*.feature` | Business behaviour in plain English |
| Step definitions | `commonSteps.mjs` | Sentence → page-object method |
| Page objects | `pages/*.mjs` | Actions and assertions on one screen |
| Locators | `constants/testIds.mjs` | Every ID in one place |
| World / hooks | `support/Driver.mjs` | Launch the app, create page objects, close |
| Config | `mobilewright.config.mjs` | Device, app, timeouts |

**Verify:** you can say which folder a new screen's page object goes in, and where its IDs go.

> **Ask Claude:** "Explain the folder structure of this repo layer by layer, in plain language, using test/UI-test/rule.md and CLAUDE.md. Keep it short."

---

## Step 4: Follow one step through the layers

Open `test/UI-test/E2E0/login/01.login.feature` and follow this step:

```
01.login.feature      When Vijay taps the "login button"
commonSteps.mjs       case 'login button': await this.loginPage.tapLogIn()
LoginPage.mjs         this.screen.getByTestId(testIds.login.loginButton).tap()
testIds.mjs           loginButton: rid('loginBtn')
```

Then break it on purpose:

1. In the feature file, change `"login button"` to `"login buton"`.
2. Run `npm run check:steps`. It prints the file and line of every broken step.
3. Write a sentence with no step definition, for example `When Vijay opens the cart`, and run `npm run check:steps` again.
4. Undo both changes.

**Verify:** `npm run check` passes again after you undo.

> **Ask Claude:** "Trace the step `When Vijay taps the "login button"` from the feature file down to the locator, showing the exact lines in each file."

---

## Step 5: Exercise: add the Cart screen

**Goal:** add a feature where Vijay opens an empty cart, then make `npm run check` pass by touching every layer.

```gherkin
# test/UI-test/E2E0/cart/01.cart.feature
Feature: Cart
  Shoppers review the items in their cart.

  Rule: An empty cart must tell Vijay there is nothing in it

    Example: Vijay opens the cart before adding anything
      Given Vijay is on the "catalog" screen
      When Vijay taps the "cart button"
      Then Vijay is redirected to the "cart" screen
```

Changes, layer by layer:

1. `constants/testIds.mjs`: add `header.cartButton: rid('cartRL')` and `cart.emptyTitle: rid('noItemTitleTV')`.
2. `pages/AppHeader.mjs`: add `openCart()`.
3. `pages/CartPage.mjs` (new): `assertDisplayed()` checks that `cart.emptyTitle` shows `No Items`.
4. `step-definitions/support/Driver.mjs`: create `this.cartPage`.
5. `step-definitions/commonSteps.mjs`: add `case 'cart button'` and a `cart` entry in `SCREENS`.

**Verify:** `npm run check` shows `5 scenarios (5 skipped)` and `All 32 step keys have a matching dispatcher case.`

> **Ask Claude:** "Do Step 5 of the README. Follow CLAUDE.md and test/UI-test/rule.md exactly: feature first, then testIds, page object, Driver, then a case in commonSteps.mjs. No locators in step definitions, no new step definition files. Then run `npm run check` and show me the output."

<details>
<summary>Solution</summary>

```js
// constants/testIds.mjs
header: { menuButton: rid('menuIV'), cartButton: rid('cartRL') },
cart: { emptyTitle: rid('noItemTitleTV') },

// pages/AppHeader.mjs
async openCart() {
  await this.screen.getByTestId(testIds.header.cartButton).tap();
}

// pages/CartPage.mjs
import BasePage from './BasePage.mjs';
import { testIds } from '../constants/testIds.mjs';

export default class CartPage extends BasePage {
  async assertDisplayed() {
    await this.assertTestIdText(testIds.cart.emptyTitle, 'No Items');
  }
}

// step-definitions/support/Driver.mjs
import CartPage from '../../pages/CartPage.mjs';
this.cartPage = new CartPage(this.screen);

// step-definitions/commonSteps.mjs
cart: (world) => world.cartPage.assertDisplayed(),   // in SCREENS
case 'cart button':                                  // in the tap switch
  await this.appHeader.openCart();
  break;
```
</details>

---

## Optional: run on an emulator or a physical device

Not part of the offline hands-on. Do this only if you want to watch the tests drive the real app. You need Android Studio (it installs the Android SDK, `adb` and the emulator).

### A. One-time setup (both options)

1. Install Android Studio from https://developer.android.com/studio and open it once so it downloads the SDK.
2. Put `adb` and `emulator` on your PATH:

   **macOS** (add to `~/.zshrc`, then run `source ~/.zshrc`):
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
   ```
   **Linux** (add to `~/.bashrc`, then run `source ~/.bashrc`):
   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
   ```
3. Download the demo app and check your machine:
   ```bash
   npm run app:download
   npm run test:doctor
   ```

**Verify:** `adb version` and `emulator -version` both print a version.

### B. Run on an emulator

1. Create one: Android Studio → **Device Manager** → **Create device** → pick a phone or tablet → pick a system image (API 34 or newer) → Finish.
2. List and start it from the terminal (or press ▶ in Device Manager):
   ```bash
   emulator -list-avds              # e.g. Pixel_8_API_35
   emulator -avd Pixel_8_API_35 &
   adb devices                      # shows: emulator-5554   device
   ```
3. Run the tests:
   ```bash
   npm run test:android
   ```
   If no device is online, `test:android` boots the first emulator for you. To choose which one: `AVD_NAME=Pixel_8_API_35 npm run test:android`.

### C. Run on a physical Android device

First, on the phone or tablet:

1. **Settings → About phone → tap "Build number" 7 times** to turn on Developer options.
2. **Settings → System → Developer options** → turn on **USB debugging** (and **Wireless debugging** if you'll use Wi-Fi).

**Option 1: USB cable**
```bash
# connect the cable, then tap "Allow" on the "Allow USB debugging?" prompt on the device
adb devices                        # shows: R58N12ABCDE   device
```
If it shows `unauthorized`, unlock the device and accept the prompt. If it shows nothing, try another cable or USB port.

**Option 2: Wi-Fi (Android 11+, phone and computer on the same network)**
```bash
# On the device: Developer options → Wireless debugging → "Pair device with pairing code".
# It shows an IP:port and a 6-digit code.
adb pair 192.168.1.20:37099        # use the pairing IP:port, then type the 6-digit code

# Back on the Wireless debugging screen, note the IP:port under "IP address & Port".
adb connect 192.168.1.20:41235     # this connect port is different from the pairing port
adb devices                        # shows: 192.168.1.20:41235   device
```
The connect port changes when the device restarts or Wireless debugging is toggled. Run `adb connect` again with the new port.

**Run the tests on that device**
```bash
MOBILE_DEVICE_ID=R58N12ABCDE npm run test:android          # USB: serial from adb devices
MOBILE_DEVICE_ID=192.168.1.20:41235 npm run test:android   # Wi-Fi: IP:port from adb devices
```
`MOBILE_DEVICE_ID` picks the device when more than one is connected (for example a phone and an emulator). With only one device online you can leave it out.

### D. After a run

```bash
npm run report       # HTML report → living-documentation/index.html
npm run inspect      # Mobilewright Inspector in the browser: click an element to see its id
```

> **Ask Claude:** "Help me run this repo's tests on my <emulator / USB phone / Wi-Fi phone>. `adb devices` shows: <paste>. `npm run test:android` shows: <paste>."

### Device troubleshooting

| Symptom | Fix |
|---|---|
| `adb: command not found` | PATH isn't set. Redo step A.2 and open a new terminal. |
| `adb devices` shows `unauthorized` | Unlock the device and tap **Allow** on the USB debugging prompt. |
| `more than one device/emulator` | Set `MOBILE_DEVICE_ID=<serial>` as shown above. |
| Wi-Fi device drops off | Re-run `adb connect <ip>:<new port>` from the Wireless debugging screen. |
| Every locator fails, screen is black | Unlock the screen. `test:android` also runs `adb shell input keyevent 224` and `adb shell wm dismiss-keyguard`. |
| No element found by ID | Run `npm run inspect` and compare the resource-id with `constants/testIds.mjs` (see the comment at the top of that file). |

## All commands

| Command | What it does |
|---|---|
| `npm run setup` | `npm install` + `npm run check` |
| `npm run check` | Dry run + step-key check (offline) |
| `npm run bdd:dry-run` | Cucumber dry run only |
| `npm run check:steps` | Step-key check only |
| `npm run app:download` | Download the demo APK (device runs) |
| `npm run devices` | List connected emulators and devices |
| `npm run test:doctor` | Check Android SDK, adb and devices |
| `npm run test:android` | Run features on an emulator or device (`MOBILE_DEVICE_ID` to pick one) |
| `npm run inspect` | Mobilewright Inspector (device runs) |
| `npm run report` | Build the HTML living documentation |

## Links

- Mobilewright docs: https://mobilewright.dev/docs
- Mobilewright on GitHub: https://github.com/mobile-next/mobilewright
- Gherkin reference: https://cucumber.io/docs/gherkin/reference/
- Cucumber.js: https://github.com/cucumber/cucumber-js
