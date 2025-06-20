'use client'
import React from 'react'
import { useResponsive, Breakpoint } from '../hooks/useResponsive'

interface ResponsiveWrapperProps {
  children: React.ReactNode
  responsiveProps?: {
    desktop?: any
    tablet?: any
    mobile?: any
  }
  className?: string
}

export function ResponsiveWrapper({ children, responsiveProps, className }: ResponsiveWrapperProps) {
  const { breakpoint } = useResponsive()

  if (!responsiveProps) {
    return <div className={className}>{children}</div>
  }

  const currentProps = responsiveProps[breakpoint] || responsiveProps.desktop || {}
  const position = currentProps.position || { x: 0, y: 0 }

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: currentProps.width || 'auto',
        height: currentProps.height || 'auto',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  )
}