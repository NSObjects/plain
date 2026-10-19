import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const file = (path) => readFileSync(join('dist', path), 'utf8');
const required = ['index.html', 'about/index.html', 'search/index.html',
  'tags/index.html', 'tags/入门/index.html',
  'posts/hello-plain/index.html', 'posts/technical-typography/index.html', 'search-index.json', 'rss.xml', 'sitemap.xml', 'robots.txt'];
for (const path of required) {
  assert.ok(existsSync(join('dist', path)), `Missing generated file: ${path}`);
}
const home = file('index.html');
const article = file('posts/hello-plain/index.html');
for (const [name, html] of [['home', home], ['article', article]]) {
  assert.match(html, /property="og:title"/, `${name} should include Open Graph title`);
  assert.match(html, /property="og:description"/, `${name} should include Open Graph description`);
  assert.match(html, /property="og:url"/, `${name} should include canonical Open Graph URL`);
  assert.match(html, /name="twitter:card"/, `${name} should include Twitter card metadata`);
  assert.match(html, /name="robots"/, `${name} should declare robots preference`);
}
const search = JSON.parse(file('search-index.json'));
const rss = file('rss.xml');
const sitemap = file('sitemap.xml');
const robots = file('robots.txt');
assert.match(sitemap, /<urlset/, 'Sitemap should be valid URL set XML');
assert.match(sitemap, /posts\/technical-typography\//, 'Sitemap includes published technical post');
assert.match(sitemap, /tags\/Go\//, 'Sitemap includes tag pages');
assert.match(robots, /Sitemap: /, 'Robots advertises sitemap');
const bilingual = file('posts/technical-typography/index.html');
assert.match(bilingual, /技术文章排版示例/, 'Chinese heading should render');
assert.match(bilingual, /<table>/, 'Technical table should render');
assert.match(bilingual, /context\.Context/, 'Inline code should render');
assert.match(home, /欢迎使用 Plain/, 'The published article should appear on the homepage');
assert.match(article, /Hello, Plain!/, 'Go code example should render');
assert.match(file('tags/index.html'), /tags\/%E5%85%A5%E9%97%A8\//, 'Tag link should URL-encode Unicode');
assert.match(file('tags/入门/index.html'), /欢迎使用 Plain/, 'Tag listing should include article');
assert.match(article, /文章目录/, 'Article TOC should render');
assert.ok(search.some(p => p.title === '欢迎使用 Plain'), 'Search index should include published posts');
assert.match(rss, /<rss version="2.0">/, 'RSS output should be valid RSS structure');
assert.match(rss, /欢迎使用 Plain/, 'RSS should include published posts');
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const base = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS && repo !== `${owner}.github.io` ? `/${repo}` : '/');
assert.ok(home.includes(`href="${base === '/' ? '/' : base + '/'}posts/hello-plain/"`), 'Post link must respect GitHub Pages base path');
assert.ok(search.some(p => p.url.startsWith(base === '/' ? '/posts/' : base + '/posts/')), 'Search index URLs must respect the base path');
assert.ok(rss.includes(base === '/' ? '/posts/' : base + '/posts/'), 'RSS URLs must respect the base path');
assert.ok(sitemap.includes(base === '/' ? '/posts/' : base + '/posts/'), 'Sitemap URLs must respect base path');
assert.ok(robots.includes(base === '/' ? '/sitemap.xml' : base + '/sitemap.xml'), 'Robots sitemap URL must respect base path');
console.log('Plain smoke test passed: pages, article, search, tags, RSS, base path');
