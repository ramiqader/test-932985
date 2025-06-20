'use client'

import React, { useState, useEffect } from 'react'


interface ResponsiveButtonProps {
  desktopProps: any
  tabletProps: any
  mobileProps: any
}


export function ResponsiveButton({ desktopProps, tabletProps, mobileProps }: ResponsiveButtonProps) {
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
    <button
      className="px-4 py-2 rounded font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
      style={{
        backgroundColor: props?.backgroundColor || 'var(--theme-primary, #3b82f6)',
        color: props?.color || 'var(--theme-surface, #ffffff)',
        borderRadius: props?.borderRadius || '6px',
        padding: props?.padding || '8px 16px',
        fontSize: props?.fontSize || '14px',
        fontWeight: props?.fontWeight || '500',
        border: props?.border || 'none',
        width: props?.width || 'auto',
        height: props?.height || 'auto'
      }}
      onClick={() => {}}
    >
      {props?.text || 'Button'}
    </button>
  )
}