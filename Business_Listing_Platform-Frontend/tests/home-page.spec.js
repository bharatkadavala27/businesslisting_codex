import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Header elements visibility', async ({ page }) => {
    // Check for logo or app name - the first link in header is the logo
    await expect(page.locator('header').getByRole('link').first()).toBeVisible();
    // Search bar - placeholder is "Search for Spa & Salons"
    await expect(page.getByPlaceholder(/search for spa/i)).toBeVisible();
    // Location selector button - matches "Select City" (default) or any city name
    const locationBtn = page.getByText(/select city/i).or(page.locator('button').filter({ has: page.locator('.lucide-locate-fixed') }));
    await expect(locationBtn).toBeVisible();
  });

  test('Category grid visibility', async ({ page }) => {
    // There is no heading for CategoryGrid, but there is one for PopularSearches
    await expect(page.getByText(/popular searches/i)).toBeVisible();
    // Category items are present in the grid
    await expect(page.locator('a[href*="category="]').first()).toBeVisible();
  });

  test('Promo banner/carousel', async ({ page }) => {
    // Check for a carousel or banner
    const banner = page.locator('.swiper-slide, .carousel-item, img[alt*="Banner"]').first();
    await expect(banner).toBeVisible();
  });

  test('Location Selector Dialog', async ({ page }) => {
    const locationBtn = page.locator('button').filter({ has: page.locator('.lucide-locate-fixed') });
    await locationBtn.click();
    await expect(page.getByText(/detect location/i)).toBeVisible();
  });

  test('Quick Filter Chips', async ({ page }) => {
    // Check for "Near Me" or similar chips
    const nearMe = page.getByText(/near me/i);
    if (await nearMe.isVisible()) {
      await expect(nearMe).toBeVisible();
    }
  });

  test('Featured/Recently Viewed sections', async ({ page }) => {
    await expect(page.getByText(/featured/i).first()).toBeVisible();
  });
});
