import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Sign Up Flow - UI Elements', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /create a new account/i })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="mobileNumber"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('Login Flow - Email UI', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /phone/i })).toBeVisible();
    
    // Default is email
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('Login Flow - Phone UI', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /phone/i }).click();
    await expect(page.locator('input[name="mobileNumber"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /send otp/i })).toBeVisible();
  });

  test('Forgot Password Flow - UI', async ({ page }) => {
    await page.goto('/forgot-password');
    // The heading is "Reset Password"
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
    // It uses mobile number input (tel) instead of email
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset otp/i })).toBeVisible();
  });
});
