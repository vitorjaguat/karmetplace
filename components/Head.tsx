import { FC } from 'react'
import NextHead from 'next/head'

type Props = {
  ogImage?: string
  title?: string
  description?: string
}

/**
 * Renders the <head> section of the HTML page, including meta tags, title, and favicon.
 * @param ogImage - The URL of the Open Graph image to be displayed in social media shares.
 * @param title - The title of the page.
 * @param description - The description of the page.
 */
export const Head: FC<Props> = ({
  ogImage = 'https://karmetplace.thesphere.as/lit_thesphere.png',
  title = 'The Sphere Karmetplace',
  description = 'The Sphere Karmetplace is a platform to experiment, trade, and collect live art.',
}) => {
  return (
    <NextHead>
      {/* CONFIGURABLE: You'll probably want to configure this all to have custom meta tags and title to fit your application */}
      {/* CONFIGURABLE: There are also keywords in pages/_document.ts that you can also configure to fit your application */}

      {/* Title */}
      <title>{title}</title>

      {/* Meta tags */}
      <meta name="description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@thesphere_as" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:determiner" content="the" />
      <meta property="og:url" content="https://karmetplace.thesphere.as" />
      <meta property="og:locale" content="en" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="The Sphere Karmetplace" />
    </NextHead>
  )
}
