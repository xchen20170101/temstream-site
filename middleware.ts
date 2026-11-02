import { NextRequest, NextResponse } from 'next/server';
import { SITE_PAGES, ZH_ONLY_PAGES } from '@/lib/site-config';

// 简单的 i18n middleware：替代 next-intl 自带的 createMiddleware。
// 原因：next-intl 的 createMiddleware 在 localePrefix:'always' 模式下会调用
// NextResponse.rewrite(/zh -> /zh)，由于 Next.js 15 内部对 loopback host 的
// 标准化（127.0.0.1 -> localhost），rewrite URL 与原始 URL 的 origin 不同，
// Next.js 会重新触发 middleware，造成无限循环（本地 500，Vercel 上是
// ERR_TOO_MANY_REDIRECTS）。本 middleware 仅使用 redirect/next，从根本上
// 避开 NextResponse.rewrite 的副作用。
//
// ── 关于重定向的 SEO 三条铁律（Search Console「网页会自动重定向」的教训）──
//
// 1) 只使用 308（永久、保留方法）而不是 307。307 是"临时"，Google 每次都要
//    重新走一跳，且不会把权重合并到目标 URL；而我们的跳转目标其实是固定的。
// 2) 跳转目标必须是**确定性的**。早期版本按 cookie + accept-language 选语言，
//    导致同一个 URL 对不同爬虫返回不同的 Location（Googlebot 通常不带
//    Accept-Language、Bingbot 带 en-US），Google 把这种"请求头相关跳转"
//    判定为自动/软重定向并拒绝索引。现在根路径固定跳默认语言，语言切换交给
//    页面上的 LocaleSwitcher（用户显式选择，搜索引擎不受影响）。
// 3) 不为不存在的路径做重定向。`/foo` → `/zh/foo` → 404 是"重定向 + 404"的
//    双跳，Google 会先把 `/foo` 记为"自动重定向"。这里改成直接放行，由
//    `app/[locale]/layout.tsx` 的 locale 校验抛出 notFound()，一次就给出 404。
const LOCALES = ['zh', 'en'] as const;
const DEFAULT_LOCALE = 'zh';

/**
 * 已知的、需要做「补语言前缀」跳转的路径。
 * 只覆盖真实存在的页面（site-config 是 sitemap 的同一份数据源，天然同步），
 * 这样历史外链（如早年分享出去的 `/download`）依然能落到正确页面，而任意
 * 拼错的路径不会再制造一次无效跳转。
 */
const KNOWN_PATHS = new Set<string>([...SITE_PAGES, ...ZH_ONLY_PAGES]);

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

/** 去掉尾部斜杠（保留根路径），使 `/wan/` 与 `/wan` 走同一分支。 */
function stripTrailingSlash(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 已经带 locale 前缀：交给 [locale]/* 路由处理
  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const normalised = stripTrailingSlash(pathname);

  // 根路径：固定跳到默认语言首页。目标是常量，可被 308 长期缓存。
  if (normalised === '/') {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  // 历史无前缀路径（`/download`、`/wan/` 等）：308 补齐默认语言前缀，
  // 保留 query string，语义是"这个页面永久存在于 /zh/<path>"。
  if (KNOWN_PATHS.has(normalised)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${normalised}`;
    return NextResponse.redirect(url, 308);
  }

  // 其它未知路径：不做重定向，直接交给路由体系返回 404。
  return NextResponse.next();
}

export const config = {
  // 排除 api、_next 静态资源、带点的文件（图片/字体/ico 等）
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
