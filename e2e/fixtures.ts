import { expect, type Page, test as base } from '@playwright/test'

export const PHONE = '+7 999 123-45-67'

class ChatApp {
  constructor(readonly page: Page) {}

  async signIn() {
    await this.page.goto('/')
    await this.page.getByLabel('idInstance').fill('1101000001')
    await this.page.getByLabel('apiTokenInstance').fill('demo-token')
    await this.page.getByRole('button', { name: 'Войти' }).click()
    await expect(this.page.getByRole('heading', { name: 'Чаты' })).toBeVisible()
  }

  async openChat(phone = PHONE) {
    await this.page.getByLabel('Номер телефона получателя').fill(phone)
    await this.page.getByRole('button', { name: 'Создать чат' }).click()
  }

  async send(text: string) {
    await this.page.getByLabel('Сообщение').fill(text)
    await this.page.getByLabel('Сообщение').press('Enter')
  }

  messages() {
    return this.page.getByRole('list', { name: 'Сообщения' })
  }
}

export const test = base.extend<{ app: ChatApp }>({
  // every scenario also checks that the production CSP blocks nothing the app needs
  app: async ({ page }, use) => {
    const violations: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error' && message.text().includes('Content Security Policy')) {
        violations.push(message.text())
      }
    })
    await use(new ChatApp(page))
    expect(violations).toEqual([])
  },
})

export { expect }
