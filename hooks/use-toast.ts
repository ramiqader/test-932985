'use client'

import * as React from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...newToast, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return React.createElement(ToastContext.Provider, { value: { toasts, toast, dismiss } },
    children,
    React.createElement('div', { className: 'fixed bottom-4 right-4 z-50 space-y-2' },
      toasts.map(toastItem =>
        React.createElement('div', {
          key: toastItem.id,
          className: `p-4 rounded-lg shadow-lg relative ${
            toastItem.variant === 'destructive'
              ? 'bg-red-500 text-white'
              : 'bg-white border border-gray-200'
          }`
        },
          toastItem.title && React.createElement('div', { className: 'font-semibold' }, toastItem.title),
          toastItem.description && React.createElement('div', { className: 'text-sm' }, toastItem.description),
          React.createElement('button', {
            onClick: () => dismiss(toastItem.id),
            className: 'absolute top-2 right-2 text-gray-400 hover:text-gray-600'
          }, '×')
        )
      )
    )
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Export a default toast function for convenience
export const toast = (options: Omit<Toast, 'id'>) => {
  // This is a fallback that will work if ToastProvider is not available
  console.log('Toast:', options)
}
