'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../lib/utils'

interface DataPoint {
  x: number
  y: number
  label?: string
}

interface LineGraphProps {
  data?: DataPoint[]
  customData?: string // JSON string for custom data
  width?: number | string
  height?: number | string
  strokeColor?: string
  strokeWidth?: number
  fillColor?: string
  showFill?: boolean
  showDots?: boolean
  showGrid?: boolean
  showLabels?: boolean
  animationDuration?: number
  animationDelay?: number
  triggerOnView?: boolean
  smooth?: boolean
  dotSize?: number
  gridColor?: string
  labelColor?: string
  backgroundColor?: string
  borderRadius?: string
  padding?: number
  className?: string
  showPercentage?: boolean
  percentageValue?: number
  percentageLabel?: string
}

const defaultData: DataPoint[] = [
  { x: 0, y: 20, label: 'Jan' },
  { x: 1, y: 45, label: 'Feb' },
  { x: 2, y: 28, label: 'Mar' },
  { x: 3, y: 80, label: 'Apr' },
  { x: 4, y: 65, label: 'May' },
  { x: 5, y: 95, label: 'Jun' },
  { x: 6, y: 70, label: 'Jul' },
  { x: 7, y: 85, label: 'Aug' },
  { x: 8, y: 60, label: 'Sep' },
  { x: 9, y: 90, label: 'Oct' },
  { x: 10, y: 75, label: 'Nov' },
  { x: 11, y: 100, label: 'Dec' }
]

