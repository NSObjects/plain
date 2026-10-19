import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config';
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const GET: APIRoute = async ({site:origin})=>{
  const base=import.meta.env.BASE_URL;
  const host=origin ?? new URL('http://localhost:4321');
  const posts=(await getCollection('posts',({data})=>!data.draft)).sort((a,b)=>b.data.publishedAt.getTime()-a.data.publishedAt.getTime());
  const link=new URL(base,host).href;
  const items=posts.map(p=>{
    const url=new URL(base+'posts/'+p.id+'/',host).href;
    return `<item><title>${esc(p.data.title)}</title><link>${esc(url)}</link><guid>${esc(url)}</guid><pubDate>${p.data.publishedAt.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`;
  }).join('');
  const xml=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)}</title><link>${esc(link)}</link><description>${esc(site.description)}</description><language>${esc(site.locale)}</language>${items}</channel></rss>`;
  return new Response(xml,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
};
