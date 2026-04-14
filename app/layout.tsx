import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AVSig - JWT Inspector & Security Auditor',
  description:
    'Decode and audit JSON Web Tokens in your browser. Detects alg:none, jku injection, weak algorithms, missing expiry and more. 100% client-side.',
  keywords: ['JWT', 'JSON Web Token', 'JWT decoder', 'JWT security', 'alg:none', 'JWT audit', 'bug bounty', 'nullsig'],
  authors: [{ name: '@ekalavya' }],
  openGraph: {
    title: 'AVSig - JWT Inspector & Security Auditor',
    description: 'Decode and audit JWTs instantly. Detects alg:none, jku injection, weak algorithms and more. 100% client-side.',
    url: 'https://avsig.vercel.app',
    siteName: 'AVSig',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'AVSig - JWT Inspector & Security Auditor',
    description: 'Decode and audit JWTs instantly. 100% client-side.',
    creator: '@ekalavya',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}