import { ImageResponse } from 'next/og';

/**
 * Browser favicon (32×32 PNG). Reuses the moon + accent dot motif from
 * components/Logo.tsx so the tab icon matches the in-page brand mark.
 * Rendered dynamically so the gradient stays vector-crisp at every DPR.
 */
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 7,
          position: 'relative',
        }}
      >
        {/* Moon arc */}
        <svg
          viewBox="0 0 32 32"
          width="28"
          height="28"
          style={{ position: 'absolute', left: 2, top: 2 }}
        >
          <path
            d="M22 4 a13 13 0 1 0 0 24 a10 10 0 1 1 0 -24 z"
            fill="rgba(6, 7, 13, 0.85)"
          />
        </svg>
        {/* Accent dot — echoes the dot in the in-page Logo */}
        <div
          style={{
            position: 'absolute',
            right: 7,
            top: 7,
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: '#ffffff',
            boxShadow: '0 0 6px rgba(255,255,255,0.85)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
