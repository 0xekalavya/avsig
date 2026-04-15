'use client'

import { useState, useTransition } from 'react'
import { JWTResult } from '@/lib/jwt'
import { TokenInput } from '@/components/TokenInput'
import { StructureView } from '@/components/StructureView'
import { ClaimsTree } from '@/components/ClaimsTree'
import { ExpiryBadge } from '@/components/ExpiryBadge'
import { SecurityPanel } from '@/components/SecurityPanel'
import { AttackGenerator } from '@/components/AttackGenerator'
import { TokenDiff } from '@/components/TokenDiff'
import { generateAttacks } from '@/lib/attacks'
import { TrustBanner } from '@/components/TrustBanner'
import { calculateTrust } from '@/lib/trust'

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '32px 0' }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%',
        border: '2px solid #e4e4e7',
        borderTopColor: '#0a0a0a',
        animation: 'spin 0.6s linear infinite',
      }} />
      <span style={{ fontSize: '13px', color: '#71717a' }}>Analyzing token...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function Home() {
  const [result, setResult] = useState<JWTResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleResult(r: JWTResult | null, e: string | null) {
    startTransition(() => {
      setResult(r)
      setError(e)
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      
      <header className="app-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: 'white', borderBottom: '1px solid #e4e4e7',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#0a0a0a',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a' }}>
            AVSig
          </span>
        </div>
        <a href="/docs" className="docs-link"
          style={{
            fontSize: '13px', fontWeight: 500, color: '#3f3f46',
            textDecoration: 'none', padding: '5px 12px',
            border: '1px solid #e4e4e7', borderRadius: '6px',
            background: 'white', transition: 'background 0.2s'
          }}
        >
          API Docs 
        </a>
      </header>

      <main className="page-main" style={{ flex: 1, padding: '32px 24px' }}>
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          
          <div className="page-title" style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px', fontWeight: 700, color: '#0a0a0a',
              letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '10px',
            }}>
              JWT Inspector
            </h1>
            <p style={{ fontSize: '15px', color: '#71717a', lineHeight: 1.6, maxWidth: '600px' }}>
              Decode and audit JSON Web Tokens instantly. Named after the{' '}
              <code style={{
                fontSize: '13px', background: '#e4e4e7', padding: '2px 6px',
                borderRadius: '4px', color: '#0a0a0a', fontFamily: 'monospace',
              }}>alg:none</code>{' '}
              null signature attack. Your token never leaves this page.
            </p>
          </div>

          <div className="layout-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(0, 1fr)', 
            gap: '32px' 
          }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: '1 / -1' }}>
              <TokenInput onResult={handleResult} />

              
              {error && (
                <div style={{
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#dc2626',
                }}>
                  {error}
                </div>
              )}

              
              {isPending && <Spinner />}

              
              {!isPending && !result && !error && (
                <div style={{
                  marginTop: '16px',
                  border: '1px dashed #e4e4e7',
                  borderRadius: '12px',
                  padding: '56px 24px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '14px', color: '#a1a1aa' }}>
                    Paste a JWT above to inspect it
                  </p>
                  <p style={{ fontSize: '12px', color: '#d4d4d8', marginTop: '6px' }}>
                    Supports HS256 · RS256 · ES256 · alg:none detection
                  </p>
                </div>
              )}
            </div>

            
            {!isPending && result && (
              <div style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'fadeIn 0.2s ease',
              }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <TrustBanner trust={calculateTrust(result.checks)} checks={result.checks} />
                <StructureView raw={result.raw} />
                <ExpiryBadge info={result.expiry} />
                <SecurityPanel checks={result.checks} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <ClaimsTree header={result.header} payload={result.payload} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AttackGenerator attacks={generateAttacks(result)} />
                    <TokenDiff />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      
      <footer style={{
        padding: '24px', borderTop: '1px solid #e4e4e7', background: 'white',
        textAlign: 'center', fontSize: '12px', color: '#89CFF0'
      }}>
        Built by{' '}
        <a href="https://instagram.com/ekalavya.dev"
          style={{ color: '#a1a1aa', textDecoration: 'none' }}
          target="_blank" rel="noopener noreferrer">
          @ekalavya
        </a>
        {' '}· open source on{' '}
        <a href="https://github.com/0xekalavya"
          style={{ color: '#a1a1aa', textDecoration: 'none' }}
          target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}
