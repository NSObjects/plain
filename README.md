# Plain

**A quiet Astro theme for people who build software.**

Plain is a reusable developer blog starter, not a ready-made personal site. It favours readable articles, clean code blocks and stable page layouts over decorative UI.

## Features

- Fast static Astro pages, Markdown content collections and Shiki syntax highlighting
- Comfortable responsive typography, article table of contents and dark mode
- Configurable site title, intro, locale, heading, navigation and author
- Chinese and English technical examples, responsive About page
- Lightweight search, tag pages and RSS feed
- Code copy, language labels, active article TOC and mobile collapsible TOC
- GitHub Pages deployment workflow, sitemap, robots.txt, and Open Graph / Twitter Card metadata

## Getting started

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

Edit `src/config.ts` to customize the title, locale, heading, intro, author, GitHub link and navigation. Set `site.locale` to `zh-CN` or `en-US` for article date formatting. Navigation labels and About page copy are currently Chinese by default and can be edited in the corresponding components.

To start from GitHub, use **Use this template** if the repository owner has enabled it; otherwise fork or clone the repository. In your new repository, enable **Settings → Pages → Build and deployment → GitHub Actions**. Push to `main` and check the deployment workflow. Replace the included sample posts before publishing your own content.

```md
---
title: "My first post"
description: "A short summary"
publishedAt: 2026-10-19
tags: ["Go", "Architecture"]
---

Your Markdown content here.
```

Only posts with `draft: false` (the default) are published.

## Before publishing

1. Update `src/config.ts` (site name, description, author, links, navigation).
2. Delete or replace the two example articles in `src/content/posts/`.
3. Enable GitHub Pages with **GitHub Actions** as source and push `main`.
4. Confirm links, RSS, sitemap and social metadata on your deployed URL.

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

The `.github/workflows/deploy.yml` workflow deploys `main` to GitHub Pages. In repository Settings → Pages, choose **GitHub Actions** as the build and deployment source.

For public deployment, set `site.author`, `site.description`, and optionally `site.socialImage` in `src/config.ts`. Set `site.robots` to `noindex, nofollow` for non-public previews. A social image should be a publicly accessible URL; if unset, the theme uses the compact summary card without an image. 
 
The generated `sitemap.xml` lists published posts and tag pages and respects the configured deployment base path. The generated `robots.txt` advertises the sitemap. **Note:** on GitHub Pages project sites (such as `/plain/`), robots.txt is served under the project prefix and does not control the host-wide root robots policy; use an apex/custom domain or user-site root to make robots.txt authoritative. 
 
For a repository named `username.github.io`, Astro uses a root URL. For a project repository, it uses the repository name as the base path. `SITE_URL` and `BASE_PATH` environment variables can override these values for custom domains.

## Design direction

- Minimal UI, not minimal functionality
- Long-form Chinese and English technical reading
- Code, tables and diagrams should never force a horizontal page overflow
- Accessible keyboard navigation and mobile layouts

## Roadmap

- [x] Home, posts, About and table of contents
- [x] Dark mode and Markdown syntax highlighting
- [x] Search by title, description and tags; tag pages and RSS
- [x] Copy code, language labels and active table of contents
- [x] Basic Open Graph and Twitter Card metadata 
- [x] Sitemap and robots.txt generation 
- [ ] Archive view
- [ ] Full-body search and image zoom
- [ ] Mermaid support and complete bilingual typography review
- [ ] Browser visual regression and accessibility checks

## License

MIT

## Quality checks

```bash
npm run check
npm run build
node scripts/smoke.mjs
```

GitHub Actions additionally runs Chromium against mobile and desktop viewports. The included bilingual sample articles exercise code, tables, links and mixed CJK/Latin typography. CI screenshots are attached as workflow artifacts.
