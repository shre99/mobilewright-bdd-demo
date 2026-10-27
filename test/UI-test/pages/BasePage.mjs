import { execSync } from 'node:child_process';
import { expect } from 'mobilewright';

const KEYCODE_ESCAPE = 111;

// Shared helpers for every page object. A helper used by 2+ pages belongs here.
export default class BasePage {
  constructor(screen) {
    this.screen = screen;
  }

  // Text is on screen (substring match by default; pass exact: true for a full match).
  async assertVisible(text, { timeout, exact } = {}) {
    await this.retryAssertion(
      () => expect(this.screen.getByText(text, { exact })).toBeVisible(timeout ? { timeout } : undefined),
      timeout,
    );
  }

  async assertHidden(text, { timeout, exact } = {}) {
    await this.retryAssertion(
      () => expect(this.screen.getByText(text, { exact })).toBeHidden(timeout ? { timeout } : undefined),
      timeout,
    );
  }

  async assertTestIdVisible(testId, { timeout } = {}) {
    await this.retryAssertion(
      () => expect(this.screen.getByTestId(testId)).toBeVisible(timeout ? { timeout } : undefined),
      timeout,
    );
  }

  // Locate by testID, then check the rendered text.
  async assertTestIdText(testId, text, { timeout } = {}) {
    await this.retryAssertion(
      () => expect(this.screen.getByTestId(testId)).toHaveText(text, timeout ? { timeout } : undefined),
      timeout,
    );
  }

  // Right after a cold app launch the first UI dump can fail before the first frame is drawn.
  // Retrying the whole assertion gives that the same grace period as "not visible yet".
  async retryAssertion(assertion, timeout) {
    const deadline = Date.now() + (timeout ?? 5_000);
    let lastError;
    do {
      try {
        await assertion();
        return;
      } catch (e) {
        lastError = e;
        await this.wait(300);
      }
    } while (Date.now() < deadline);
    throw lastError;
  }

  // Settle delays live here, never as a Gherkin step.
  async wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Hides the on-screen keyboard after typing. ESCAPE (not BACK) so the app is never sent
  // to the background if the keyboard is already closed.
  async hideKeyboard() {
    execSync(`adb shell input keyevent ${KEYCODE_ESCAPE}`, { stdio: 'ignore' });
  }
}
