# Plain

一个为开发者设计的轻量级 [Astro](https://astro.build/) 博客主题。专注中文 / 英文技术文章、代码阅读和简洁的排版。

[在线预览](https://nsobjects.github.io/plain/) · [最新版本](https://github.com/NSObjects/plain/releases/latest) · [通过模板创建博客](https://github.com/new?template_name=plain&template_owner=NSObjects)

## 功能

- 响应式首页、文章页、关于页与深色模式
- Markdown 文章、Shiki 代码高亮、代码复制与语言标识
- 桌面端目录、移动端折叠目录、当前章节高亮
- 按文章标题、摘要及标签搜索；标签页面和 RSS
- Sitemap、robots.txt、Open Graph / Twitter Card 元数据
- GitHub Pages 自动部署与桌面 / 手机端浏览器测试

> Plain 是**完整的 Astro 网站模板**，不是 WordPress、Hexo 或 Hugo 的安装式主题。通过 GitHub Template 创建自己的仓库后，你可以独立维护文章与配置。

## 1. 创建博客仓库

点击 [**Use this template**](https://github.com/new?template_name=plain&template_owner=NSObjects)，创建一个新仓库。常见命名方式：

| 仓库名 | 预期网站地址 |
| --- | --- |
| `USERNAME.github.io` | `https://USERNAME.github.io/` |
| `my-blog` | `https://USERNAME.github.io/my-blog/` |

将 `USERNAME` 替换为你的 GitHub 用户名。**使用用户名根站点仓库**可以得到更短的网址；也可以采用任意项目仓库名。

## 2. 本地启动

需要 Node.js **22+**。

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY
npm install
npm run dev
```

将 `USERNAME/REPOSITORY` 替换为你刚创建的仓库，访问 http://localhost:4321/ 预览。

## 3. 修改站点信息

编辑 `src/config.ts`，修改博客名称、作者、首页文案、社交链接与导航：

```ts
export const site = {
  name: '我的技术博客',
  locale: 'zh-CN',
  heading: '记录技术与思考',
  eyebrow: 'ENGINEERING NOTES',
  description: '分享 Go、系统架构与工程实践',
  author: 'Your Name',
  socialImage: '', // 可选：社交分享图片的公开 URL
  robots: 'index, follow',
  intro: '记录软件工程中的实践与经验。',
  links: { github: 'https://github.com/USERNAME' },
  nav: [
    { label: '文章', href: '/' },
    { label: '搜索', href: '/search/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ],
};
```

`locale` 会影响文章日期格式和页面语言属性，但**不会自动翻译界面**。如需修改关于页正文，请编辑 `src/pages/about.astro`。

## 4. 写第一篇文章

在 `src/content/posts/` 中创建 `hello-world.md`：

```md
---
title: "我的第一篇文章"
description: "记录使用 Plain 搭建博客的过程"
publishedAt: 2026-10-19
tags: ["Go", "随笔"]
draft: false
---

## Hello Plain

这是我的第一篇技术文章。

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Plain!")
}
```
```

> 上面示例包含嵌套 Markdown 代码围栏；复制时注意外层示例和内部 Go 代码围栏的区别。

文章会进入首页、搜索索引、标签页和 RSS。设置 `draft: true` 可以让未完成文章不发布。建议删除或替换模板自带的 `hello-plain.md` 与 `technical-typography.md` 示例文章。

## 5. 部署到 GitHub Pages

1. 打开你新仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 提交修改并推送到 `main`：

```bash
git add .
git commit -m "Initialize my blog"
git push origin main
```

仓库中的 `.github/workflows/deploy.yml` 会自动构建并部署网站。进入 **Actions** 查看部署进度，成功后即可访问上面表格对应的网址。

项目站点会自动适配 `/REPOSITORY/` 子路径；需要自定义域名或特殊路径时，可使用 `SITE_URL`、`BASE_PATH` 环境变量覆盖 `astro.config.mjs` 中的默认值。

**提示：** 对于 GitHub Pages 项目站点，`/REPOSITORY/robots.txt` 不是域名根目录的爬虫规则。使用自定义域名或根站点时才能更直接地控制根路径的 robots.txt。

## 日常更新文章

写入新的 `src/content/posts/*.md` 文件后，执行：

```bash
git add .
git commit -m "Add new post"
git push origin main
```

推送即触发自动部署，不需要自己生成 HTML。

## 本地质量检查

```bash
npm run check
npm run build
node scripts/smoke.mjs
npm run preview
```

GitHub Actions 会另外运行 Chromium 桌面端与移动端检查，截图作为工作流 Artifact 保存。

## 已知范围与后续计划

当前搜索范围是文章**标题、摘要和标签**，不是全文搜索。后续候选功能包括文章归档、全文搜索、图片放大、Mermaid 图表和进一步的无障碍审计；这些功能尚未承诺发布时间。

## 许可证

[MIT](LICENSE)
