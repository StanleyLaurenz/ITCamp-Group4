import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'ITCamp Group 4',
  description: 'Next.js frontend connected to the ITCamp Group 4 Express API.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
