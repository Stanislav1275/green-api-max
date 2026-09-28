import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'
import { useTranslation } from '@/shared/lib/i18n'

export const Spinner = ({ className, ...props }: ComponentProps<'svg'>) => {
  const { t } = useTranslation()
  return (
    <LoaderCircle
      role="status"
      aria-label={t('common.loading')}
      className={cn('animate-spin', className)}
      {...props}
    />
  )
}
