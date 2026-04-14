'use client'

import { useEffect, useState } from 'react'
import { ExpiryInfo } from '@/lib/jwt'

function humanDelta(seconds: number): string {
  const abs = Math.abs(seconds)
  if (abs < 60) return `${Math.round(abs)}s`
  if (abs < 3600) return `${Math.round(abs / 60)}m`
  if (abs < 86400) return `${Math.round(abs / 3600)}h`
  return `${Math.round(abs / 86400)}d`
}

export function ExpiryBadge({ info }: { info: ExpiryInfo }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (info.status === 'none') return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [info.status])

  const base = {
    background: 'white', border: '1px solid',
    borderRadius: '12px', padding: '14px 18px',
    display: 'flex', alignItems: 'flex-start', gap: '12px',
  }

  if (info.status === 'none') return (
    <div style={{ ...base, borderColor: '#fde68a', background: '#fffbeb' }}>
      <span style={{ fontSize: '16px', marginTop: '1px' }}>⚠️</span>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>No expiry set</p>
        <p style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
          This token never expires — stolen tokens stay valid forever
        </p>
      </div>
    </div>
  )

  const delta = (info.at.getTime() - now) / 1000

  if (delta < 0) return (
    <div style={{ ...base, borderColor: '#fecaca', background: '#fef2f2' }}>
      <span style={{ fontSize: '16px', marginTop: '1px' }}>🔴</span>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>
          Expired {humanDelta(delta)} ago
        </p>
        <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '2px' }}>
          {info.at.toUTCString()}
        </p>
      </div>
    </div>
  )

  const soon = delta < 300
  return (
    <div style={{
      ...base,
      borderColor: soon ? '#fde68a' : '#bbf7d0',
      background: soon ? '#fffbeb' : '#f0fdf4',
    }}>
      <span style={{ fontSize: '16px', marginTop: '1px' }}>{soon ? '⚠️' : '✅'}</span>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: soon ? '#92400e' : '#166534' }}>
          Valid — expires in {humanDelta(delta)}{soon ? ' (expiring soon)' : ''}
        </p>
        <p style={{ fontSize: '12px', color: soon ? '#b45309' : '#16a34a', marginTop: '2px' }}>
          {info.at.toUTCString()}
        </p>
      </div>
    </div>
  )
}