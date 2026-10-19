# Plain

**A quiet Astro theme for people who build software.**

Plain is a reusable developer blog starter, not a ready-made personal site. It favours readable articles, clean code blocks and stable page layouts over decorative UI.

## Features

- Fast static Astro pages, Markdown content collections and Shiki syntax highlighting
- Comfortable responsive typography, article table of contents and dark mode
- Configurable site information and navigation
- Sample article and About page
- GitHub Pages deployment workflow

## Getting started

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

Edit `src/config.ts` to customize the title, intro, author, GitHub link and navigation. Replace the sample post in `src/content/posts/`.

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

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

The `.github/workflows/deploy.yml` workflow deploys `main` to GitHub Pages. In repository Settings → Pages, choose **GitHub Actions** as the build and deployment source.

For a repository named `username.github.io`, Astro uses a root URL. For a project repository, it uses the repository name as the base path. `SITE_URL` and `BASE_PATH` environment variables can override these values for custom domains.

## Design direction

- Minimal UI, not minimal functionality
- Long-form Chinese and English technical reading
- Code, tables and diagrams should never force a horizontal page overflow
- Accessible keyboard navigation and mobile layouts

## Roadmap

- [x] Home, posts, About and table of contents
- [x] Dark mode and Markdown syntax highlighting
- [ ] Search, tagging and archives
- [ ] RSS, sitemap and social metadata
- [ ] Copy code and image zoom
- [ ] Mermaid support and complete bilingual typography review
- [ ] Browser visual regression and accessibility checks

## License

MIT
