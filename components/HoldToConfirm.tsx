'use client'
import * as React from "react"
import { Button } from "../components/ui/button"

interface HoldToConfirmProps {
  text?: string
  holdDuration?: number
  onConfirm?: () => void
  className?: string
}

export function HoldToConfirm({
  text = "Hold to confirm",
  holdDuration = 2000,
  onConfirm,
  className
}: HoldToConfirmProps) {
  const [isHolding, setIsHolding] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const startHold = () => {
    setIsHolding(true)
    setProgress(0)

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (holdDuration / 50))
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 50)

    timeoutRef.current = setTimeout(() => {
      setIsHolding(false)
      setProgress(0)
      onConfirm?.()
    }, holdDuration)
  }

  const stopHold = () => {
    setIsHolding(false)
    setProgress(0)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return (
    <Button
      className={className}
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      style={{
        background: `linear-gradient(90deg, #3b82f6 ${progress}%, transparent ${progress}%)`
      }}
    >
      {text}
    </Button>
  )
}