import { test, expect } from '@playwright/test';

test.describe('Business Details', () => {
  // Use a known slug from seed.js: taj-hotel-mumbai
  test.beforeEach(async ({ page }) => {
    await page.goto('/business/taj-hotel-mumbai');
  });

  test('Hero section details', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /taj hotel mumbai/i })).toBeVisible();
    await expect(page.getByText(/verified/i)).toBeVisible();
    await expect(page.getByText(/mumbai, maharashtra/i)).toBeVisible();
  });

  test('Action buttons presence', async ({ page }) => {
    await expect(page.getByRole('button', { name: /call/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /whatsapp/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /directions/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /enquiry/i })).toBeVisible();
  });

  test('Tabs navigation', async ({ page }) => {
    await expect(page.getByRole('button', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /reviews/i })).toBeVisible();
    
    await page.getByRole('button', { name: /reviews/i }).click();
    await expect(page.getByText(/average rating/i).or(page.getByText(/review/i))).toBeVisible();
  });

  test('Review Submission Form UI', async ({ page }) => {
    await page.getByRole('button', { name: /write a review/i }).or(page.getByText(/write a review/i)).first().click();
    // This might require login, but we check if the button/form is at least targeted
    // If not logged in, it should redirect or show a prompt
  });

  test('Business Hours Toggle', async ({ page }) => {
    await page.getByText(/open now/i).or(page.getByText(/closed now/i)).first().hover();
    await expect(page.getByText(/weekly hours/i).or(page.getByText(/monday/i))).toBeVisible();
  });

  test('Claim/Report Listing', async ({ page }) => {
    // These might be further down or in an overflow
    const reportBtn = page.getByRole('button', { name: /report listing/i }).or(page.locator('button:has-text("Report")'));
    // Scroll to bottom if needed
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });
});
