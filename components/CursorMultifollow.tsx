'use client'
import * as React from "react"

interface CursorMultifollowProps {
  numberOfCursors?: number
  cursorSize?: number
  cursorColor?: string
  className?: string
}

export function CursorMultifollow({
  numberOfCursors = 5,
  cursorSize = 12,
  cursorColor = "#3b82f6",
  className
}: CursorMultifollowProps) {
  const [cursors, setCursors] = React.useState<Array<{x: number, y: number}>>([])

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursors(prev => {
        const newCursors = [...prev, { x: e.clientX, y: e.clientY }]
        return newCursors.slice(-numberOfCursors)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [numberOfCursors])

  return (
    <div className={className}>
      {cursors.map((cursor, index) => (
        <div
          key={index}
          className="fixed pointer-events-none z-50 rounded-full"
          style={{
            left: cursor.x,
            top: cursor.y,
            width: cursorSize,
            height: cursorSize,
            backgroundColor: cursorColor,
            opacity: (index + 1) / cursors.length,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}