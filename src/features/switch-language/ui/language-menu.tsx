import { Globe } from 'lucide-react'

import { type Locale, LOCALES, useLocaleStore } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import { Menu } from '@/shared/ui/menu'

export const LanguageMenu = () => {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)

  return (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="ghost" size="icon" aria-label="Язык интерфейса" />}>
        <Globe size="md" />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.RadioGroup
          value={locale}
          onValueChange={(value: Locale) => {
            setLocale(value)
          }}
        >
          {LOCALES.map(({ value, label }) => (
            <Menu.RadioItem key={value} value={value}>
              {label}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  )
}
