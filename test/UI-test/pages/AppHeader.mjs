import BasePage from './BasePage.mjs';
import { testIds, menuItems } from '../constants/testIds.mjs';

// The header and side menu are shared by every screen, so they get their own object.
export default class AppHeader extends BasePage {
  async openMenu() {
    await this.screen.getByTestId(testIds.header.menuButton).tap();
  }

  async tapLogInMenuItem() {
    await this.screen.getByText(menuItems.logIn, { exact: true }).tap();
  }

  async assertLogOutMenuItemVisible() {
    await this.assertVisible(menuItems.logOut, { exact: true });
  }
}
