import { NextRequest, NextResponse } from 'next/server'
import { inspectJWT } from '@/lib/jwt'
import { validateApiKey } from '@/lib/apikeys'
import { rateLimitFree, rateLimitPro } from '@/lib/ratelimit'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Content-Type': 'application/json',
}

export async function POST(req: NextRequest) {
  // Auth
  const auth = validateApiKey(req)
  if (!auth.valid) {
    return NextResponse.json(
      {
        error: 'Invalid or missing API key',
        code: 'UNAUTHORIZED',
        docs: 'https://avsig.vercel.app/docs',
      },
      { status: 401, headers: corsHeaders }
    )
  }

  // Rate limit
  const limiter = auth.plan === 'pro' ? rateLimitPro : rateLimitFree
  const limit = auth.plan === 'pro' ? 10000 : 50

  const apiKey = req.headers.get('X-API-Key') ??
    req.headers.get('Authorization')?.replace('Bearer ', '') ?? 'unknown'

  const { success, remaining, reset } = await limiter.limit(apiKey)

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        code: 'RATE_LIMITED',
        limit,
        remaining: 0,
        reset: new Date(reset).toISOString(),
        docs: 'https://avsig.vercel.app/docs',
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    )
  }

  // Decode
  try {
    const body = await req.json()
    const token = body?.token

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid token field', code: 'INVALID_INPUT' },
        { status: 400, headers: corsHeaders }
      )
    }

    const result = inspectJWT(token.trim())
    const failed = result.checks.filter((c) => !c.pass)

    return NextResponse.json(
      {
        success: true,
        meta: {
          plan: auth.plan,
          scanned_at: new Date().toISOString(),
          docs: 'https://avsig.vercel.app/docs',
        },
        rate_limit: {
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        },
        data: {
          header: result.header,
          payload: result.payload,
          expiry: formatExpiry(result.expiry),
          checks: result.checks,
          summary: {
            total: result.checks.length,
            passed: result.checks.filter((c) => c.pass).length,
            failed: failed.length,
            critical: failed.filter((c) => c.severity === 'critical').length,
            warnings: failed.filter((c) => c.severity === 'warning').length,
            risk: getRiskLevel(result.checks),
          },
        },
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    )
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message, code: 'DECODE_FAILED' },
      { status: 422, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

function formatExpiry(expiry: { status: string; at?: Date }) {
  if (expiry.status === 'none') return { status: 'none', message: 'No expiry set' }
  return {
    status: expiry.status,
    at: expiry.at?.toISOString(),
    unix: expiry.at ? Math.floor(expiry.at.getTime() / 1000) : null,
  }
}

function getRiskLevel(checks: { pass: boolean; severity: string }[]): string {
  const failed = checks.filter((c) => !c.pass)
  if (failed.some((c) => c.severity === 'critical')) return 'critical'
  if (failed.some((c) => c.severity === 'warning')) return 'medium'
  if (failed.length > 0) return 'low'
  return 'none'
}