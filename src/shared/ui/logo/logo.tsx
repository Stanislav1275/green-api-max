import { cn } from '@/shared/lib/cn'

import markUrl from './logo-mark.svg'

type LogoProps = {
  className?: string
  /** mark size in px; the word scales with it */
  size?: number
}

/**
 * Our own mark in the MAX manner: a bubble cut out of a slowly turning brand gradient.
 * The gradient is a masked conic background, so it animates without any JS.
 */
export const Logo = ({ className, size = 40 }: LogoProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-2.5 font-bold tracking-tight select-none',
      className,
    )}
    style={{ fontSize: size * 0.9 }}
  >
    <span
      aria-hidden
      className="logo-mark shrink-0"
      // quoted: Vite inlines the SVG as a data URL that contains single quotes
      style={{
        width: size,
        height: size,
        maskImage: `url("${markUrl}")`,
        WebkitMaskImage: `url("${markUrl}")`,
      }}
    />
    {/* eslint-disable-next-line i18next/no-literal-string -- brand name, never translated */}
    <span className="leading-none">max</span>
  </span>
)
