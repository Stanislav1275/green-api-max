import { cn } from '@/shared/lib/cn'

import markUrl from './logo-mark.svg'

type LogoProps = {
  className?: string
  size?: number
}

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
