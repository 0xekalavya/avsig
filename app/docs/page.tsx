'use client'
import Link from 'next/link'
import { useState } from 'react'

const checks = [
  { id: 'alg-none',         severity: 'critical', title: 'Algorithm None',              desc: 'Detects alg=none which disables signature verification (CVE-2015-9235)' },
  { id: 'jku-present',      severity: 'critical', title: 'JKU / X5U Header',            desc: 'Flags jku/x5u headers that may allow attacker-controlled key fetching' },
  { id: 'exp-missing',      severity: 'warning',  title: 'Missing Expiry',              desc: 'Token has no exp claim — never expires' },
  { id: 'exp-far',          severity: 'warning',  title: 'Long Expiry',                 desc: 'Token expires more than 24 hours from now' },
  { id: 'sensitive-claims', severity: 'warning',  title: 'Sensitive Data in Payload',   desc: 'Payload may contain passwords, secrets or PII' },
  { id: 'nbf-future',       severity: 'warning',  title: 'NBF in Future',               desc: 'Token not yet valid — possible misconfiguration' },
  { id: 'kid-present',      severity: 'info',     title: 'KID Header Present',          desc: 'kid header found — warns about unsanitized key ID injection risks' },
  { id: 'weak-secret-hint', severity: 'info',     title: 'Symmetric Algorithm',         desc: 'HS256/384/512 detected — recommends asymmetric algorithms' },
]

const severityColors = {
  critical: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
  warning:  { bg: '#fffbeb', border: '#fde68a', color: '#d97706' },
  info:     { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontSize: '12px', background: '#f4f4f5', padding: '2px 6px',
      borderRadius: '4px', color: '#0a0a0a', fontFamily: "'Courier New', monospace",
    }}>
      {children}
    </code>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginBottom: '48px' }}>
      <h2 style={{
        fontSize: '18px', fontWeight: 700, color: '#0a0a0a',
        letterSpacing: '-0.02em', marginBottom: '16px',
        paddingBottom: '12px', borderBottom: '1px solid #f4f4f5',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      background: '#0a0a0a', color: '#e4e4e7',
      borderRadius: '10px', padding: '16px 20px',
      fontSize: '12px', fontFamily: "'Courier New', monospace",
      overflowX: 'auto', lineHeight: 1.7,
      margin: '12px 0',
    }}>
      {children}
    </pre>
  )
}

function Badge({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  const cfg = severityColors[severity]
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, padding: '2px 8px',
      borderRadius: '4px', background: cfg.bg,
      color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {severity}
    </span>
  )
}

