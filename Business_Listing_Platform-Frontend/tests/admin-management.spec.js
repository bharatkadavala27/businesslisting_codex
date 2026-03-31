import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
    // Wait for the common admin loader to disappear
    const loader = page.getByText(/Synchronizing/i);
    if (await loader.isVisible({ timeout: 2000 })) {
       await expect(loader).not.toBeVisible({ timeout: 15000 });
    }
    // Wait for the full page loader to disappear
    await expect(page.getByText(/Analyzing Platform Momentum/i)).not.toBeVisible({ timeout: 15000 });
  });

  test('Dashboard KPI visibility', async ({ page }) => {
    // Wait for at least one KPI to be visible
    await expect(page.getByText(/strategic overview/i).or(page.getByText(/market revenue/i))).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/user base/i)).toBeVisible();
    await expect(page.getByText(/leads today/i)).toBeVisible();
  });

  test('Dashboard elements', async ({ page }) => {
    // Check for KPI cards with actual labels from Dashboard.jsx
    await expect(page.getByText(/User Base/i)).toBeVisible();
    await expect(page.getByText(/Leads Today/i)).toBeVisible();
    await expect(page.getByText(/Market Revenue/i).or(page.getByText(/Market Growth/i))).toBeVisible();
    
    // Recent activity feed
    await expect(page.getByText(/Platform Pulse/i).or(page.getByText(/Recent activity/i))).toBeVisible();
  });

  test('User Management table and filters', async ({ page }) => {
    // Navigate to Users via Sidebar
    await page.getByRole('link', { name: /^users$/i }).click();
    await expect(page.getByText(/Identity & Access/i)).toBeVisible();
    
    // Check for the search input placeholder from Users.jsx
    await expect(page.getByPlaceholder(/Find by name/i)).toBeVisible();
    
    // Check table headers
    await expect(page.getByText(/User Identity/i)).toBeVisible();
    await expect(page.getByText(/Role \/ Access/i)).toBeVisible();
  });

  test('Export Intelligence Snapshot', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /intelligence export/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeEnabled();
    }
  });
});

test.describe('Admin Management - Users', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    // Wait for the specific loader in Users.jsx
    await expect(page.getByText(/Synchronizing Identity Data/i)).not.toBeVisible({ timeout: 20000 });
    // Ensure table header is present
    await expect(page.getByRole('heading', { name: /identity & access/i })).toBeVisible({ timeout: 10000 });
  });

  test('User list table and filters', async ({ page }) => {
    await expect(page.getByPlaceholder(/global search/i)).toBeVisible();
    // In Users.jsx, labels are: User Identity, Role / Access, Status, Activity, Joined
    await expect(page.getByText(/user identity/i).first()).toBeVisible();
    await expect(page.getByText(/role \/ access/i).first()).toBeVisible();
    await expect(page.getByText(/activity/i).first()).toBeVisible();
  });

  test('Search for a specific user', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/global search/i);
    await searchInput.fill('amit@gmail.com');
    // Wait for table to filter
    await page.waitForTimeout(1000); 
    await expect(page.getByText('Amit')).toBeVisible();
    await expect(page.getByText('amit@gmail.com')).toBeVisible();
  });
});

test.describe('Admin Management - Listings', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/listings');
    await expect(page.getByText(/Synchronizing Listing Data/i)).not.toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: /business listings/i }).or(page.getByText(/business listings/i))).toBeVisible();
  });

  test('Listings moderation table', async ({ page }) => {
    // In Listings.jsx, labels are: Business Name, Category & City, Status, Plan, Submitted
    await expect(page.getByText(/business name/i).first()).toBeVisible();
    await expect(page.getByText(/category & city/i).first()).toBeVisible();
    await expect(page.getByText(/status/i).first()).toBeVisible();
  });

  test('Apply status filter', async ({ page }) => {
    // Select Pending status
    const statusSelect = page.locator('select').first(); 
    await statusSelect.selectOption('Pending');
    await page.getByRole('button', { name: /apply filters/i }).click();
    // Table should refresh
    await expect(page.locator('table, .datatable')).toBeVisible();
  });
});
