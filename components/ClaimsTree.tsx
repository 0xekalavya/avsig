const typeColors: Record<string, string> = {
  string:  '#7c3aed',
  number:  '#d97706',
  boolean: '#dc2626',
  array:   '#0369a1',
  object:  '#0369a1',
  null:    '#71717a',
}

function getType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function formatValue(key: string, value: unknown): string {
  if (typeof value === 'number' && ['exp', 'iat', 'nbf'].includes(key))
    return `${value}  →  ${new Date(value * 1000).toUTCString()}`
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function Section({ title, data }: { title: string; data: Record<string, unknown> }) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {title}
      </p>
      <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
        {Object.entries(data).map(([key, value], i) => {
          const type = getType(value)
          return (
            <div key={key} className="claims-section-row" style={{
              padding: '9px 12px',
              borderTop: i === 0 ? 'none' : '1px solid #f4f4f5',
              background: i % 2 === 0 ? 'white' : '#fafafa',
            }}>
              <span className="claims-section-key" style={{
                fontFamily: "'Courier New', monospace", fontSize: '12px',
                color: '#3f3f46', minWidth: '110px', flexShrink: 0, fontWeight: 500,
              }}>
                {key}
              </span>
              <span className="claims-section-value" style={{
                fontFamily: "'Courier New', monospace", fontSize: '12px',
                color: typeColors[type] ?? '#0a0a0a',
                flex: 1, wordBreak: 'break-all', lineHeight: 1.6,
              }}>
                {formatValue(key, value)}
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 600, padding: '1px 6px',
                borderRadius: '4px', flexShrink: 0,
                color: typeColors[type] ?? '#71717a',
                background: '#f4f4f5',
              }}>
                {type}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ClaimsTree({ header, payload }: { header: Record<string, unknown>; payload: Record<string, unknown> }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e4e4e7',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Decoded claims</p>
      <Section title="Header" data={header} />
      <Section title="Payload" data={payload} />
    </div>
  )
}