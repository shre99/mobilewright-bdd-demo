import BasePage from './BasePage.mjs';
import { testIds } from '../constants/testIds.mjs';

export default class CatalogPage extends BasePage {
  async assertDisplayed() {
    // First screen after a cold start (splash first), so allow longer than the 5 s default.
    await this.assertTestIdText(testIds.catalog.title, 'Products', { timeout: 20_000 });
  }
}
