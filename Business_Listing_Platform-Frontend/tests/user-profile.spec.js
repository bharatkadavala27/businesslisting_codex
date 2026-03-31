import { test, expect } from '@playwright/test';

test.describe('User Profile & Personal Space', () => {
  // Use regular user storage state
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('Profile page layout and data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /public profile/i })).toBeVisible();
    await expect(page.locator('input[name="name"]').or(page.locator('input[placeholder="John Doe"]'))).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveAttribute('readonly', '');
  });

  test('Update profile information', async ({ page }) => {
    const nameInput = page.locator('input[placeholder="John Doe"]').or(page.locator('input[required]').first());
    const originalName = await nameInput.inputValue();
    const newName = originalName + ' Updated';
    
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.getByText(/changes saved/i)).toBeVisible();
    
    // Revert change
    await nameInput.fill(originalName);
    await page.getByRole('button', { name: /save changes/i }).click();
  });

  test('Navigation to My Reviews', async ({ page }) => {
    // Assuming there's a sidebar or tab for My Reviews
    const reviewsLink = page.getByRole('link', { name: /my reviews/i }).or(page.getByText(/my reviews/i));
    if (await reviewsLink.isVisible()) {
      await reviewsLink.click();
      await expect(page.getByRole('heading', { name: /my reviews/i }).or(page.getByText(/reviews/i))).toBeVisible();
    }
  });

  test('Navigation to Security Settings', async ({ page }) => {
    const securityLink = page.getByRole('link', { name: /security/i }).or(page.getByText(/security/i));
    if (await securityLink.isVisible()) {
      await securityLink.click();
      await expect(page.getByText(/change password/i).or(page.getByText(/security/i))).toBeVisible();
    }
  });
});
