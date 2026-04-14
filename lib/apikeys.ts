export function validateApiKey(req: Request): { valid: boolean; plan: string | null } {
  const key = req.headers.get('X-API-Key') ?? req.headers.get('Authorization')?.replace('Bearer ', '')

  if (!key) return { valid: false, plan: null }

  
  const keys: Record<string, string> = {
    [process.env.API_KEY_TEST ?? 'avsig_test_key']: 'free',
    [process.env.API_KEY_PRO ?? '']: 'pro',
  }

  const plan = keys[key]
  if (!plan) return { valid: false, plan: null }

  return { valid: true, plan }
}