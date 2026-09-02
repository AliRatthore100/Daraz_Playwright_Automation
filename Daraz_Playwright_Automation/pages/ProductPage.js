class ProductPage {
  constructor(page) {
    this.page = page;
    this.freeShipping = page.getByText(/free shipping/i).first();
  }

  async waitForProductPage() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async hasFreeShipping() {
    return await this.freeShipping.isVisible().catch(() => false);
  }
}

module.exports = { ProductPage };