export function LineGraph({
  data = defaultData,
  customData,
  width = 600,
  height = 300,
  strokeColor = '#10b981',
  strokeWidth = 3,
  fillColor = '#10b981',
  showFill = true,
  showDots = true,
  showGrid = true,
  showLabels = false,
  animationDuration = 2,
  animationDelay = 0,
  triggerOnView = true,
  smooth = true,
  dotSize = 8,
  gridColor = '#374151',
  labelColor = '#9ca3af',
  backgroundColor = '#1f2937',
  borderRadius = '12px',
  padding = 40,
  className,
  showPercentage = true,
  percentageValue = 72,
  percentageLabel = ''
}: LineGraphProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const ref = React.useRef(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Helper function to convert width/height to numbers for calculations
  const getNumericValue = (value: number | string, defaultValue: number): number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      // Handle string values like "auto", "100%", etc.
      if (value === 'auto') return defaultValue
      const parsed = parseFloat(value)
      return isNaN(parsed) ? defaultValue : parsed
    }
    return defaultValue
  }

  // Convert width and height to numbers for calculations
  const numericWidth = getNumericValue(width, 600)
  const numericHeight = getNumericValue(height, 300)

  // Parse custom data if provided
  let parsedData = data
  if (customData) {
    try {
      const parsed = JSON.parse(customData)
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedData = parsed
      }
    } catch (e) {
      console.warn('Failed to parse custom data, using default data:', e)
      // Use default data if parsing fails
    }
  }

  // Ensure we have valid data
  if (!parsedData || parsedData.length === 0) {
    parsedData = defaultData
  }

  // Calculate scales and bounds
  const chartWidth = numericWidth - (padding * 2)
  const chartHeight = numericHeight - (padding * 2)

  const minX = Math.min(...parsedData.map(d => d.x))
  const maxX = Math.max(...parsedData.map(d => d.x))
  const minY = Math.min(...parsedData.map(d => d.y))
  const maxY = Math.max(...parsedData.map(d => d.y))

  const xScale = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth
  const yScale = (y: number) => chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

  // Generate path data
  const pathData = useMemo(() => {
    if (parsedData.length === 0) return ''

    let path = `M ${xScale(parsedData[0].x)} ${yScale(parsedData[0].y)}`

    if (smooth) {
      // Create smooth curves using quadratic bezier curves
      for (let i = 1; i < parsedData.length; i++) {
        const prevPoint = parsedData[i - 1]
        const currentPoint = parsedData[i]

        const prevX = xScale(prevPoint.x)
        const prevY = yScale(prevPoint.y)
        const currentX = xScale(currentPoint.x)
        const currentY = yScale(currentPoint.y)

        const controlX = (prevX + currentX) / 2

        path += ` Q ${controlX} ${prevY} ${currentX} ${currentY}`
      }
    } else {
      // Create straight lines
      for (let i = 1; i < parsedData.length; i++) {
        const point = parsedData[i]
        path += ` L ${xScale(point.x)} ${yScale(point.y)}`
      }
    }

    return path
  }, [parsedData, xScale, yScale, smooth])

  // Generate fill path data
  const fillPathData = useMemo(() => {
    if (!showFill || parsedData.length === 0) return ''

    const bottomY = yScale(minY)
    let path = `M ${xScale(parsedData[0].x)} ${bottomY}`
    path += ` L ${xScale(parsedData[0].x)} ${yScale(parsedData[0].y)}`

    if (smooth) {
      for (let i = 1; i < parsedData.length; i++) {
        const prevPoint = parsedData[i - 1]
        const currentPoint = parsedData[i]

        const prevX = xScale(prevPoint.x)
        const prevY = yScale(prevPoint.y)
        const currentX = xScale(currentPoint.x)
        const currentY = yScale(currentPoint.y)

        const controlX = (prevX + currentX) / 2
        path += ` Q ${controlX} ${prevY} ${currentX} ${currentY}`
      }
    } else {
      for (let i = 1; i < parsedData.length; i++) {
        const point = parsedData[i]
        path += ` L ${xScale(point.x)} ${yScale(point.y)}`
      }
    }

    path += ` L ${xScale(parsedData[parsedData.length - 1].x)} ${bottomY} Z`
    return path
  }, [parsedData, xScale, yScale, showFill, smooth, minY])

  // Animation trigger
  const shouldAnimate = triggerOnView ? isInView && !hasAnimated : !hasAnimated

  useEffect(() => {
    if (shouldAnimate) {
      setHasAnimated(true)
    }
  }, [shouldAnimate])

  // Percentage animation
  useEffect(() => {
    if (shouldAnimate && showPercentage) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedPercentage(prev => {
            if (prev >= percentageValue) {
              clearInterval(interval)
              return percentageValue
            }
            return prev + 1
          })
        }, 20)
        return () => clearInterval(interval)
      }, (animationDelay * 1000) + 500)
      return () => clearTimeout(timer)
    }
  }, [shouldAnimate, showPercentage, percentageValue, animationDelay])

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = []
    const gridSteps = 5

    // Vertical grid lines
    for (let i = 0; i <= gridSteps; i++) {
      const x = (chartWidth / gridSteps) * i
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={chartHeight}
          stroke={gridColor}
          strokeWidth={0.5}
          opacity={0.3}
        />
      )
    }

    // Horizontal grid lines
    for (let i = 0; i <= gridSteps; i++) {
      const y = (chartHeight / gridSteps) * i
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke={gridColor}
          strokeWidth={0.5}
          opacity={0.3}
        />
      )
    }

    return lines
  }, [chartWidth, chartHeight, gridColor])

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - padding
    const y = e.clientY - rect.top - padding

    setMousePosition({ x, y })

    // Find closest point
    let closestPoint = null
    let minDistance = Infinity

    parsedData.forEach(point => {
      const pointX = xScale(point.x)
      const pointY = yScale(point.y)
      const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2))

      if (distance < minDistance && distance < 30) {
        minDistance = distance
        closestPoint = point
      }
    })

    setHoveredPoint(closestPoint)
  }

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoveredPoint(null)
  }

  return (
    <div
      ref={ref}
      className={cn('relative inline-block', className)}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
        backgroundColor,
        borderRadius,
        padding: `${padding}px`
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible block"
        viewBox={`0 0 ${numericWidth} ${numericHeight}`}
        style={{ display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`translate(${padding}, ${padding})`}>
          {/* Grid */}
          {showGrid && (
            <g opacity={shouldAnimate ? 1 : 0}>
              {gridLines}
            </g>
          )}

          {/* Fill area */}
          {showFill && fillPathData && (
            <motion.path
              d={fillPathData}
              fill={`url(#gradient-${strokeColor.replace('#', '')})`}
              initial={{ opacity: 0 }}
              animate={shouldAnimate ? { opacity: 0.2 } : {}}
              transition={{
                duration: animationDuration,
                delay: animationDelay + 0.5
              }}
            />
          )}

          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${strokeColor.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fillColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Main line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : {}}
            transition={{
              duration: animationDuration,
              delay: animationDelay,
              ease: "easeInOut"
            }}
          />

          {/* Data points */}
          {showDots && parsedData.map((point, index) => (
            <motion.circle
              key={index}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={dotSize}
              fill={strokeColor}
              stroke="white"
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={shouldAnimate ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: animationDelay + (animationDuration * 0.8) + (index * 0.1)
              }}
              style={{
                filter: hoveredPoint === point ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                cursor: 'pointer'
              }}
            />
          ))}

          {/* Labels */}
          {showLabels && parsedData.map((point, index) => (
            <motion.text
              key={`label-${index}`}
              x={xScale(point.x)}
              y={chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill={labelColor}
              initial={{ opacity: 0 }}
              animate={shouldAnimate ? { opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: animationDelay + animationDuration + (index * 0.05)
              }}
            >
              {point.label}
            </motion.text>
          ))}
        </g>

        {/* Tooltip */}
        {hoveredPoint && isHovering && (
          <g>
            <rect
              x={mousePosition.x + padding + 10}
              y={mousePosition.y + padding - 25}
              width={80}
              height={40}
              fill="rgba(0, 0, 0, 0.8)"
              rx={4}
            />
            <text
              x={mousePosition.x + padding + 50}
              y={mousePosition.y + padding - 10}
              textAnchor="middle"
              fontSize="12"
              fill="white"
            >
              {hoveredPoint.label}: {hoveredPoint.y}
            </text>
          </g>
        )}
      </svg>

      {/* Percentage display */}
      {showPercentage && (
        <motion.div
          className="absolute top-4 right-4 text-right"
          initial={{ opacity: 0, y: -10 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: animationDelay + 0.3
          }}
        >
          <div className="text-3xl font-bold" style={{ color: strokeColor }}>
            {animatedPercentage}%
          </div>
          {percentageLabel && (
            <div className="text-sm opacity-70" style={{ color: labelColor }}>
              {percentageLabel}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}