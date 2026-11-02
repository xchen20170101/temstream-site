import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // 适配 Vercel：使用动态输出，使 middleware 可正常工作
  // 如需保留静态导出，请同时删除 middleware.ts 并改用静态路由结构
  images: { unoptimized: true },
  // 统一无尾斜杠的规范形式：`/zh/wan/` 会 308 到 `/zh/wan`。
  // （早期为了解决 middleware 重定向循环而打开了 skipTrailingSlashRedirect，
  //  结果两条 URL 都返回 200、只是靠 canonical 收敛，Search Console 会把
  //  尾斜杠版本记为「备用网页」。现在的 middleware 不再 rewrite，循环成因
  //  已不存在，因此恢复 Next.js 自带的规范化跳转。）
  trailingSlash: false,
};

export default withNextIntl(nextConfig);