import { ImageResponse } from 'next/og';

/**
 * Default Open Graph image (1200×630 PNG). Served from `/opengraph-image.png`
 * and used as the `og:image` / `twitter:image` for any page that doesn't
 * override it. The locale-specific home/wan/lan pages also fall back to
 * this image via `metadataBase`.
 *
 * Bilingual layout: English headline sits above Chinese subhead, with
 * the brand wordmark and a subtle neon glow on the right. Built entirely
 * from inline styles (no external image assets, no fonts beyond Inter).
 */
export const alt = 'temstream · Moonlight + Sunshine 中文指南';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.25), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(34,211,238,0.20), transparent 55%), linear-gradient(135deg, #06070d 0%, #0d1019 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top-left wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background:
                'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 60%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 32 32" width="48" height="48">
              <path
                d="M22 4 a13 13 0 1 0 0 24 a10 10 0 1 1 0 -24 z"
                fill="rgba(6,7,13,0.88)"
              />
              <circle cx="22" cy="10" r="4" fill="#ffffff" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: '#ffffff',
            }}
          >
            temstream
          </div>
        </div>

        {/* Center headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 980 }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -2,
              backgroundImage:
                'linear-gradient(90deg, #ffffff 0%, #cbd5e1 70%, #8b5cf6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Moonlight + Sunshine 中文指南
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.3,
              color: '#94a3b8',
              fontWeight: 500,
            }}
          >
            开源 · 低延迟 · 自托管的游戏串流方案
          </div>
        </div>

        {/* Bottom row: domain + tagline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 24,
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', gap: 28 }}>
            <span>Windows</span>
            <span>·</span>
            <span>Android</span>
            <span>·</span>
            <span>iOS</span>
            <span>·</span>
            <span>macOS</span>
            <span>·</span>
            <span>Linux</span>
          </div>
          <div
            style={{
              color: '#22d3ee',
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            temstream.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
