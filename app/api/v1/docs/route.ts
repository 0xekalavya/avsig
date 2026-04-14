import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'AVSig API',
    version: '1.0.0',
    base_url: 'https://avsig.vercel.app/api/v1',
    endpoints: {
      'POST /inspect': {
        description: 'Decode and security-audit a JWT token',
        auth: 'X-API-Key header required',
        body: { token: 'string (required) — the raw JWT' },
        response: {
          success: 'boolean',
          meta: { plan: 'string', scanned_at: 'ISO8601' },
          data: {
            header: 'decoded header claims',
            payload: 'decoded payload claims',
            expiry: { status: 'valid | expired | none', at: 'ISO8601', unix: 'number' },
            summary: {
              total: 'number of checks run',
              passed: 'number',
              failed: 'number',
              critical: 'number of critical failures',
              warnings: 'number of warnings',
              risk: 'none | low | medium | critical',
            },
            checks: '[{ id, severity, title, detail, pass }]',
          },
        },
        example: {
          curl: `curl -X POST https://avsig.vercel.app/api/v1/inspect \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: your_key_here" \\\n  -d '{"token":"eyJhbGci..."}'`,
        },
      },
    },
    plans: {
      free: { requests: '100/day', features: ['inspect endpoint'] },
      pro: { requests: '10000/day', features: ['inspect endpoint', 'batch scanning', 'webhook alerts'] },
    },
    contact: 'https://instagram.com/ekalavya.dev',
  })
}