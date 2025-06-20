'use client'

import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"

interface ToastTriggerProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  className?: string
}

export function ToastTrigger({
  title = "Notification",
  description = "Toast message",
  variant = "default",
  className
}: ToastTriggerProps) {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title,
      description,
      variant,
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={className}
    >
      Show Toast: {title}
    </Button>
  )
}