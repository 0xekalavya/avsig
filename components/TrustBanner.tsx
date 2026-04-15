'use client'

import { useEffect, useRef, useState } from 'react'
import { TrustResult } from '@/lib/trust'
import { SecurityCheck } from '@/lib/jwt'

interface Props {
  trust: TrustResult
  checks: SecurityCheck[]
}

export function TrustBanner({ trust, checks }: Props) {
  const [visible, setVisible] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  
  useEffect(() => {
    setAnimated(false)
    setDisplayScore(0)
    const timeout = setTimeout(() => {
      setAnimated(true)
      let current = 0
      const step = Math.ceil(trust.score / 30)
      const interval = setInterval(() => {
        current = Math.min(current + step, trust.score)
        setDisplayScore(current)
        if (current >= trust.score) clearInterval(interval)
      }, 20)
    }, 100)
    return () => clearTimeout(timeout)
  }, [trust.score])

  const failed = checks.filter((c) => !c.pass)
  const critical = failed.filter((c) => c.severity === 'critical').length
  const warnings = failed.filter((c) => c.severity === 'warning').length

  return (
    <>
      
      <div
        ref={bannerRef}
        className="trust-banner"
        style={{
          background: trust.bg,
          border: `1px solid ${trust.border}`,
          borderRadius: '12px',
          padding: '16px 20px',
        }}
      >
        <div className="trust-banner__top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: trust.color, lineHeight: 1 }}>
                {displayScore}%
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: trust.color }}>
                {trust.label}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: trust.color, opacity: 0.8, marginTop: '3px' }}>
              {trust.sublabel}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {critical > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '20px', background: '#fef2f2',
                color: '#dc2626', border: '1px solid #fecaca',
              }}>
                {critical} critical
              </span>
            )}
            {warnings > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '20px', background: '#fffbeb',
                color: '#d97706', border: '1px solid #fde68a',
              }}>
                {warnings} warnings
              </span>
            )}
            {failed.length === 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '20px', background: '#f0fdf4',
                color: '#16a34a', border: '1px solid #bbf7d0',
              }}>
                all checks passed
              </span>
            )}
          </div>
        </div>

        
        <div style={{
          width: '100%', height: '6px',
          background: '#e4e4e7', borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: animated ? `${trust.score}%` : '0%',
            background: trust.bar,
            borderRadius: '999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
          {[
            { label: 'Checks run', value: checks.length },
            { label: 'Passed', value: checks.filter((c) => c.pass).length },
            { label: 'Failed', value: failed.length },
          ].map(({ label, value }) => (
            <div key={label}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: trust.color }}>{value}</span>
              <span style={{ fontSize: '11px', color: trust.color, opacity: 0.7, marginLeft: '4px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      
      <div className="trust-banner__fixed" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${trust.border}`,
        padding: '10px 24px',
      }}>
        <div className="trust-banner__fixed-inner" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: trust.color }}>
              {trust.score}%
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: trust.color }}>
              {trust.label}
            </span>
          </div>

          
          <div style={{
            flex: 1, height: '5px',
            background: '#e4e4e7', borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${trust.score}%`,
              background: trust.bar,
              borderRadius: '999px',
            }} />
          </div>

      
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {critical > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '20px', background: '#fef2f2',
                color: '#dc2626', border: '1px solid #fecaca',
              }}>
                {critical} critical
              </span>
            )}
            {warnings > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '20px', background: '#fffbeb',
                color: '#d97706', border: '1px solid #fde68a',
              }}>
                {warnings} warnings
              </span>
            )}
            {failed.length === 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '20px', background: '#f0fdf4',
                color: '#16a34a', border: '1px solid #bbf7d0',
              }}>
                clean
              </span>
            )}
          </div>

          
          <span style={{ fontSize: '11px', color: '#a1a1aa', flexShrink: 0 }}>
            avsig
          </span>
        </div>
      </div>
    </>
  )
}
