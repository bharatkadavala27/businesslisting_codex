import { test as setup, expect } from '@playwright/test';
import path from 'path';

const adminFile = 'playwright/.auth/admin.json';
const userFile = 'playwright/.auth/user.json';

setup('authenticate as super admin', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="email"]').fill('admin@gmail.com');
  await page.locator('input[name="password"]').fill('admin@123');
  await page.locator('button[type="submit"]').click();

  // Wait for navigation to dashboard - Super Admin role redirects here
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as regular user', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input[name="email"]').fill('amit@example.com');
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('button[type="submit"]').click();

  // Regular user redirects to home /
  await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
  
  await page.context().storageState({ path: userFile });
});
