'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface LoadingRippleProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  speed?: number
  className?: string
  rippleCount?: number
}

export function LoadingRipple({
  size = 'md',
  color = '#3b82f6',
  speed = 1,
  className,
  rippleCount = 3
}: LoadingRippleProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const ripples = Array.from({ length: rippleCount }, (_, i) => i)

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {ripples.map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border-2"
          style={{
            borderColor: color,
            borderTopColor: 'transparent'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 1],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2 / speed,
            repeat: Infinity,
            delay: index * (0.5 / speed),
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Center dot */}
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}