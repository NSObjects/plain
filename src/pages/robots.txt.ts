import type { APIRoute } from 'astro';
import { site as config } from '../config';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const base = import.meta.env.BASE_URL;
  // robots.txt is site-root scoped; GitHub Pages project paths require a root-level file to apply globally.
  const disallow = config.robots.toLowerCase().includes('noindex');
  const rules = disallow ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n';
  const sitemap = 'Sitemap: ' + new URL(base + 'sitemap.xml', origin).href + '\n';
  return new Response(rules + sitemap, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
