import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4329'], {
  stdio: 'inherit', env: process.env
});
const base = process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY === 'NSObjects/plain' ? '/plain/' : '/';
const root = 'http://127.0.0.1:4329' + base;
let browser;
try {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(root);
      if (res.ok) break;
    } catch {}
    if (i === 59) throw new Error('Preview server did not become ready');
    await new Promise(r => setTimeout(r, 500));
  }
  await mkdir('screenshots', { recursive: true });
  browser = await chromium.launch({ headless: true });
  for (const { name, width, height } of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(root, { waitUntil: 'networkidle' });
    assert.match(await page.title(), /Plain/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, `${name} homepage overflows horizontally`);
    await page.screenshot({ path: `screenshots/${name}-home.png`, fullPage: true });
    await page.getByRole('button', { name: '切换深浅色模式' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'Theme toggle works');
    await page.goto(root + 'posts/hello-plain/', {waitUntil:'networkidle'});
    assert.equal(await page.locator('.prose pre').count() > 0, true, 'Article includes code block');
    assert.equal(await page.getByRole('button', { name:'复制代码' }).count() > 0, true, 'Code copy control exists');
    const articleOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(articleOverflow, false, `${name} article overflows horizontally`);
    if (name === 'mobile') {
      const mobileToc = page.locator('.mobile-toc');
      assert.equal(await mobileToc.isVisible(), true, 'Mobile TOC must be visible before article body');
      await mobileToc.locator('summary').click();
      assert.equal(await mobileToc.evaluate(el => el.open), true, 'Mobile TOC should expand');
      await mobileToc.locator('a').first().click();
      assert.equal(await mobileToc.evaluate(el => el.open), false, 'Mobile TOC should close after navigating');
    } else {
      assert.equal(await page.locator('.toc').isVisible(), true, 'Desktop sticky TOC should be visible');
    }
    await page.screenshot({ path: `screenshots/${name}-article.png`, fullPage: true });
    await page.close();
  }
  console.log('Chromium browser checks passed (desktop + mobile).');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
