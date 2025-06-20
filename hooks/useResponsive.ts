'use client'
import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width <= 640) {
        setBreakpoint('mobile')
      } else if (width <= 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return { breakpoint }
}

export function getBreakpointProps(responsiveProps: any, breakpoint: Breakpoint) {
  const baseProps = responsiveProps?.desktop || {}
  const currentProps = responsiveProps?.[breakpoint] || baseProps
  return { ...baseProps, ...currentProps }
}