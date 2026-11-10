const { test, expect } = require('@playwright/test');

const url = '/?variantId=123&tags=classic,bright,spark,critter';
const values = ['Au Authenticity', 'Fm Family', 'Em Empathy', 'U Unity', 'He Health'];

async function chooseClassic(page) {
  await page.getByRole('radio', { name: 'Classic', exact: true }).check();
}

async function selectFive(page) {
  for (const value of values) {
    await page.getByRole('button', { name: value, exact: true }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(url);
});

test('shows the requested styles and opens the customizer', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Design your TRUme logo' })).toBeVisible();
  for (const style of ['Classic', 'Bright', 'Spark', 'Critter']) {
    await expect(page.getByRole('radio', { name: style, exact: true })).toBeVisible();
  }
  await chooseClassic(page);
  await expect(page.getByRole('radio', { name: 'Classic', exact: true })).toBeChecked();
  await expect(page.getByRole('region', { name: 'Core values' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm design' })).toBeDisabled();
});

test('requires five values, enforces the limit, and allows removal', async ({ page }) => {
  await chooseClassic(page);
  await selectFive(page);
  await expect(page.getByText('All five values chosen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm design' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Du Duty', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Remove Health' }).click();
  await expect(page.getByRole('button', { name: 'Confirm design' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Du Duty', exact: true })).toBeEnabled();
});

test('reorders and clears selected values', async ({ page }) => {
  await chooseClassic(page);
  await selectFive(page);
  const list = page.getByRole('list', { name: 'Your core values' });
  await page.getByRole('button', { name: 'Move Family up' }).click();
  await expect(list.getByRole('listitem').nth(0)).toContainText('Family');
  await expect(list.getByRole('listitem').nth(1)).toContainText('Authenticity');
  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page.getByText('0 of 5 values chosen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm design' })).toBeDisabled();
});

test('filters values and lets the customer choose a palette', async ({ page }) => {
  await chooseClassic(page);
  await page.getByRole('searchbox', { name: 'Search core values' }).fill('Kindness');
  await expect(page.getByRole('button', { name: 'K Kindness', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Au Authenticity', exact: true })).toHaveCount(0);
  await page.getByRole('radio', { name: 'Palette', exact: true }).check();
  await page.getByRole('radio', { name: 'green palette' }).check();
  await expect(page.getByRole('radio', { name: 'green palette' })).toBeChecked();
});
