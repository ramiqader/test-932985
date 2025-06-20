'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../lib/utils'

export interface StatItem {
  id: string
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

export interface NumberEngagementStatsProps {
  stats?: StatItem[]
  customStats?: string // JSON string for custom stats
  layout?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'card' | 'minimal' | 'gradient'
  animationDuration?: number
  animationDelay?: number
  showIcons?: boolean
  showLabels?: boolean
  autoStart?: boolean
  triggerOnView?: boolean
  className?: string
}

const defaultStats: StatItem[] = [
  {
    id: 'views',
    label: 'Views',
    value: 1234,
    suffix: 'K',
    icon: '👁️',
    color: '#3b82f6',
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  {
    id: 'likes',
    label: 'Likes',
    value: 567,
    suffix: '',
    icon: '❤️',
    color: '#ef4444',
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  {
    id: 'shares',
    label: 'Shares',
    value: 89,
    suffix: '',
    icon: '🔄',
    color: '#10b981',
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  {
    id: 'comments',
    label: 'Comments',
    value: 234,
    suffix: '',
    icon: '💬',
    color: '#f59e0b',
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  }
]

export function NumberEngagementStats({
  stats = defaultStats,
  customStats,
  layout = 'horizontal',
  size = 'md',
  variant = 'minimal',
  animationDuration = 2,
  animationDelay = 0.2,
  showIcons = true,
  showLabels = false,
  autoStart = true,
  triggerOnView = true,
  className
}: NumberEngagementStatsProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [likedStats, setLikedStats] = useState<Set<string>>(new Set())
  const [activeStats, setActiveStats] = useState<Set<string>>(new Set())
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Parse custom stats if provided
  let parsedStats = stats
  if (customStats) {
    try {
      const parsed = JSON.parse(customStats)
      if (Array.isArray(parsed)) {
        parsedStats = parsed
      }
    } catch (e) {
      console.warn('Failed to parse custom stats, using default stats:', e)
    }
  }

  // Animation trigger
  const shouldAnimate = triggerOnView ? isInView && !hasAnimated : autoStart && !hasAnimated

  useEffect(() => {
    if (shouldAnimate) {
      setHasAnimated(true)
    }
  }, [shouldAnimate])

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'gap-2 p-2',
      stat: 'p-2',
      value: 'text-lg',
      label: 'text-xs',
      icon: 'text-sm'
    },
    md: {
      container: 'gap-4 p-4',
      stat: 'p-3',
      value: 'text-2xl',
      label: 'text-sm',
      icon: 'text-lg'
    },
    lg: {
      container: 'gap-6 p-6',
      stat: 'p-4',
      value: 'text-3xl',
      label: 'text-base',
      icon: 'text-xl'
    }
  }

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex flex-row items-center justify-center',
    vertical: 'flex flex-col items-center',
    grid: 'grid grid-cols-2 gap-4'
  }

  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    card: 'bg-white border border-gray-200 rounded-xl shadow-md',
    minimal: 'bg-transparent',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-xl'
  }

  const handleStatClick = (statId: string) => {
    setLikedStats(prev => {
      const newSet = new Set(prev)
      if (newSet.has(statId)) {
        newSet.delete(statId)
      } else {
        newSet.add(statId)
      }
      return newSet
    })

    setActiveStats(prev => {
      const newSet = new Set(prev)
      newSet.add(statId)
      setTimeout(() => {
        setActiveStats(current => {
          const updated = new Set(current)
          updated.delete(statId)
          return updated
        })
      }, 200)
      return newSet
    })
  }

  return (
    <div
      ref={ref}
      className={cn(
        'stats-container',
        layoutClasses[layout],
        variantClasses[variant],
        sizeClasses[size].container,
        className
      )}
    >
      {parsedStats.map((stat, index) => (
        <motion.div
          key={stat.id}
          className={cn(
            'stat-item cursor-pointer transition-all duration-200 hover:scale-105',
            sizeClasses[size].stat,
            variant !== 'minimal' && 'rounded-lg',
            activeStats.has(stat.id) && 'scale-95',
            likedStats.has(stat.id) && 'ring-2 ring-blue-400'
          )}
          style={{
            backgroundColor: stat.backgroundColor || 'transparent',
            borderColor: stat.borderColor || 'transparent',
            borderWidth: stat.borderColor !== 'transparent' ? '1px' : '0'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: animationDuration / 2,
            delay: animationDelay + (index * 0.1),
            ease: "easeOut"
          }}
          onClick={() => handleStatClick(stat.id)}
        >
          <div className="flex items-center justify-center space-x-2">
            {showIcons && stat.icon && (
              <motion.span
                className={cn('stat-icon', sizeClasses[size].icon)}
                initial={{ scale: 0 }}
                animate={shouldAnimate ? { scale: 1 } : {}}
                transition={{
                  duration: 0.3,
                  delay: animationDelay + (index * 0.1) + 0.2,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {stat.icon}
              </motion.span>
            )}

            <div className="text-center">
              <motion.div
                className={cn(
                  'stat-value font-bold',
                  sizeClasses[size].value
                )}
                style={{ color: stat.color || '#1f2937' }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={shouldAnimate ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay + (index * 0.1),
                  ease: "easeOut"
                }}
              >
                {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
              </motion.div>

              {showLabels && stat.label && (
                <motion.div
                  className={cn(
                    'stat-label text-gray-600 font-medium',
                    sizeClasses[size].label
                  )}
                  initial={{ opacity: 0 }}
                  animate={shouldAnimate ? { opacity: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: animationDelay + (index * 0.1) + 0.3
                  }}
                >
                  {stat.label}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}