import { useId } from 'react'

import { cn } from '@/shared/lib/cn'

/** Our own mark in the MAX brand gradient — not the MAX logo. */
export const Logo = ({ className }: { className?: string }) => {
  const gradientId = useId()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-9" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--brand-3)" />
            <stop offset="0.5" stopColor="var(--brand-2)" />
            <stop offset="1" stopColor="var(--brand-1)" />
          </linearGradient>
        </defs>
        <path
          d="M16 3a13 13 0 0 0-11.3 19.4L3 29l6.8-1.6A13 13 0 1 0 16 3Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="16" cy="16" r="5.5" fill="none" stroke="#fff" strokeWidth="3" />
      </svg>
      <span>
        max<span className="text-subtle-foreground">·chat</span>
      </span>
    </span>
  )
}
