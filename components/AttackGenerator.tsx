'use client'

import { useState } from 'react'
import { AttackVariant } from '@/lib/attacks'

const severityConfig = {
  critical: { label: 'Critical', bg: '#fef2f2', border: '#fecaca', color: '#dc2626', dot: '#dc2626' },
  high:     { label: 'High',     bg: '#fff7ed', border: '#fed7aa', color: '#ea580c', dot: '#f97316' },
  medium:   { label: 'Medium',   bg: '#fffbeb', border: '#fde68a', color: '#d97706', dot: '#f59e0b' },
} as const

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      style={{
        fontSize: '11px', padding: '3px 10px',
        border: '1px solid #e4e4e7', borderRadius: '5px',
        background: copied ? '#f0fdf4' : 'white',
        color: copied ? '#16a34a' : '#3f3f46',
        cursor: 'pointer', fontWeight: 500,
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function AttackCard({ attack }: { attack: AttackVariant }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = severityConfig[attack.severity]

  return (
    <div style={{
      border: `1px solid ${cfg.border}`,
      background: cfg.bg,
      borderRadius: '8px',
      padding: '12px 14px',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', flex: 1 }}>
          {attack.name}
        </span>
        {attack.cve && (
          <span style={{
            fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 600,
          }}>
            {attack.cve}
          </span>
        )}
        <span style={{
          fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
          background: 'white', color: cfg.color,
          border: `1px solid ${cfg.border}`, fontWeight: 600,
        }}>
          {cfg.label}
        </span>
        <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${cfg.border}` }}>
          <p style={{ fontSize: '12px', color: '#3f3f46', marginBottom: '8px', lineHeight: 1.6 }}>
            {attack.description}
          </p>
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '6px', padding: '8px 12px', marginBottom: '10px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', marginBottom: '2px' }}>
              How to use
            </p>
            <p style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
              {attack.how_to_use}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <code style={{
              flex: 1, fontSize: '11px', fontFamily: "'Courier New', monospace",
              background: 'white', border: '1px solid #e4e4e7',
              borderRadius: '6px', padding: '8px 10px',
              wordBreak: 'break-all', lineHeight: 1.6, color: '#0a0a0a',
              display: 'block',
            }}>
              {attack.token}
            </code>
            <CopyButton text={attack.token} />
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  attacks: AttackVariant[]
}

export function AttackGenerator({ attacks }: Props) {
  const critical = attacks.filter((a) => a.severity === 'critical').length

  return (
    <div style={{
      background: 'white', border: '1px solid #e4e4e7',
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Attack generator</p>
          <p style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>
            Ready-to-fire attack variants — for authorized testing only
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
          }}>
            {critical} critical
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
            background: '#f4f4f5', color: '#3f3f46', border: '1px solid #e4e4e7',
          }}>
            {attacks.length} total
          </span>
        </div>
      </div>

      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
        fontSize: '12px', color: '#92400e',
      }}>
        ⚠ For authorized penetration testing and CTF use only. Never test against systems you don't own.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {attacks.map((a) => <AttackCard key={a.id} attack={a} />)}
      </div>
    </div>
  )
}