import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const file = (path) => readFileSync(join('dist', path), 'utf8');
const required = ['index.html', 'about/index.html', 'search/index.html',
  'tags/index.html', 'tags/Getting started/index.html',
  'posts/hello-plain/index.html', 'search-index.json', 'rss.xml'];
for (const path of required) {
  assert.ok(existsSync(join('dist', path)), `Missing generated file: ${path}`);
}
const home = file('index.html');
const article = file('posts/hello-plain/index.html');
const search = JSON.parse(file('search-index.json'));
const rss = file('rss.xml');
assert.match(home, /Welcome to Plain/, 'The published article should appear on the homepage');
assert.match(article, /Hello, Plain!/, 'Go code example should render');
assert.match(file('tags/index.html'), /tags\/Getting%20started\//, 'Tag link should URL-encode spaces');
assert.match(file('tags/Getting started/index.html'), /Welcome to Plain/, 'Tag listing should include article');
assert.match(article, /文章目录/, 'Article TOC should render');
assert.ok(search.some(p => p.title === 'Welcome to Plain'), 'Search index should include published posts');
assert.match(rss, /<rss version="2.0">/, 'RSS output should be valid RSS structure');
assert.match(rss, /Welcome to Plain/, 'RSS should include published posts');
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const base = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS && repo !== `${owner}.github.io` ? `/${repo}` : '/');
assert.ok(home.includes(`href="${base === '/' ? '/' : base + '/'}posts/hello-plain/"`), 'Post link must respect GitHub Pages base path');
assert.ok(search.some(p => p.url.startsWith(base === '/' ? '/posts/' : base + '/posts/')), 'Search index URLs must respect the base path');
assert.ok(rss.includes(base === '/' ? '/posts/' : base + '/posts/'), 'RSS URLs must respect the base path');
console.log('Plain smoke test passed: pages, article, search, tags, RSS, base path');
