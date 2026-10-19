import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { previewBase } from './preview-base.mjs';

const root = 'http://127.0.0.1:4331' + previewBase(process.env);
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4331'], { stdio: 'inherit', env: process.env });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(root)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'English preview did not start');
  browser = await chromium.launch({ headless: true });
  for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}]) {
    const page = await browser.newPage({ viewport });
    await page.goto(root, {waitUntil: 'networkidle'});
    assert.equal(await page.locator('html').getAttribute('lang'), 'en-US');
    await page.getByRole('heading', { name: 'Latest post' }).waitFor();
    await page.getByRole('link', { name: 'Learn more' }).waitFor();
    assert.ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'English homepage overflows');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.goto(root + 'search/', {waitUntil: 'networkidle'});
    await page.getByRole('searchbox', { name: 'Keywords' }).fill('Plain');
    await page.getByRole('status').getByText(/Found 1 posts/).waitFor();
    await page.goto(root + 'posts/hello-plain/', {waitUntil: 'networkidle'});
    await page.getByRole('button', { name: 'Copy code' }).waitFor();
    await page.getByRole('link', { name: 'Back to top' }).waitFor();
    await page.getByText('Table of contents').first().waitFor();
    assert.ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'English article overflows');
    await page.close();
  }
  console.log('English locale browser checks passed.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
