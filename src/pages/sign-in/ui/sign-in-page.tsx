import { SignInForm, SignInHelp } from '@/features/sign-in'
import { LanguageMenu } from '@/features/switch-language'
import { Trans, useTranslation } from '@/shared/lib/i18n'
import { Logo } from '@/shared/ui/logo'

/**
 * web.max.ru sign-in layout: a 580×696 card on the space pattern on desktop,
 * a full-screen form with the logo in the header on phones.
 */
export const SignInPage = () => {
  const { t } = useTranslation()

  return (
    <main className="min-h-full bg-background-secondary md:bg-space-pattern md:grid md:place-items-center md:bg-chat-background md:p-8">
      <section
        aria-labelledby="sign-in-title"
        className="relative flex min-h-dvh flex-col md:h-[696px] md:min-h-0 md:w-[580px] md:overflow-hidden md:rounded-[1.75rem] md:border md:border-divider md:bg-background md:shadow-2xl"
      >
        <div aria-hidden className="aurora max-md:hidden">
          <span className="-top-24 -left-16 size-80 bg-brand-1" />
          <span className="-top-28 left-1/3 size-72 bg-brand-2 [animation-delay:-5s]" />
          <span className="-top-20 -right-20 size-80 bg-brand-3 [animation-delay:-10s]" />
        </div>

        <header className="relative flex items-center justify-between p-2 md:px-6 md:pt-6">
          <LanguageMenu />
          <Logo size={32} className="text-foreground md:hidden" />
          <SignInHelp />
        </header>

        <div className="relative mx-auto flex min-h-0 w-full flex-1 flex-col px-3 md:max-w-[21rem] md:overflow-y-auto md:px-0 md:pb-8">
          <Logo size={44} className="mx-auto mt-2 mb-9 max-md:hidden" />
          <h1
            id="sign-in-title"
            className="mt-4 mb-6 text-center text-[21px] leading-[26px] font-semibold text-balance md:mt-0"
          >
            {t('signIn.title')}
          </h1>

          <SignInForm />

          <footer className="mt-auto grid gap-4 pt-8 pb-6 text-center text-sm leading-snug text-subtle-foreground md:pb-0">
            <p className="text-balance">
              <Trans
                i18nKey="signIn.disclaimer"
                components={{ strong: <span className="text-foreground" /> }}
              />
            </p>
            <a
              href="https://console.green-api.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-[17px] font-medium text-link hover:text-link-hover"
            >
              {t('signIn.openConsole')}
            </a>
          </footer>
        </div>
      </section>
    </main>
  )
}
