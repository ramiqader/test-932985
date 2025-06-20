'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '../lib/utils'

interface RadixProgressProps {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'striped' | 'glow'
  color?: string
  backgroundColor?: string
  borderRadius?: string
  showLabel?: boolean
  showPercentage?: boolean
  label?: string
  animationDuration?: number
  animationDelay?: number
  autoProgress?: boolean
  progressSpeed?: number
  triggerOnView?: boolean
  className?: string
  height?: string
  width?: string
}

export function RadixProgress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  borderRadius = '9999px',
  showLabel = true,
  showPercentage = true,
  label = 'Progress',
  animationDuration = 2,
  animationDelay = 0,
  autoProgress = false,
  progressSpeed = 1000,
  triggerOnView = true,
  className,
  height,
  width
}: RadixProgressProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Motion values for smooth animation
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: animationDuration * 1000,
    bounce: 0.2
  })

  // Auto progress functionality
  useEffect(() => {
    if (autoProgress && !hasAnimated) {
      const interval = setInterval(() => {
        setCurrentValue(prev => {
          const next = prev + 1
          if (next >= max) {
            clearInterval(interval)
            return max
          }
          return next
        })
      }, progressSpeed / max)

      return () => clearInterval(interval)
    }
  }, [autoProgress, hasAnimated, max, progressSpeed])

  // Animation trigger
  const shouldAnimate = triggerOnView ? isInView && !hasAnimated : !hasAnimated

  useEffect(() => {
    if (shouldAnimate) {
      setHasAnimated(true)
      if (!autoProgress) {
        setCurrentValue(value)
      }
      motionValue.set(value)
    }
  }, [shouldAnimate, value, autoProgress, motionValue])

  const displayValue = autoProgress ? currentValue : value
  const percentage = Math.min((displayValue / max) * 100, 100)

  // Size classes
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  // Get progress bar style based on variant
  const getProgressStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      borderRadius: borderRadius
    }

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`
        }
      case 'striped':
        return {
          ...baseStyle,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.2) 10px,
            rgba(255,255,255,0.2) 20px
          )`
        }
      case 'glow':
        return {
          ...baseStyle,
          boxShadow: `0 0 10px ${color}66`
        }
      default:
        return baseStyle
    }
  }

  const containerStyle = {
    width: width || '100%',
    height: height || 'auto'
  }

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      style={containerStyle}
    >
      {/* Label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {showLabel && (
            <motion.span
              className="text-gray-700 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: animationDelay }}
            >
              {label}
            </motion.span>
          )}
          {showPercentage && (
            <motion.span
              className="text-gray-600"
              initial={{ opacity: 0, x: 10 }}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: animationDelay }}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <ProgressPrimitive.Root
        className={cn(
          'relative overflow-hidden w-full',
          sizeClasses[size],
          className
        )}
        style={{
          backgroundColor: backgroundColor,
          borderRadius: borderRadius
        }}
        value={displayValue}
        max={max}
      >
        <ProgressPrimitive.Indicator
          asChild
        >
          <motion.div
            className="h-full w-full flex-1 transition-all"
            style={getProgressStyle()}
            initial={{ width: '0%', opacity: 0 }}
            animate={{
              width: `${percentage}%`,
              opacity: 1
            }}
            transition={{
              width: {
                duration: animationDuration,
                delay: animationDelay,
                ease: 'easeOut'
              },
              opacity: {
                duration: 0.3,
                delay: animationDelay
              }
            }}
          >
            {/* Animated shine effect for glow variant */}
            {variant === 'glow' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut'
                }}
              />
            )}

            {/* Pulse effect for striped variant */}
            {variant === 'striped' && (
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0px 0px', '40px 0px']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.2) 10px,
                    rgba(255,255,255,0.2) 20px
                  )`
                }}
              />
            )}
          </motion.div>
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>

      {/* Value indicator */}
      {displayValue > 0 && (
        <motion.div
          className="text-xs text-gray-500 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: animationDelay + 0.5 }}
        >
          {Math.round(displayValue)} / {max}
        </motion.div>
      )}
    </div>
  )
}