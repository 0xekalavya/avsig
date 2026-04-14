'use client'

import { useState } from 'react'
import { inspectJWT, JWTResult } from '@/lib/jwt'

interface Props {
  onResult: (result: JWTResult | null, error: string | null) => void
}

export function TokenInput({ onResult }: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  function handleChange(val: string) {
    setValue(val)
    if (!val.trim()) { onResult(null, null); return }
    try {
      onResult(inspectJWT(val.trim()), null)
    } catch (e) {
      onResult(null, (e as Error).message)
    }
  }

  function handlePaste() {
    navigator.clipboard.readText().then((t) => handleChange(t))
  }

  return (
    <div className="token-input-block">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: '#3f3f46' }}>
          JSON Web Token
        </label>
        <div className="token-input-actions" style={{ gap: '6px' }}>
          <button
            onClick={handlePaste}
            style={{
              fontSize: '12px', padding: '4px 12px',
              border: '1px solid #e4e4e7', borderRadius: '6px',
              background: 'white', color: '#3f3f46',
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            Paste
          </button>
          {value && (
            <button
              onClick={() => handleChange('')}
              style={{
                fontSize: '12px', padding: '4px 12px',
                border: '1px solid #e4e4e7', borderRadius: '6px',
                background: 'white', color: '#dc2626',
                cursor: 'pointer', fontWeight: 500,
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        style={{
          width: '100%', height: '120px',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px', padding: '12px 14px',
          background: 'white', color: '#0a0a0a',
          border: `1px solid ${focused ? '#a1a1aa' : '#e4e4e7'}`,
          borderRadius: '10px', resize: 'none',
          outline: 'none', lineHeight: 1.6,
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  )
}