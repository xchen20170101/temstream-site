import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Logo({ className = '', children }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 text-neon-violet drop-shadow-[0_0_12px_rgba(139,92,246,0.55)]"
        fill="none"
      >
        <defs>
          <linearGradient id="tem-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="60%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path
          d="M5 16 C 5 9, 11 4, 16 4 C 22 4, 27 9, 27 16 C 27 22, 22 27, 16 27 L 16 22"
          stroke="url(#tem-grad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="16" r="3.2" fill="url(#tem-grad)" />
      </svg>
      <span className="text-base font-semibold tracking-tight text-white">
        {children ?? 'temstream'}
      </span>
    </span>
  );
}