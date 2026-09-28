import { CircleHelp } from 'lucide-react'

import { Trans, useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import { Popover } from '@/shared/ui/popover'

export const SignInHelp = () => {
  const { t } = useTranslation()
  return (
    <Popover.Root>
      <Popover.Trigger
        render={<Button variant="ghost" size="icon" aria-label={t('signIn.help.trigger')} />}
      >
        <CircleHelp size={24} />
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>{t('signIn.help.title')}</Popover.Title>
        <Popover.Description render={<div />} className="grid gap-2 text-muted-foreground">
          <ol className="grid list-decimal gap-1.5 pl-4">
            <li>
              <Trans
                i18nKey="signIn.help.step1"
                components={{
                  link: (
                    <a
                      href="https://console.green-api.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-link hover:text-link-hover"
                    />
                  ),
                }}
              />
            </li>
            <li>{t('signIn.help.step2')}</li>
            <li>{t('signIn.help.step3')}</li>
          </ol>
        </Popover.Description>
      </Popover.Content>
    </Popover.Root>
  )
}
