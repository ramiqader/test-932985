'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface CameraScene3DProps {
  width?: number | string
  height?: number | string
  backgroundColor?: string
  borderRadius?: string
  autoRotate?: boolean
  rotationSpeed?: number
  perspective?: number
  className?: string
  showControls?: boolean
  images?: string[]
  customImage1?: string
  customImage2?: string
  customImage3?: string
  customImage4?: string
  customImage5?: string
}

export function CameraScene3D({
  width = 600,
  height = 400,
  backgroundColor = '#1a1a1a',
  borderRadius = '12px',
  autoRotate = true,
  rotationSpeed = 1,
  perspective = 1000,
  className,
  showControls = true,
  images = [],
  customImage1 = '',
  customImage2 = '',
  customImage3 = '',
  customImage4 = '',
  customImage5 = ''
}: CameraScene3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Process custom images
  const customImages = [customImage1, customImage2, customImage3, customImage4, customImage5].filter(Boolean)
  const allImages = [...customImages, ...images].filter(Boolean)

  // Default images if none provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop'
  ]

  const displayImages = allImages.length > 0 ? allImages : defaultImages

  // Auto rotation
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const interval = setInterval(() => {
        setRotation(prev => ({
          ...prev,
          y: prev.y + rotationSpeed
        }))
      }, 50)

      return () => clearInterval(interval)
    }
  }, [autoRotate, isDragging, rotationSpeed])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setMouseStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - mouseStart.x
    const deltaY = e.clientY - mouseStart.y

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }))

    setMouseStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor,
    borderRadius,
    perspective: `${perspective}px`
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden cursor-grab active:cursor-grabbing', className)}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Scene Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Image Cube */}
        <div
          className="relative"
          style={{
            width: '200px',
            height: '200px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[0] || defaultImages[0]})`,
              transform: 'translateZ(100px)'
            }}
          />

          {/* Back Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[1] || defaultImages[1]})`,
              transform: 'translateZ(-100px) rotateY(180deg)'
            }}
          />

          {/* Right Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[2] || defaultImages[2]})`,
              transform: 'rotateY(90deg) translateZ(100px)'
            }}
          />

          {/* Left Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[3] || defaultImages[3]})`,
              transform: 'rotateY(-90deg) translateZ(100px)'
            }}
          />

          {/* Top Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[4] || defaultImages[4]})`,
              transform: 'rotateX(90deg) translateZ(100px)'
            }}
          />

          {/* Bottom Face */}
          <div
            className="absolute inset-0 bg-cover bg-center border border-gray-300"
            style={{
              backgroundImage: `url(${displayImages[0] || defaultImages[0]})`,
              transform: 'rotateX(-90deg) translateZ(100px)'
            }}
          />
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="text-white text-sm bg-black/50 px-3 py-1 rounded">
            Drag to rotate
          </div>
          <button
            onClick={() => setRotation({ x: 0, y: 0 })}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}