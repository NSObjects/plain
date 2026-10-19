import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const base = import.meta.env.BASE_URL;
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap(post => post.data.tags))];
  const paths = [
    '', 'about/', 'search/', 'tags/',
    ...posts.map(post => 'posts/' + post.id + '/'),
    ...tags.map(tag => 'tags/' + encodeURIComponent(tag) + '/'),
  ];
  const entries = paths.map(path =>
    '<url><loc>' + escapeXml(new URL(base + path, origin).href) + '</loc></url>'
  ).join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries + '</urlset>', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
