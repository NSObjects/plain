import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({data}) => !data.draft);
  return new Response(JSON.stringify(posts.map(p => ({
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    url: import.meta.env.BASE_URL + 'posts/' + p.id + '/',
    date: p.data.publishedAt.toISOString()
  }))), {headers:{'Content-Type':'application/json; charset=utf-8'}});
};
