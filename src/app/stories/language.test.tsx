import { screen } from '@testing-library/react'

import { i18n, useLocaleStore } from '@/shared/lib/i18n'

import { renderApp } from './render-app'

const LOCALE_KEY = 'green-api-max/locale'

describe('US-7: язык интерфейса', () => {
  it('TC-7.1: выбор English переводит интерфейс и <html lang>', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Язык интерфейса' }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'English' }))

    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('TC-7.2: выбранный язык восстанавливается после перезагрузки', async () => {
    localStorage.setItem(LOCALE_KEY, JSON.stringify({ state: { locale: 'en' }, version: 0 }))
    await useLocaleStore.persist.rehydrate()

    expect(useLocaleStore.getState().locale).toBe('en')
    expect(i18n.language).toBe('en')
  })

  it('TC-7.3: испорченное сохранение не ломает приложение, язык остаётся русским', async () => {
    localStorage.setItem(LOCALE_KEY, '{')
    await useLocaleStore.persist.rehydrate()

    renderApp()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })
})
