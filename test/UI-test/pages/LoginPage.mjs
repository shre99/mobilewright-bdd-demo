import BasePage from './BasePage.mjs';
import { testIds } from '../constants/testIds.mjs';

export default class LoginPage extends BasePage {
  async assertDisplayed() {
    await this.assertTestIdText(testIds.login.title, 'Login', { timeout: 10_000 });
    await this.assertTestIdVisible(testIds.login.loginButton);
  }

  async enterUsername(username) {
    await this.screen.getByTestId(testIds.login.usernameInput).fill(username);
    await this.hideKeyboard();
  }

  async enterPassword(password) {
    await this.screen.getByTestId(testIds.login.passwordInput).fill(password);
    await this.hideKeyboard();
  }

  async tapLogIn() {
    // tap() waits for the button to be visible, enabled and stable. No sleep needed.
    await this.screen.getByTestId(testIds.login.loginButton).tap();
  }

  async assertUsernameError(message) {
    await this.assertTestIdText(testIds.login.usernameError, message);
  }

  async assertPasswordError(message) {
    await this.assertTestIdText(testIds.login.passwordError, message);
  }
}
