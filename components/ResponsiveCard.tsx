'use client'

import React, { useState, useEffect } from 'react'


interface ResponsiveCardProps {
  desktopProps: any
  tabletProps: any
  mobileProps: any
}


export function ResponsiveCard({ desktopProps, tabletProps, mobileProps }: ResponsiveCardProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width <= 640) {
        setCurrentBreakpoint('mobile')
      } else if (width <= 1024) {
        setCurrentBreakpoint('tablet')
      } else {
        setCurrentBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  const getCurrentProps = () => {
    switch (currentBreakpoint) {
      case 'mobile': return mobileProps
      case 'tablet': return tabletProps
      default: return desktopProps
    }
  }

  const props = getCurrentProps()

  return (
    <div className="card-component rounded-lg shadow-md border" style={{
      width: props?.width || '300px',
      height: props?.height || 'auto',
      backgroundColor: props?.backgroundColor || 'var(--theme-surface, #ffffff)',
      borderColor: props?.borderColor || 'var(--theme-border, #e5e7eb)',
      borderRadius: props?.borderRadius || '8px',
      padding: props?.padding || '24px',
      boxShadow: props?.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      color: props?.textColor || 'var(--theme-text, #1f2937)',
      border: `1px solid ${props?.borderColor || 'var(--theme-border, #e5e7eb)'}`
    }}>
      <h3 className="font-semibold mb-2" style={{
        fontSize: props?.titleSize || '18px',
        color: props?.titleColor || 'var(--theme-text, #1f2937)',
        marginBottom: '8px'
      }}>{props?.title || 'Card Title'}</h3>
      <p className="mb-4" style={{
        fontSize: props?.descriptionSize || '14px',
        color: props?.descriptionColor || 'var(--theme-text-secondary, #6b7280)',
        marginBottom: '16px'
      }}>{props?.description || 'Card description'}</p>
      <div style={{
        fontSize: props?.contentSize || '16px',
        color: props?.contentColor || 'var(--theme-text, #374151)'
      }}>{props?.content || 'Card content'}</div>
    </div>
  )
}