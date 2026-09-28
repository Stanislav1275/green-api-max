import { CircleHelp } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Popover } from '@/shared/ui/popover'

export const SignInHelp = () => (
  <Popover.Root>
    <Popover.Trigger render={<Button variant="ghost" size="icon" aria-label="Где взять данные" />}>
      <CircleHelp size={18} />
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Где взять данные</Popover.Title>
      <Popover.Description render={<div />} className="grid gap-2 text-muted-foreground">
        <ol className="grid list-decimal gap-1.5 pl-4">
          <li>
            Откройте{' '}
            <a
              href="https://console.green-api.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-link hover:text-link-hover"
            >
              личный кабинет GREEN-API
            </a>{' '}
            и выберите инстанс MAX.
          </li>
          <li>Скопируйте apiUrl, idInstance и apiTokenInstance со страницы инстанса.</li>
          <li>В настройках инстанса оставьте webhookUrl пустым и включите уведомления.</li>
        </ol>
      </Popover.Description>
    </Popover.Content>
  </Popover.Root>
)
