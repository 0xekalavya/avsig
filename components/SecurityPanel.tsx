import { SecurityCheck, Severity } from '@/lib/jwt'

const severityConfig = {
  critical: { label: 'Critical', color: '#dc2626', border: '#fecaca', bg: '#fef2f2', dot: '#dc2626' },
  warning:  { label: 'Warning',  color: '#d97706', border: '#fde68a', bg: '#fffbeb', dot: '#f59e0b' },
  info:     { label: 'Info',     color: '#2563eb', border: '#bfdbfe', bg: '#eff6ff', dot: '#3b82f6' },
} as const

function CheckRow({ check }: { check: SecurityCheck }) {
  const cfg = severityConfig[check.severity]
  const failed = !check.pass
  if (!failed && check.severity !== 'info') return null

  return (
    <div style={{
      border: `1px solid ${failed ? cfg.border : '#d1fae5'}`,
      background: failed ? cfg.bg : '#f0fdf4',
      borderRadius: '8px', padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
          background: failed ? cfg.dot : '#22c55e',
        }} />
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', flex: 1 }}>
          {check.title}
        </span>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 8px',
          borderRadius: '4px',
          background: failed ? cfg.bg : '#dcfce7',
          color: failed ? cfg.color : '#166534',
          border: `1px solid ${failed ? cfg.border : '#bbf7d0'}`,
        }}>
          {failed ? cfg.label : 'Pass'}
        </span>
      </div>
      {failed && (
        <p style={{ fontSize: '12px', color: '#71717a', marginTop: '8px', paddingLeft: '15px', lineHeight: 1.6 }}>
          {check.detail}
        </p>
      )}
    </div>
  )
}

export function SecurityPanel({ checks }: { checks: SecurityCheck[] }) {
  const failed = checks.filter((c) => !c.pass)
  const passed = checks.filter((c) => c.pass)

  return (
    <div style={{
      background: 'white', border: '1px solid #e4e4e7',
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>Security audit</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {failed.length > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
              background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
            }}>
              {failed.length} issue{failed.length > 1 ? 's' : ''}
            </span>
          )}
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
            background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
          }}>
            {passed.length} passed
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[...failed, ...passed].map((c) => <CheckRow key={c.id} check={c} />)}
      </div>
      {failed.length === 0 && (
        <div style={{
          marginTop: '10px', border: '1px solid #bbf7d0', background: '#f0fdf4',
          borderRadius: '8px', padding: '12px 14px',
          fontSize: '13px', fontWeight: 500, color: '#166534',
        }}>
          No issues found - token looks clean
        </div>
      )}
    </div>
  )
}