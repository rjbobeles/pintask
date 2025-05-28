import { Links, Meta, Outlet, Scripts, ScrollRestoration, type LinksFunction, type MetaFunction } from 'react-router'

import { AppNav } from './app-nav'
import './styles.css'

export const meta: MetaFunction = () => [
  {
    title: 'New Nx React Router App',
  },
]

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='Your site description here' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='robots' content='index,follow' />

        {/* Open Graph tags for social media */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Your Site Title' />
        <meta property='og:description' content='Your site description here' />
        <meta property='og:image' content='https://yoursite.com/og-image.jpg' />
        <meta property='og:url' content='https://yoursite.com' />

        {/* Twitter Card tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Your Site Title' />
        <meta name='twitter:description' content='Your site description here' />
        <meta name='twitter:image' content='https://yoursite.com/twitter-image.jpg' />

        {/* Security related meta tags */}
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='referrer' content='strict-origin-when-cross-origin' />

        <Meta />
        <Links />
      </head>
      <body>
        <AppNav />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
