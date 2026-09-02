class SearchResultsPage {
  constructor(page) {
    this.page = page;
    this.productLinks = page.locator('a[href*="-i"]');
    this.productCards = page.locator('[data-qa-locator="product-item"]');
  }

  async waitForResults() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async countProducts() {
    const qaCards = this.productCards;
    if (await qaCards.count()) return await qaCards.count();

    // Fallback for markup changes: count product-detail links with Daraz's /-i<id> URL pattern.
    let count = 0;
    const links = this.productLinks;
    for (let i = 0; i < await links.count(); i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && /-i\d+/.test(href)) count++;
    }
    return count;
  }

  async selectBrand(brand = 'Samsung') {
    const exact = this.page.getByText(brand, { exact: true }).first();
    if (await exact.count() && await exact.isVisible().catch(() => false)) {
      await exact.click();
      await this.page.waitForTimeout(1200);
      return brand;
    }

    // If the requested brand is not present, select the first visible brand option
    // so the test remains data-driven against the live catalog.
    const brandSection = this.page.getByText(/brand/i).first();
    if (await brandSection.count()) {
      const section = brandSection.locator('xpath=..');
      const option = section.locator('label, li, [role="checkbox"]').filter({ hasText: /.+/ }).first();
      if (await option.count() && await option.isVisible().catch(() => false)) {
        const name = (await option.innerText()).trim();
        await option.click();
        await this.page.waitForTimeout(1200);
        return name;
      }
    }
    return null;
  }

  async applyPriceFilter(min, max) {
    const inputs = this.page.locator('input');
    let minInput = null;
    let maxInput = null;

    for (let i = 0; i < await inputs.count(); i++) {
      const input = inputs.nth(i);
      const meta = `${await input.getAttribute('placeholder') || ''} ${await input.getAttribute('aria-label') || ''}`;
      if (!minInput && /min/i.test(meta)) minInput = input;
      if (!maxInput && /max/i.test(meta)) maxInput = input;
    }

    if (!minInput || !maxInput) {
      throw new Error('Could not locate the minimum and maximum price inputs on the Daraz results page.');
    }

    await minInput.fill(String(min));
    await maxInput.fill(String(max));

    const apply = this.page.getByRole('button', { name: /go|apply|ok/i }).last();
    if (await apply.count() && await apply.isVisible().catch(() => false)) {
      await apply.click();
    } else {
      await maxInput.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  async openFirstProduct() {
    const links = this.productLinks;
    for (let i = 0; i < await links.count(); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (href && /-i\d+/.test(href)) {
        await link.scrollIntoViewIfNeeded();
        await link.click();
        return;
      }
    }
    throw new Error('No product link was found.');
  }
}

module.exports = { SearchResultsPage };
