import { test, expect } from '@playwright/test';

test.describe('Search & Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('Search results headers and layout', async ({ page }) => {
    // Wait for initial load if it shows up
    const loader = page.getByText(/Gathering the best options/i);
    if (await loader.isVisible({ timeout: 2000 })) {
      await expect(loader).not.toBeVisible({ timeout: 15000 });
    }
    
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('button', { name: /show map view/i })).toBeVisible();
  });

  test('Filters and Sorting UI', async ({ page }) => {
    // Check for filter button or sidebar
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await expect(page.getByText(/sort by/i)).toBeVisible();
    }
  });

  test('Result card elements', async ({ page }) => {
    await expect(page.getByText(/Gathering the best options/i)).not.toBeVisible({ timeout: 10000 });
    // Check for the first listing card
    const firstListing = page.locator('article, .business-card, .listing-card').first();
    if (await firstListing.isVisible()) {
      await expect(firstListing.getByRole('heading')).toBeVisible();
      await expect(firstListing.getByText(/stars/i).or(firstListing.locator('.rating'))).toBeVisible();
    }
  });

  test('Map View Toggle', async ({ page }) => {
    await page.getByRole('button', { name: /show map view/i }).click();
    await expect(page.getByText(/geographic discovery/i)).toBeVisible();
    await expect(page.locator('.leaflet-container, .mapboxgl-map, div[id*="map"]')).toBeVisible();
  });
});
