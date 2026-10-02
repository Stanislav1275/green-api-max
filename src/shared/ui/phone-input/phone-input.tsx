import { Combobox } from '@base-ui/react/combobox'
import { ChevronDown, Search } from 'lucide-react'
import { type Ref, useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { useTranslation } from '@/shared/lib/i18n'
import {
  composePhone,
  COUNTRIES,
  type Country,
  matchesCountry,
  splitPhone,
} from '@/shared/lib/phone'

import { Field } from '../field'

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  ref?: Ref<HTMLInputElement>
  placeholder?: string
  className?: string
}

/**
 * MAX phone field: flag + dial code picker with search, then the number.
 * The value is one string (`+375 29 123 45 67`), so any schema can validate it as a phone.
 */
export const PhoneInput = ({
  value,
  onChange,
  onBlur,
  name,
  ref,
  placeholder = '123 456 78 90',
  className,
}: PhoneInputProps) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Country | undefined>()
  const countryName = (item: Country) => t(`countries.${item.value}`)
  const { country, national } = splitPhone(value, selected)

  return (
    <div
      data-slot="phone-input"
      className={cn(
        'flex h-12 items-center rounded-lg bg-input transition-shadow ring-inset focus-within:ring-2 focus-within:ring-ring has-aria-invalid:ring-2 has-aria-invalid:ring-destructive',
        className,
      )}
    >
      {/* own field scope: otherwise Base UI labels the country trigger with the phone label too */}
      <Field.Root className="contents">
        <Combobox.Root
          items={COUNTRIES}
          value={country}
          onValueChange={(next) => {
            /* v8 ignore else -- null comes only from Combobox.Clear, which is not rendered */
            if (next) {
              setSelected(next)
              onChange(composePhone(next, national))
            }
          }}
          filter={(item: Country, query) => matchesCountry(item, countryName(item), query)}
          itemToStringLabel={countryName}
          isItemEqualToValue={(item, current) => item.value === current.value}
        >
          <Combobox.Trigger
            aria-label={t('phoneInput.countryCode', {
              country: countryName(country),
              code: country.dialCode,
            })}
            className="flex h-full shrink-0 cursor-pointer items-center gap-1.5 rounded-l-lg pr-2 pl-4 text-[15px] outline-none focus-visible:bg-muted"
          >
            <span aria-hidden>{country.flag}</span>
            <span>+{country.dialCode}</span>
            <Combobox.Icon className="text-subtle-foreground transition-transform data-popup-open:rotate-180">
              <ChevronDown />
            </Combobox.Icon>
          </Combobox.Trigger>
          <Combobox.Portal>
            <Combobox.Positioner align="start" sideOffset={8} className="z-50">
              <Combobox.Popup
                aria-label={t('phoneInput.picker')}
                className="w-80 max-w-[var(--available-width)] origin-[var(--transform-origin)] rounded-xl bg-popover p-2 shadow-xl ring-1 ring-divider transition-[scale,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle-foreground" />
                  <Combobox.Input
                    placeholder={t('phoneInput.search')}
                    className="h-10 w-full rounded-lg bg-input pr-3 pl-10 text-[15px] outline-none placeholder:text-subtle-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  />
                </div>
                <Combobox.Empty className="px-3 py-4 text-center text-sm text-subtle-foreground empty:hidden">
                  {t('common.nothingFound')}
                </Combobox.Empty>
                <Combobox.List className="mt-2 max-h-72 overflow-y-auto overscroll-contain empty:mt-0">
                  {(item: Country) => (
                    <Combobox.Item
                      key={item.value}
                      value={item}
                      className="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-[15px] outline-none select-none data-highlighted:bg-hover data-selected:bg-muted"
                    >
                      <span aria-hidden>{item.flag}</span>
                      <span className="flex-1 truncate">{countryName(item)}</span>
                      <span className="text-subtle-foreground">+{item.dialCode}</span>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </Field.Root>

      <Field.Control
        render={<input />}
        ref={ref}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={national}
        onChange={(event) => {
          onChange(composePhone(country, event.target.value))
        }}
        onBlur={onBlur}
        className="h-full min-w-0 flex-1 bg-transparent pr-4 text-base outline-none placeholder:text-subtle-foreground md:text-[15px]"
      />
    </div>
  )
}
