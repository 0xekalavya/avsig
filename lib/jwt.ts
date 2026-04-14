import { decodeJwt, decodeProtectedHeader } from 'jose'

export type Severity = 'critical' | 'warning' | 'info'

export type SecurityCheck = {
  id: string
  severity: Severity
  title: string
  detail: string
  pass: boolean
}

export type ExpiryInfo =
  | { status: 'expired'; at: Date }
  | { status: 'valid'; at: Date }
  | { status: 'none' }

export type JWTResult = {
  raw: { header: string; payload: string; signature: string }
  header: Record<string, unknown>
  payload: Record<string, unknown>
  checks: SecurityCheck[]
  expiry: ExpiryInfo
}

export function inspectJWT(token: string): JWTResult {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT — must have 3 parts separated by dots')

  const header = decodeProtectedHeader(token) as Record<string, unknown>
  const payload = decodeJwt(token) as Record<string, unknown>

  return {
    raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    header,
    payload,
    checks: runChecks(header, payload),
    expiry: getExpiry(payload),
  }
}

function getExpiry(payload: Record<string, unknown>): ExpiryInfo {
  if (!('exp' in payload)) return { status: 'none' }
  const at = new Date((payload.exp as number) * 1000)
  return at < new Date() ? { status: 'expired', at } : { status: 'valid', at }
}

function runChecks(
  header: Record<string, unknown>,
  payload: Record<string, unknown>
): SecurityCheck[] {
  const alg = header.alg as string | undefined

  return [
    {
      id: 'alg-none',
      severity: 'critical' as const,
      title: 'Algorithm: none',
      detail:
        'alg=none disables signature verification entirely. Any server accepting this token is critically vulnerable (CVE-2015-9235).',
      pass: !['none', 'None', 'NONE'].includes(alg ?? ''),
    },
    {
      id: 'jku-present',
      severity: 'critical' as const,
      title: 'jku / x5u header present',
      detail:
        'Server may fetch signing keys from this attacker-controlled URL. If not validated against an allowlist, tokens can be forged.',
      pass: !('jku' in header) && !('x5u' in header),
    },
    {
      id: 'exp-missing',
      severity: 'warning' as const,
      title: 'No expiry (exp claim missing)',
      detail:
        'Tokens without exp never expire. A stolen token stays valid forever.',
      pass: 'exp' in payload,
    },
    {
      id: 'exp-far',
      severity: 'warning' as const,
      title: 'Expiry longer than 24 hours',
      detail:
        'Long-lived tokens increase the blast radius of theft. Prefer short-lived tokens + refresh token rotation.',
      pass:
        !payload.exp ||
        (payload.exp as number) - Date.now() / 1000 < 86400,
    },
    {
      id: 'sensitive-claims',
      severity: 'warning' as const,
      title: 'Possible sensitive data in payload',
      detail:
        'JWT payload is base64-encoded, not encrypted — anyone can decode it. Never store passwords, secrets, or PII here.',
      pass: !JSON.stringify(payload)
        .toLowerCase()
        .match(/password|secret|ssn|credit.?card|cvv|private.?key/),
    },
    {
      id: 'nbf-future',
      severity: 'warning' as const,
      title: 'nbf (not-before) is in the future',
      detail:
        'Token is not yet valid. This may indicate clock skew or a misconfigured issuer.',
      pass:
        !('nbf' in payload) ||
        (payload.nbf as number) <= Date.now() / 1000,
    },
    {
      id: 'kid-present',
      severity: 'info' as const,
      title: 'kid header present',
      detail:
        'kid selects the verification key. Ensure your server validates it strictly — unsanitized kid values have led to SQL injection and path traversal bugs.',
      pass: true,
    },
    {
      id: 'weak-secret-hint',
      severity: 'info' as const,
      title: 'HS256/384/512 — symmetric algorithm',
      detail:
        'HMAC algorithms use a shared secret. If that secret is weak or leaked, tokens can be forged. Prefer RS256 or ES256 for public-facing APIs.',
      pass: !['HS256', 'HS384', 'HS512'].includes(alg ?? ''),
    },
  ].filter((check) => {
    if (check.id === 'kid-present') return 'kid' in header
    if (check.id === 'exp-far') return 'exp' in payload
    if (check.id === 'nbf-future') return 'nbf' in payload
    return true
  })
}