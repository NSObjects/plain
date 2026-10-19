import { defineConfig } from 'astro/config';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const isPages = Boolean(process.env.GITHUB_ACTIONS);
export default defineConfig({
  site: process.env.SITE_URL ?? (isPages ? `https://${owner}.github.io` : 'http://localhost:4321'),
  base: process.env.BASE_PATH ?? (isPages && repo !== `${owner}.github.io` ? `/${repo}` : '/'),
  trailingSlash: 'always',
});