export default function DocsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="docs-page" style={{ minHeight: '100vh', background: '#fafafa' }}>
      <div className="docs-container">

        
        <aside className="docs-sidebar">
          <Link href="/" style={{
            position: 'sticky', top: 0, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: '8px',
            textDecoration: 'none', marginBottom: '16px',
            padding: '16px 0', background: '#fafafa',
          }}>
            <div style={{
              width: '24px', height: '24px', background: '#0a0a0a',
              borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a' }}>avsig</span>
          </Link>

          <nav className={`docs-toc-nav ${menuOpen ? 'docs-toc-nav--open' : ''}`} style={{ position: 'sticky', top: '80px', background: '#fafafa', zIndex: 1 }}>
            {[
              { href: '#overview',     label: 'Overview' },
              { href: '#auth',         label: 'Authentication' },
              { href: '#inspect',      label: 'POST /inspect' },
              { href: '#response',     label: 'Response schema' },
              { href: '#checks',       label: 'Security checks' },
              { href: '#errors',       label: 'Error codes' },
              { href: '#examples',     label: 'Code examples' },
              { href: '#plans',        label: 'Plans & limits' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="docs-toc-link">
                {label}
              </a>
            ))}
          </nav>
        </aside>

        
        <div className="docs-main">

          
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '20px', padding: '3px 12px', marginBottom: '16px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>v1.0 - live</span>
            </div>
            <h1 style={{
              fontSize: '32px', fontWeight: 700, color: '#0a0a0a',
              letterSpacing: '-0.03em', marginBottom: '12px',
            }}>
              API Reference
            </h1>
            <p style={{ fontSize: '15px', color: '#71717a', lineHeight: 1.7, maxWidth: '520px' }}>
              Integrate JWT security scanning directly into your CI/CD pipeline, auth middleware, or security toolchain.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Code>Base URL: https://avsig.vercel.app/api/v1</Code>
            </div>
          </div>

          
          <Section id="overview" title="Overview">
            <p style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.7, marginBottom: '12px' }}>
              The avsig API lets you programmatically decode and audit JSON Web Tokens. Send a JWT, get back a full security report - decoded claims, expiry status, and results of 8 automated security checks with a trust score.
            </p>
            <p style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.7 }}>
              All endpoints return JSON. Authentication is via API key passed in the <Code>X-API-Key</Code> header.
            </p>
          </Section>

          
          <Section id="auth" title="Authentication">
            <p style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.7, marginBottom: '12px' }}>
              Pass your API key in the <Code>X-API-Key</Code> header on every request. Alternatively use the <Code>Authorization: Bearer {'<key>'}</Code> header.
            </p>
            <CodeBlock>{`POST /api/v1/inspect
X-API-Key: avsig_your_key_here
Content-Type: application/json`}</CodeBlock>
            <div style={{
              background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '13px', color: '#92400e', marginTop: '12px',
            }}>
              Keep your API key secret. Do not expose it in client-side code or public repositories.
            </div>
          </Section>

          
          <Section id="inspect" title="POST /inspect">
            <p style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.7, marginBottom: '16px' }}>
              Decodes and audits a JWT token. Returns decoded claims, expiry info, trust score, and all security check results.
            </p>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>Request body</p>
            <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              {[
                { field: 'token', type: 'string', required: true, desc: 'The raw JWT string to inspect' },
              ].map(({ field, type, required, desc }) => (
                <div key={field} style={{
                  display: 'grid', gridTemplateColumns: '120px 80px 60px 1fr',
                  gap: '12px', padding: '10px 14px',
                  fontSize: '13px', fontFamily: "'Courier New', monospace",
                  background: 'white',
                }}>
                  <span style={{ color: '#7c3aed', fontWeight: 500 }}>{field}</span>
                  <span style={{ color: '#d97706' }}>{type}</span>
                  <span style={{ color: required ? '#dc2626' : '#a1a1aa' }}>{required ? 'required' : 'optional'}</span>
                  <span style={{ color: '#71717a', fontFamily: 'inherit' }}>{desc}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>Example request</p>
            <CodeBlock>{`curl -X POST https://avsig.vercel.app/api/v1/inspect \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: avsig_your_key_here" \\
  -d '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}'`}</CodeBlock>
          </Section>

          
          <Section id="response" title="Response schema">
            <CodeBlock>{`{
  "success": true,
  "meta": {
    "plan": "free",
    "scanned_at": "2026-04-12T16:18:39.262Z",
    "docs": "https://avsig.vercel.app/docs"
  },
  "data": {
    "header": {
      "alg": "HS256",
      "typ": "JWT"
    },
    "payload": {
      "sub": "1234567890",
      "name": "sadiq salodgi",
      "iat": 1516239022
    },
    "expiry": {
      "status": "none",
      "message": "No expiry set"
    },
    "summary": {
      "total": 8,
      "passed": 6,
      "failed": 2,
      "critical": 0,
      "warnings": 2,
      "risk": "medium"
    },
    "checks": [
      {
        "id": "alg-none",
        "severity": "critical",
        "title": "Algorithm None",
        "detail": "alg=none disables signature verification...",
        "pass": true
      }
    ]
  }
}`}</CodeBlock>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { field: 'data.summary.risk', desc: 'Overall risk level: none · low · medium · critical' },
                { field: 'data.expiry.status', desc: 'Token expiry status: valid · expired · none' },
                { field: 'data.checks[].pass', desc: 'true = check passed, false = issue detected' },
                { field: 'data.checks[].severity', desc: 'Severity of the check: critical · warning · info' },
              ].map(({ field, desc }) => (
                <div key={field} style={{
                  display: 'flex', gap: '12px', fontSize: '13px',
                  padding: '8px 12px', background: 'white',
                  border: '1px solid #f4f4f5', borderRadius: '6px',
                }}>
                  <Code>{field}</Code>
                  <span style={{ color: '#71717a' }}>{desc}</span>
                </div>
              ))}
            </div>
          </Section>

          
          <Section id="checks" title="Security checks">
            <p style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.7, marginBottom: '16px' }}>
              Every token is run through 8 automated checks. Results are returned in the <Code>data.checks</Code> array.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {checks.map((check) => (
                <div key={check.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '10px 14px', background: 'white',
                  border: '1px solid #e4e4e7', borderRadius: '8px',
                }}>
                  <Code>{check.id}</Code>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a' }}>{check.title}</span>
                    <p style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>{check.desc}</p>
                  </div>
                  <Badge severity={check.severity as 'critical' | 'warning' | 'info'} />
                </div>
              ))}
            </div>
          </Section>

          
          <Section id="errors" title="Error codes">
            <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
              {[
                { status: '400', code: 'INVALID_INPUT',  desc: 'Missing or invalid token field in request body' },
                { status: '401', code: 'UNAUTHORIZED',   desc: 'Missing or invalid API key' },
                { status: '422', code: 'DECODE_FAILED',  desc: 'Token could not be decoded — malformed JWT' },
                { status: '429', code: 'RATE_LIMITED',   desc: 'Too many requests — upgrade plan or wait' },
              ].map(({ status, code, desc }, i) => (
                <div key={code} style={{
                  display: 'grid', gridTemplateColumns: '60px 160px 1fr',
                  gap: '16px', padding: '10px 14px',
                  borderTop: i === 0 ? 'none' : '1px solid #f4f4f5',
                  background: i % 2 === 0 ? 'white' : '#fafafa',
                  fontSize: '13px',
                }}>
                  <span style={{
                    fontFamily: "'Courier New', monospace", fontWeight: 600,
                    color: status === '401' || status === '429' ? '#dc2626' : '#d97706',
                  }}>
                    {status}
                  </span>
                  <Code>{code}</Code>
                  <span style={{ color: '#71717a' }}>{desc}</span>
                </div>
              ))}
            </div>
          </Section>

          
          <Section id="examples" title="Code examples">
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '8px' }}>JavaScript / Node.js</p>
            <CodeBlock>{`const response = await fetch('https://avsig.vercel.app/api/v1/inspect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'avsig_your_key_here',
  },
  body: JSON.stringify({ token: userJWT }),
})

const { data } = await response.json()

if (data.summary.risk === 'critical') {
  throw new Error('Dangerous JWT detected — blocking request')
}

console.log('Trust score:', data.summary.passed, '/', data.summary.total)`}</CodeBlock>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: '20px 0 8px' }}>Python</p>
            <CodeBlock>{`import requests

response = requests.post(
    'https://avsig.vercel.app/api/v1/inspect',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'avsig_your_key_here',
    },
    json={'token': user_jwt}
)

data = response.json()['data']

if data['summary']['critical'] > 0:
    raise Exception('Critical JWT vulnerability detected')`}</CodeBlock>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: '20px 0 8px' }}>GitHub Actions</p>
            <CodeBlock>{`- name: Scan JWT security
  run: |
    RESULT=$(curl -s -X POST https://avsig.vercel.app/api/v1/inspect \\
      -H "Content-Type: application/json" \\
      -H "X-API-Key: \${{ secrets.AVSIG_API_KEY }}" \\
      -d "{\\"token\\":\\"$JWT_TOKEN\\"}")
    
    RISK=$(echo $RESULT | jq -r '.data.summary.risk')
    
    if [ "$RISK" = "critical" ]; then
      echo "Critical JWT vulnerability found — failing build"
      exit 1
    fi`}</CodeBlock>
          </Section>

          
          <Section id="plans" title="Plans & limits">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                {
                  name: 'Free',
                  price: '$0',
                  requests: '100 req / day',
                  features: ['POST /inspect', 'All 8 security checks', 'JSON response', 'Community support'],
                  cta: 'Get free key',
                  highlight: false,
                },
                {
                  name: 'Pro',
                  price: '$49/mo',
                  requests: '10,000 req / day',
                  features: ['Everything in Free', 'Batch scanning', 'Webhook alerts', 'Priority support', 'SLA guarantee'],
                  cta: 'Contact us',
                  highlight: true,
                },
              ].map(({ name, price, requests, features, cta, highlight }) => (
                <div key={name} style={{
                  background: 'white',
                  border: `${highlight ? '2px' : '1px'} solid ${highlight ? '#0a0a0a' : '#e4e4e7'}`,
                  borderRadius: '12px', padding: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a' }}>{name}</p>
                    {highlight && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                        borderRadius: '4px', background: '#0a0a0a', color: 'white',
                      }}>
                        Popular
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#0a0a0a', marginBottom: '2px' }}>{price}</p>
                  <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '16px' }}>{requests}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    {features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3f3f46' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://instagram.com/ekalavya.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '8px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: 500,
                      textDecoration: 'none',
                      background: highlight ? '#0a0a0a' : 'transparent',
                      color: highlight ? 'white' : '#0a0a0a',
                      border: `1px solid ${highlight ? '#0a0a0a' : '#e4e4e7'}`,
                    }}
                  >
                    {cta}
                  </a>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </main>
  )
}
