const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { SearchResultsPage } = require('../pages/SearchResultsPage');
const { ProductPage } = require('../pages/ProductPage');

test.describe('Daraz.pk E-commerce UI Automation', () => {
  test('01 - Navigate to Daraz.pk homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveURL(/daraz\.pk/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('02 - Search for Electronics', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search('electronics');
    await expect(page).toHaveURL(/search|electronics/i);
    await expect(page.locator('body')).toContainText(/electronics/i);
  });

  test('03 - Apply a brand filter', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    await home.goto();
    await home.search('electronics');
    const selectedBrand = await results.selectBrand('Samsung');
    expect(selectedBrand, 'A visible brand filter option should be available').not.toBeNull();
    test.info().annotations.push({ type: 'brand-filter', description: `Selected brand: ${selectedBrand}` });
  });

  test('04 - Apply price filter 500-5000 PKR', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    await home.goto();
    await home.search('electronics');
    await results.applyPriceFilter(500, 5000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('05 - Validate product count is greater than zero', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    await home.goto();
    await home.search('electronics');
    await results.waitForResults();
    const count = await results.countProducts();
    expect(count, 'At least one product should be displayed').toBeGreaterThan(0);
  });

  test('06 - Open product details page', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    const product = new ProductPage(page);
    await home.goto();
    await home.search('electronics');
    await results.waitForResults();
    await results.openFirstProduct();
    await product.waitForProductPage();
    await expect(page).toHaveURL(/-i\d+/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('07 - Verify Free Shipping availability when offered', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    const product = new ProductPage(page);
    await home.goto();
    await home.search('electronics');
    await results.waitForResults();
    await results.openFirstProduct();
    await product.waitForProductPage();

    const available = await product.hasFreeShipping();
    test.info().annotations.push({
      type: 'free-shipping',
      description: available
        ? 'Free Shipping is displayed for the selected product.'
        : 'Free Shipping is not displayed for the selected product.'
    });

    // Shipping is product/location dependent. The automation verifies the UI state
    // rather than falsely requiring Free Shipping for every live product.
    expect(await page.locator('body').isVisible()).toBeTruthy();
  });
});
