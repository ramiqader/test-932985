'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

export interface BadgeState {
  id: string
  label: string
  color: string
  backgroundColor: string
  borderColor?: string
  icon?: string
}

export interface MultiStateBadgeProps {
  states?: BadgeState[]
  currentState?: string
  autoProgress?: boolean
  progressInterval?: number
  onClick?: (state: BadgeState) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'filled'
  animationDuration?: number
  showIcon?: boolean
  customStates?: string // JSON string for custom states
}

const defaultStates: BadgeState[] = [
  {
    id: 'pending',
    label: 'Pending',
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    icon: '⏳'
  },
  {
    id: 'processing',
    label: 'Processing',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    icon: '⚙️'
  },
  {
    id: 'completed',
    label: 'Completed',
    color: '#10b981',
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    icon: '✅'
  },
  {
    id: 'failed',
    label: 'Failed',
    color: '#ef4444',
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    icon: '❌'
  }
]

export function MultiStateBadge({
  states = defaultStates,
  currentState,
  autoProgress = true,
  progressInterval = 2000,
  onClick,
  className,
  size = 'md',
  variant = 'default',
  animationDuration = 0.3,
  showIcon = true,
  customStates
}: MultiStateBadgeProps) {
  // Parse custom states if provided
  let parsedStates = states
  if (customStates) {
    try {
      const parsed = JSON.parse(customStates)
      if (Array.isArray(parsed)) {
        parsedStates = parsed
      }
    } catch (e) {
      // Use default states if parsing fails
    }
  }

  const [currentStateIndex, setCurrentStateIndex] = useState(
    currentState ? parsedStates.findIndex(s => s.id === currentState) : 0
  )

  useEffect(() => {
    if (autoProgress && parsedStates.length > 1) {
      const interval = setInterval(() => {
        setCurrentStateIndex(prev => (prev + 1) % parsedStates.length)
      }, progressInterval)

      return () => clearInterval(interval)
    }
  }, [autoProgress, progressInterval, parsedStates.length])

  const currentBadgeState = parsedStates[currentStateIndex] || parsedStates[0]

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  // Variant classes
  const getVariantClasses = (state: BadgeState) => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: state.color,
          borderColor: state.color,
          borderWidth: '1px'
        }
      case 'filled':
        return {
          backgroundColor: state.color,
          color: '#ffffff',
          borderColor: state.color,
          borderWidth: '1px'
        }
      default:
        return {
          backgroundColor: state.backgroundColor,
          color: state.color,
          borderColor: state.borderColor || state.color,
          borderWidth: '1px'
        }
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick(currentBadgeState)
    }
  }

  const badgeStyles = getVariantClasses(currentBadgeState)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBadgeState.id}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium cursor-pointer transition-all duration-200 hover:scale-105 border',
          sizeClasses[size],
          className
        )}
        style={badgeStyles}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: animationDuration }}
        onClick={handleClick}
      >
        {showIcon && currentBadgeState.icon && (
          <span className="mr-1">
            {currentBadgeState.icon}
          </span>
        )}
        <span>{currentBadgeState.label}</span>
      </motion.div>
    </AnimatePresence>
  )
}