class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search"], input[name="q"], input[type="search"]').first();
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async search(product) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.searchInput.fill(product);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };