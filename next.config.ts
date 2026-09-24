import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // 适配 Vercel：使用动态输出，使 middleware 可正常工作
  // 如需保留静态导出，请同时删除 middleware.ts 并改用静态路由结构
  images: { unoptimized: true },
  // 显式禁用 Next.js 的 trailing-slash 自动重定向，
  // 避免与 next-intl middleware + Vercel 的 trailing-slash 处理产生循环。
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default withNextIntl(nextConfig);