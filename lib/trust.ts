import { SecurityCheck } from './jwt'

export type TrustResult = {
  score: number
  label: string
  sublabel: string
  color: string
  bg: string
  border: string
  bar: string
}

export function calculateTrust(checks: SecurityCheck[]): TrustResult {
  let score = 100

  checks.forEach((check) => {
    if (check.pass) return
    if (check.severity === 'critical') score -= 40
    if (check.severity === 'warning') score -= 15
    if (check.severity === 'info') score -= 5
  })

  score = Math.max(0, score)

  if (score >= 90) return {
    score,
    label: 'Trusted',
    sublabel: 'No significant issues found',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    bar: '#22c55e',
  }

  if (score >= 70) return {
    score,
    label: 'Mostly Safe',
    sublabel: 'Minor issues detected — review warnings',
    color: '#ca8a04',
    bg: '#fefce8',
    border: '#fde047',
    bar: '#eab308',
  }

  if (score >= 40) return {
    score,
    label: 'Suspicious',
    sublabel: 'Significant issues — do not trust blindly',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    bar: '#f97316',
  }

  return {
    score,
    label: 'Dangerous',
    sublabel: 'Critical vulnerabilities detected',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    bar: '#ef4444',
  }
}