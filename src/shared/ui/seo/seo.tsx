type SeoProps = {
  /** page name; the app name is appended */
  title?: string
  description: string
}

const APP_NAME = 'MAX × GREEN-API'

/** React 19 hoists `<title>` and `<meta>` into `<head>`, so no helmet library is needed. */
export const Seo = ({ title, description }: SeoProps) => (
  <>
    <title>{title ? `${title} · ${APP_NAME}` : APP_NAME}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title ?? APP_NAME} />
    <meta property="og:description" content={description} />
  </>
)
