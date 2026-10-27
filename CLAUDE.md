# CLAUDE.md

Instructions for Claude (and other AI assistants) working in this repo.

## What this repo is

A training reference for mobile UI automation: Mobilewright + Cucumber (Gherkin) + Page Object Model, testing the public Sauce Labs My Demo App (Android, package `com.saucelabs.mydemoapp.android`). The hands-on is **offline**: no emulator, no APK, no Android Studio. Don't install any of those unless the user explicitly asks for the optional device run.

## Before writing or changing any test code

1. Read `test/UI-test/rule.md`. It's the source of truth for Gherkin and framework rules.
2. Read the existing file in the same layer and copy its style.
3. After any change, run `npm run check` and show the output. Work isn't done until it passes.

## How to add a test, in this order

1. **Feature** in `test/UI-test/E2E0/<area>/NN.<name>.feature`.
   - `Feature:` + one-line summary, then `Rule:` blocks, then `Example:` under each rule.
   - Persona is always **Vijay**, never "I".
   - Each Example is self-contained: start from `Given Vijay is on the "catalog" screen`.
   - Reuse the existing sentence shapes only:
     - `Given/Then Vijay is on / is redirected to the "<screen>" screen`
     - `When Vijay enters the "<field>" as "<value>"`
     - `When Vijay taps the "<target>"`
     - `Then Vijay confirms the "<thing>"` / `Then Vijay confirms the "<thing>" as "<value>"`
   - Keys inside quotes are lowercase words, e.g. `"cart button"`.
   - No waits or timings in Gherkin.
2. **Locators** in `test/UI-test/constants/testIds.mjs`, using `rid('<resource-id name>')`. Never put a locator anywhere else.
3. **Page object** in `test/UI-test/pages/<Screen>Page.mjs`: one class per screen, `extends BasePage`, methods named for the action (`openCart`, `tapLogIn`, `assertDisplayed`). Shared UI (header, menu) goes in `AppHeader.mjs`.
4. **World** in `test/UI-test/step-definitions/support/Driver.mjs`: import the page and create it in `launch()` as `this.<screen>Page`.
5. **Dispatcher** in `test/UI-test/step-definitions/commonSteps.mjs`: add a `case` to the matching switch, or a key in `SCREENS`. Don't add a new `Given/When/Then` definition or a new step file unless no existing sentence shape fits, and ask the user first.

## Hard rules

- No locators in step definitions.
- No XPath or coordinates when an ID exists.
- Every switch keeps its `default` that throws an error naming `commonSteps.mjs`.
- ESM only: `.mjs` files with `import`, never `require`.
- Keep `npm run check` green.

## Finding IDs for a new screen

The app's layouts are public: https://github.com/saucelabs/my-demo-app-android/tree/main/app/src/main/res/layout. Use the `android:id` value (e.g. `@+id/cartRL` → `rid('cartRL')`) and the visible text from `res/values/strings.xml`.
