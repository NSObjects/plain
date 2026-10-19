import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4329'], {
  stdio: 'inherit', env: process.env
});
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isPages = Boolean(process.env.GITHUB_ACTIONS && owner && repo);
const configuredBase = process.env.BASE_PATH ??
  (isPages && repo !== `${owner}.github.io` ? `/${repo}` : '/');
const base = configuredBase.endsWith('/') ? configuredBase : configuredBase + '/';
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
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN', 'Document language should be declared');
    assert.equal(await page.locator('main#main').count(), 1, 'Main landmark must exist');
    assert.equal(await page.locator('header nav[aria-label]').count(), 1, 'Navigation should have accessible name');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(node => node === document.activeElement), true, 'Skip link must be first keyboard focus');
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#main', 'Skip link must jump to main landmark');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, `${name} homepage overflows horizontally`);
    await page.screenshot({ path: `screenshots/${name}-home.png`, fullPage: true });
    await page.getByRole('button', { name: '切换深浅色模式' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'Theme toggle works');
    await page.goto(root + 'posts/hello-plain/', {waitUntil:'networkidle'});
    assert.equal(await page.locator('.prose pre').count() > 0, true, 'Article includes code block');
    assert.equal(await page.getByRole('button', { name:'复制代码' }).count() > 0, true, 'Code copy control exists');
    const codeLanguage = page.locator('.prose pre .code-language').first();
    assert.equal(await codeLanguage.textContent(), 'GO', 'Language label should show Go');
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
    const topLink = page.getByRole('link', { name: '返回顶部' });
    assert.equal(await topLink.isVisible(), true, 'Back-to-top link should be visible');
    await page.locator('.prose h2[id]').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.toc a.active, .mobile-toc a.active').count() > 0, true, 'Current section should be highlighted');
    await page.screenshot({ path: `screenshots/${name}-article.png`, fullPage: true });
    await page.goto(root + 'posts/technical-typography/', {waitUntil: 'networkidle'});
    assert.equal(await page.locator('.prose table').count(), 1, 'Technical table should render');
    assert.equal(await page.locator('h1').count(), 1, 'Page should have a single primary heading');
    assert.equal(await page.locator('a:not([href])').count(), 0, 'Links must have href attributes');
    assert.equal(await page.locator('.prose pre').count(), 2, 'Code blocks should render');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${name} bilingual article overflows horizontally`);
    await page.screenshot({ path: `screenshots/${name}-typography.png`, fullPage: true });
    await page.close();
  }
  console.log('Chromium browser checks passed (desktop + mobile).');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
