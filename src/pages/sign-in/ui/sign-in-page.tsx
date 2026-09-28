import { SignInForm, SignInHelp } from '@/features/sign-in'
import { LanguageMenu } from '@/features/switch-language'
import { Logo } from '@/shared/ui/logo'

/**
 * web.max.ru sign-in layout: a card on the space pattern on desktop,
 * a full-screen form with the logo in the header on phones.
 */
export const SignInPage = () => (
  <main className="min-h-full bg-background-secondary md:bg-space-pattern md:grid md:place-items-center md:bg-chat-background md:p-6">
    <section
      aria-labelledby="sign-in-title"
      className="relative flex min-h-dvh flex-col md:min-h-[44rem] md:w-full md:max-w-[36rem] md:overflow-hidden md:rounded-2xl md:border md:border-divider md:bg-background md:shadow-2xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-aurora max-md:hidden"
      />

      <header className="relative flex items-center justify-between p-2 md:p-5">
        <LanguageMenu />
        <Logo className="text-xl md:hidden" />
        <SignInHelp />
      </header>

      <div className="relative flex flex-1 flex-col px-3 md:px-24 md:pb-8">
        <Logo className="mx-auto mt-10 mb-12 max-md:hidden" />
        <h1
          id="sign-in-title"
          className="mt-4 mb-6 text-center text-xl leading-tight font-semibold text-balance md:mt-0"
        >
          С какими данными GREEN-API хотите войти?
        </h1>

        <SignInForm />

        <footer className="mt-auto grid gap-4 pt-10 pb-6 text-center text-[13px] leading-snug text-subtle-foreground md:pb-0">
          <p className="text-balance">
            Нажимая «Войти», вы подключаете этот браузер к своему инстансу. Данные хранятся только
            здесь и уходят напрямую в <span className="text-foreground">GREEN-API</span>.
          </p>
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-base font-medium text-link hover:text-link-hover"
          >
            Открыть личный кабинет GREEN-API
          </a>
        </footer>
      </div>
    </section>
  </main>
)
