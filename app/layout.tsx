import { Pacifico } from 'next/font/google'

import { RootStyleRegistry } from './components/RootStyleRegistry'
import Navbar from './components/Navbar'

// todo remove it when we have themes
// import './globals.css'

export const metadata = {
  title: 'My family',
  description: 'My family app',
  keywords: 'family, tree',
}

const pacifico = Pacifico({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pacifico.className}>
        <RootStyleRegistry>
          <Navbar />
          {children}
        </RootStyleRegistry>
      </body>
    </html>
  )
}
