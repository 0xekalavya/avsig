import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimitFree = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 d'),
  analytics: true,
  prefix: 'avsig:free',
})

export const rateLimitPro = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10000, '1 d'),
  analytics: true,
  prefix: 'avsig:pro',
})