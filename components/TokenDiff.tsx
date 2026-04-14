'use client'

import { useState } from 'react'
import { inspectJWT } from '@/lib/jwt'

type DiffEntry = {
  key: string
  type: 'added' | 'removed' | 'changed' | 'same'
  valueA?: unknown
  valueB?: unknown
}

function diffClaims(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): DiffEntry[] {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const entries: DiffEntry[] = []

  keys.forEach((key) => {
    const inA = key in a
    const inB = key in b

    if (!inA) {
      entries.push({ key, type: 'added', valueB: b[key] })
    } else if (!inB) {
      entries.push({ key, type: 'removed', valueA: a[key] })
    } else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      entries.push({ key, type: 'changed', valueA: a[key], valueB: b[key] })
    } else {
      entries.push({ key, type: 'same', valueA: a[key] })
    }
  })

  // sort: changed first, then added/removed, then same
  const order = { changed: 0, added: 1, removed: 1, same: 2 }
  return entries.sort((a, b) => order[a.type] - order[b.type])
}

function formatVal(key: string, val: unknown): string {
  if (typeof val === 'number' && ['exp', 'iat', 'nbf'].includes(key))
    return `${val} (${new Date(val * 1000).toUTCString()})`
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

const diffColors = {
  added:   { bg: '#f0fdf4', border: '#bbf7d0', label: 'ADDED',   color: '#16a34a' },
  removed: { bg: '#fef2f2', border: '#fecaca', label: 'REMOVED', color: '#dc2626' },
  changed: { bg: '#eff6ff', border: '#bfdbfe', label: 'CHANGED', color: '#2563eb' },
  same:    { bg: '#fafafa', border: '#f4f4f5', label: 'SAME',    color: '#a1a1aa' },
}

export function TokenDiff() {
  const [tokenA, setTokenA] = useState('')
  const [tokenB, setTokenB] = useState('')
  const [diff, setDiff] = useState<{ header: DiffEntry[]; payload: DiffEntry[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function compare() {
    try {
      const a = inspectJWT(tokenA.trim())
      const b = inspectJWT(tokenB.trim())
      setDiff({
        header: diffClaims(a.header, b.header),
        payload: diffClaims(a.payload, b.payload),
      })
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setDiff(null)
    }
  }

  const changed = diff
    ? [...(diff.header), ...(diff.payload)].filter((d) => d.type !== 'same').length
    : 0

  return (
    <div style={{
      background: 'white', border: '1px solid #e4e4e7',
      borderRadius: '12px', padding: '20px',
    }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>
        Token diff
      </p>
      <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '16px' }}>
        Compare two JWTs from different sessions — spot what changed
      </p>

      <div className="token-diff-grid" style={{ display: 'grid', gap: '10px', marginBottom: '10px' }}>
        {[
          { label: 'Token A', value: tokenA, set: setTokenA, placeholder: 'eyJhbGci... (session 1)' },
          { label: 'Token B', value: tokenB, set: setTokenB, placeholder: 'eyJhbGci... (session 2)' },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </p>
            <textarea
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
              style={{
                width: '100%', height: '90px',
                fontFamily: "'Courier New', monospace", fontSize: '11px',
                padding: '10px', background: '#fafafa',
                border: '1px solid #e4e4e7', borderRadius: '8px',
                color: '#0a0a0a', resize: 'none', outline: 'none',
                lineHeight: 1.5,
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={compare}
        disabled={!tokenA || !tokenB}
        style={{
          width: '100%', padding: '9px',
          background: tokenA && tokenB ? '#0a0a0a' : '#f4f4f5',
          color: tokenA && tokenB ? 'white' : '#a1a1aa',
          border: 'none', borderRadius: '8px',
          fontSize: '13px', fontWeight: 500,
          cursor: tokenA && tokenB ? 'pointer' : 'not-allowed',
          marginBottom: '16px',
        }}
      >
        Compare tokens
      </button>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '8px', padding: '10px 14px',
          fontSize: '12px', color: '#dc2626', marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      {diff && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
              background: changed > 0 ? '#eff6ff' : '#f0fdf4',
              color: changed > 0 ? '#2563eb' : '#16a34a',
              border: `1px solid ${changed > 0 ? '#bfdbfe' : '#bbf7d0'}`,
            }}>
              {changed} change{changed !== 1 ? 's' : ''} detected
            </span>
          </div>

          {(['header', 'payload'] as const).map((section) => (
            <div key={section}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {section}
              </p>
              <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                {diff[section].map((entry, i) => {
                  const cfg = diffColors[entry.type]
                  return (
                    <div key={entry.key} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '8px 12px',
                      borderTop: i === 0 ? 'none' : '1px solid #f4f4f5',
                      background: cfg.bg,
                    }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '1px 5px',
                        borderRadius: '3px', flexShrink: 0, marginTop: '2px',
                        color: cfg.color, border: `1px solid ${cfg.border}`,
                        background: 'white',
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{
                        fontFamily: "'Courier New', monospace", fontSize: '12px',
                        color: '#3f3f46', minWidth: '80px', flexShrink: 0, marginTop: '1px',
                      }}>
                        {entry.key}
                      </span>
                      <div style={{ flex: 1, fontSize: '12px', fontFamily: "'Courier New', monospace", lineHeight: 1.6 }}>
                        {entry.type === 'changed' ? (
                          <>
                            <div style={{ color: '#dc2626', textDecoration: 'line-through', opacity: 0.7 }}>
                              {formatVal(entry.key, entry.valueA)}
                            </div>
                            <div style={{ color: '#16a34a' }}>
                              {formatVal(entry.key, entry.valueB)}
                            </div>
                          </>
                        ) : entry.type === 'added' ? (
                          <div style={{ color: '#16a34a' }}>{formatVal(entry.key, entry.valueB)}</div>
                        ) : entry.type === 'removed' ? (
                          <div style={{ color: '#dc2626', textDecoration: 'line-through', opacity: 0.7 }}>
                            {formatVal(entry.key, entry.valueA)}
                          </div>
                        ) : (
                          <div style={{ color: '#a1a1aa' }}>{formatVal(entry.key, entry.valueA)}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}