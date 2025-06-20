'use client'

import React from 'react'
import { cn } from '../lib/utils'

interface CanvasBackgroundProps {
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto'
  backgroundPosition?: string
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  opacity?: number
  className?: string
  children?: React.ReactNode
  width?: number | string
  height?: number | string
  borderRadius?: string
  border?: string
  boxShadow?: string
}

export function CanvasBackground({
  backgroundColor = 'transparent',
  backgroundImage,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
  opacity = 1,
  className,
  children,
  width = '100%',
  height = '100%',
  borderRadius,
  border,
  boxShadow
}: CanvasBackgroundProps) {
  const backgroundStyle = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    opacity,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius,
    border,
    boxShadow
  }

  return (
    <div
      className={cn('canvas-background', className)}
      style={backgroundStyle}
    >
      {children}
    </div>
  )
}