import { ImageResponse } from 'next/og';

/**
 * Apple touch icon (180×180 PNG). Renders the same moon+dot motif as
 * `app/icon.tsx` with extra padding so iOS's automatic corner rounding
 * never clips the artwork.
 */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 60%, #ec4899 100%)',
          borderRadius: 40,
        }}
      >
        <svg viewBox="0 0 32 32" width="150" height="150">
          <path
            d="M22 4 a13 13 0 1 0 0 24 a10 10 0 1 1 0 -24 z"
            fill="rgba(6, 7, 13, 0.88)"
          />
          <circle cx="22" cy="10" r="4" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
