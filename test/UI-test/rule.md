# Gherkin and framework rules

1. **Rule / Example, not a flat Scenario list.** Group examples under the business rule they prove.
2. **Named persona.** Every step says "Vijay", never "I".
3. **Self-contained examples.** Each Example sets up its own state. Nothing carries over from the previous one.
4. **Same steps, different data** → use a `Scenario Outline` with an `Examples` table.
5. **No timing in Gherkin.** Never "wait 5 seconds". Waits live inside page-object methods (`BasePage.wait`).
6. **Steps route through the dispatchers in `commonSteps.mjs`.** A new field or button adds a `case`, not a new step definition. Every switch has a `default` that throws.
7. **One page object per screen**, all extending `BasePage`. Shared UI (header, menu) gets its own object.
8. **Locators live in `constants/testIds.mjs`.** No locators in step definitions. Prefer IDs over visible text, and never use coordinates or XPath when an ID exists.

## Folder structure

```
test/UI-test/
├── E2E0/                     feature files, one folder per feature area
│   └── login/01.login.feature
├── step-definitions/
│   ├── commonSteps.mjs       keyword dispatchers
│   └── support/Driver.mjs    World + Before/After hooks
├── pages/                    page objects
│   ├── BasePage.mjs
│   ├── AppHeader.mjs
│   ├── CatalogPage.mjs
│   └── LoginPage.mjs
├── constants/testIds.mjs     all locators
├── App/Android/              APK under test (downloaded by npm run setup)
└── rule.md                   this file
```
