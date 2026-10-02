import { FlaskConical } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { DEMO_MODE_AVAILABLE, useDemoMode, useDemoModeStore } from '@/shared/lib/demo-mode'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'

export const DemoModeToggle = () => {
  const { t } = useTranslation()
  const enabled = useDemoMode()
  const pending = useDemoModeStore((state) => state.pending)
  const setEnabled = useDemoModeStore((state) => state.setEnabled)

  if (!DEMO_MODE_AVAILABLE) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('demoMode.toggle')}
      title={t(enabled ? 'demoMode.on' : 'demoMode.off')}
      aria-pressed={enabled}
      disabled={pending}
      className={cn(enabled && 'text-primary')}
      onClick={() => {
        void setEnabled(!enabled)
      }}
    >
      <FlaskConical size={24} />
    </Button>
  )
}
