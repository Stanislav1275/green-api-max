import { SignInForm, SignInHelp } from '@/features/sign-in'
import { LanguageMenu } from '@/features/switch-language'
import { Trans, useTranslation } from '@/shared/lib/i18n'
import { Logo } from '@/shared/ui/logo'

/**
 * web.max.ru sign-in layout: a 580×696 card on the space pattern on desktop,
 * a full-screen form with the logo in the header on phones.
 *
 * Desktop rhythm measured from web.max.ru: 16px header inset, 52px icon buttons,
 * a 336px form column, ~40px under the footer link. Header and footer never scroll,
 * so their insets survive even when a warning makes the form taller.
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

        <header className="relative flex shrink-0 items-center justify-between p-2 md:px-4 md:pt-3.5 md:pb-0">
          <LanguageMenu />
          <Logo size={32} className="text-foreground md:hidden" />
          <SignInHelp />
        </header>

        <div className="relative min-h-0 flex-1 overflow-y-auto px-3 md:px-0">
          <div className="mx-auto w-full md:max-w-[21rem] md:pt-10">
            <Logo size={36} className="mx-auto mb-8 self-center max-md:hidden" />
            <h1
              id="sign-in-title"
              className="mt-4 mb-6 text-center text-xl leading-[25px] font-semibold text-balance md:mt-0"
            >
              {t('signIn.title')}
            </h1>
            <SignInForm />
          </div>
        </div>

        <footer className="relative mx-auto grid w-full shrink-0 gap-3 px-3 pt-4 pb-6 text-center text-sm leading-5 text-subtle-foreground md:max-w-[21rem] md:px-0 md:pb-10">
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
            className="text-[17px] leading-6 font-medium text-link hover:text-link-hover"
          >
            {t('signIn.openConsole')}
          </a>
        </footer>
      </section>
    </main>
  )
}
