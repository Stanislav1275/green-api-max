import { expect, PHONE, test } from './fixtures'

test.describe('основной сценарий ТЗ', () => {
  test('TC-1.1 → TC-2.1 → TC-3.1 → TC-4.1: вход, новый чат, отправка, ответ', async ({
    app,
    page,
  }) => {
    await app.signIn()
    await app.openChat('8 (999) 123-45-67')
    await expect(page.getByRole('heading', { level: 2, name: PHONE })).toBeVisible()

    await app.send('Привет из e2e')

    const messages = app.messages()
    await expect(messages.getByText('Привет из e2e')).toBeVisible()
    await expect(messages.getByLabel('Отправлено')).toBeVisible()
    await expect(page.getByLabel('Сообщение')).toHaveValue('')
    await expect(messages.getByText('Эхо: Привет из e2e')).toBeVisible()
    await expect(messages.getByRole('listitem')).toHaveCount(2)
  })

  test('TC-5.1: после перезагрузки остаёмся в чатах с историей', async ({ app, page }) => {
    await app.signIn()
    await app.openChat()
    await app.send('Переживу reload')
    await expect(app.messages().getByText('Эхо: Переживу reload')).toBeVisible()

    await page.reload()

    await expect(page.getByRole('heading', { name: 'Чаты' })).toBeVisible()
    await page
      .getByRole('navigation', { name: 'Список чатов' })
      .getByRole('button', { name: /999 123-45-67/ })
      .click()
    await expect(app.messages().getByText('Переживу reload')).toBeVisible()
  })

  test('TC-5.2: выход возвращает на экран входа и очищает сессию', async ({ app, page }) => {
    await app.signIn()
    await page.getByRole('button', { name: 'Выйти' }).click()

    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible()
  })
})

test.describe('мобильная версия', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('TC-6.1, TC-6.2: список и чат сменяют друг друга без горизонтальной прокрутки', async ({
    app,
    page,
  }) => {
    await app.signIn()
    await app.openChat()

    await expect(page.getByRole('navigation', { name: 'Список чатов' })).toBeHidden()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    await page.getByRole('button', { name: 'Назад к чатам' }).click()
    await expect(page.getByRole('navigation', { name: 'Список чатов' })).toBeVisible()
  })
})
