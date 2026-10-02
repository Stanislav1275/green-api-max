type SeoProps = {
  title?: string
  description: string
}

const APP_NAME = 'MAX × GREEN-API'

export const Seo = ({ title, description }: SeoProps) => (
  <>
    <title>{title ? `${title} · ${APP_NAME}` : APP_NAME}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title ?? APP_NAME} />
    <meta property="og:description" content={description} />
  </>
)
