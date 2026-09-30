import { NextRequest, NextResponse } from 'next/server';

// 简单的 i18n middleware：替代 next-intl 自带的 createMiddleware。
// 原因：next-intl 的 createMiddleware 在 localePrefix:'always' 模式下会调用
// NextResponse.rewrite(/zh -> /zh)，由于 Next.js 15 内部对 loopback host 的
// 标准化（127.0.0.1 -> localhost），rewrite URL 与原始 URL 的 origin 不同，
// Next.js 会重新触发 middleware，造成无限循环（本地 500，Vercel 上是
// ERR_TOO_MANY_REDIRECTS）。本 middleware 仅使用 redirect/next，从根本上
// 避开 NextResponse.rewrite 的副作用。
const LOCALES = ['zh', 'en'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'zh';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function pickLocale(req: NextRequest): Locale {
  // 1) cookie 优先
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }
  // 2) accept-language 头
  const accept = req.headers.get('accept-language') || '';
  if (/^en\b/i.test(accept)) return 'en';
  // 3) 默认
  return DEFAULT_LOCALE;
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 根路径：根据 cookie / accept-language 重定向
  if (pathname === '/') {
    const target = pickLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${target}`;
    url.search = '';
    const res = NextResponse.redirect(url, 307);
    // 保持 cookie 与重定向目标一致，避免下次又跳一次
    res.cookies.set(LOCALE_COOKIE, target, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  // 已经带 locale 前缀：交给 [locale]/* 路由处理
  if (hasLocalePrefix(pathname)) {
    return NextResponse.next({
      request: { headers: req.headers },
    });
  }

  // 其它未匹配路径（例如旧链接 /download 等）：重定向到默认 locale
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // 排除 api、_next 静态资源、带点的文件（图片/字体/ico 等）
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
