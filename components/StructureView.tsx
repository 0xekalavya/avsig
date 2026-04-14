interface Props {
  raw: { header: string; payload: string; signature: string }
}

function Part({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: '11px',
        color, background: bg, borderRadius: '6px',
        padding: '8px 10px', wordBreak: 'break-all', lineHeight: 1.6,
      }}>
        {value}
      </div>
    </div>
  )
}

export function StructureView({ raw }: Props) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e4e4e7',
      borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Token structure</p>
      <Part label="Header"    value={raw.header}    color="#0369a1" bg="#f0f9ff" />
      <Part label="Payload"   value={raw.payload}   color="#7c3aed" bg="#faf5ff" />
      <Part label="Signature" value={raw.signature} color="#059669" bg="#f0fdf4" />
    </div>
  )
}