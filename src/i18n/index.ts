import { site } from '../config';

export const messages = {
  'zh-CN': {
    nav: { posts: '文章', search: '搜索', tags: '标签', about: '关于' },
    home: { about: '了解更多', blogIntro: '博客介绍', latest: '最新发布', latestOne: '最新一篇', read: '阅读文章', tags: '文章标签', more: '更多文章', total: (n: number) => `共 ${n} 篇`, empty: '文章即将发布，敬请期待。', moreEmpty: '更多文章正在整理中。', browse: '按主题浏览', open: (title: string) => `阅读 ${title}` },
    common: { skip: '跳转到正文', home: '首页', mainNav: '主导航', theme: '切换深浅色模式', footer: '基于 Astro 构建 · Plain', posts: (n: number) => `${n} 篇文章`, allTags: '全部标签', back: '返回文章列表', updated: '更新于', toc: '文章目录', mobileToc: '本文目录', sections: (n: number) => `${n} 个章节`, top: '返回顶部', copy: '复制', copyCode: '复制代码', copied: '已复制', copyFailed: '复制失败' },
    about: { title: '关于', eyebrow: '关于博客', heading: '关于本站', guide: 'Plain 是一套面向开发者的独立博客主题。请在', guideAfter: '中修改站点信息，并在', guideEnd: '中编写自己的文章。', philosophy: 'Plain 保持界面克制，让文章、示例和代码成为阅读的主角。' },
    search: { title: '搜索', heading: '搜索文章', intro: '按标题、摘要或标签快速查找内容。', keyword: '关键词', placeholder: '例如 Go、Agent、架构…', prompt: '输入关键词开始搜索', failure: '索引加载失败，请刷新重试。', found: (n: number) => `找到 ${n} 篇文章` },
    tags: { title: '标签', heading: '文章标签', intro: '按主题探索技术文章。', count: (n: number) => `${n} 篇` }
  },
  'en-US': {
    nav: { posts: 'Posts', search: 'Search', tags: 'Tags', about: 'About' },
    home: { about: 'Learn more', blogIntro: 'About this blog', latest: 'Latest post', latestOne: 'Newly published', read: 'Read article', tags: 'Post tags', more: 'More articles', total: (n: number) => `${n} posts`, empty: 'New posts are coming soon.', moreEmpty: 'More articles are on the way.', browse: 'Browse by topic', open: (title: string) => `Read ${title}` },
    common: { skip: 'Skip to content', home: 'Home', mainNav: 'Main navigation', theme: 'Toggle color theme', footer: 'Built with Astro · Plain', posts: (n: number) => `${n} posts`, allTags: 'All tags', back: 'Back to posts', updated: 'Updated', toc: 'Table of contents', mobileToc: 'On this page', sections: (n: number) => `${n} sections`, top: 'Back to top', copy: 'Copy', copyCode: 'Copy code', copied: 'Copied', copyFailed: 'Copy failed' },
    about: { title: 'About', eyebrow: 'ABOUT THE BLOG', heading: 'About this site', guide: 'Plain is a standalone blog theme for developers. Edit site settings in', guideAfter: 'and publish your articles in', guideEnd: '.', philosophy: 'Plain keeps the interface understated so writing, examples and code take center stage.' },
    search: { title: 'Search', heading: 'Search posts', intro: 'Find articles by title, summary or tag.', keyword: 'Keywords', placeholder: 'Try Go, Agent, architecture…', prompt: 'Enter a keyword to search', failure: 'Unable to load the search index. Please refresh.', found: (n: number) => `Found ${n} posts` },
    tags: { title: 'Tags', heading: 'Post tags', intro: 'Explore posts by topic.', count: (n: number) => `${n} posts` }
  }
} as const;
export type Locale = keyof typeof messages;
export function getMessages(locale: string) {
  if (!(locale in messages)) throw new Error(`Unsupported site.locale: ${locale}. Use zh-CN or en-US.`);
  return messages[locale as Locale];
}
export const t = getMessages(site.locale);
