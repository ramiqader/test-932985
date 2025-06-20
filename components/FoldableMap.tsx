'use client'

import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../lib/utils'

export interface FoldableMapProps {
  mapImage?: string
  width?: number | string
  height?: number | string
  className?: string
  dragConstraint?: number
  autoSnap?: boolean
  snapThreshold?: number
  backgroundColor?: string
  borderRadius?: string
  shadow?: boolean
}

export function FoldableMap({
  mapImage = 'https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=1200&h=800&fit=crop&crop=center',
  width = 500,
  height = 'auto',
  className,
  dragConstraint = 300,
  autoSnap = true,
  snapThreshold = 150,
  backgroundColor = 'transparent',
  borderRadius = '12px',
  shadow = true
}: FoldableMapProps) {
  // Motion values for drag interaction
  const dragX = useMotionValue(0)

  // Transform drag value to section positions
  const xLeftSection = useTransform(dragX, [0, dragConstraint], ['100%', '0%'])
  const xRightSection = useTransform(dragX, [0, dragConstraint], ['-100%', '0%'])

  // Scale center section for realistic folding effect
  const centerScale = useTransform(
    dragX,
    [snapThreshold, dragConstraint],
    [0.2, 1]
  )

  // Opacity for side sections
  const leftOpacity = useTransform(dragX, [0, snapThreshold], [0, 1])
  const rightOpacity = useTransform(dragX, [0, snapThreshold], [0, 1])

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor,
    borderRadius,
    boxShadow: shadow ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none'
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={containerStyle}
    >
      {/* Main grid container */}
      <div className="grid">
        {/* Map sections */}
        <div className="grid aspect-video w-full grid-cols-3 [grid-area:1/1]">
          {/* Left section */}
          <motion.div
            style={{
              x: xLeftSection,
              opacity: leftOpacity,
              backgroundImage: `url(${mapImage})`,
              backgroundSize: '300%',
              backgroundPosition: 'left'
            }}
            className="bg-cover bg-left"
          />

          {/* Center section */}
          <motion.div
            style={{
              scaleX: centerScale,
              backgroundImage: `url(${mapImage})`,
              backgroundSize: '300%',
              backgroundPosition: 'center'
            }}
            className="bg-cover bg-center"
          />

          {/* Right section */}
          <motion.div
            style={{
              x: xRightSection,
              opacity: rightOpacity,
              backgroundImage: `url(${mapImage})`,
              backgroundSize: '300%',
              backgroundPosition: 'right'
            }}
            className="bg-cover bg-right"
          />
        </div>

        {/* Draggable handle */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing [grid-area:1/1]"
          drag="x"
          dragConstraints={{ left: 0, right: dragConstraint }}
          dragElastic={0.1}
          style={{ x: dragX }}
          onDragEnd={(_, info) => {
            if (autoSnap) {
              const shouldSnap = Math.abs(info.offset.x) > snapThreshold
              if (shouldSnap) {
                dragX.set(info.offset.x > 0 ? dragConstraint : 0)
              } else {
                dragX.set(0)
              }
            }
          }}
        >
          {/* Visual drag indicator */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
              <div className="h-4 w-4 rounded-full bg-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}