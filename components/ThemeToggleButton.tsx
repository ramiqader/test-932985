'use client'
import React from 'react'
import { Sun, Moon, Palette } from 'lucide-react'

interface ThemeToggleButtonProps {
  variant?: 'icon' | 'text' | 'both'
  size?: 'sm' | 'md' | 'lg'
  position?: 'left' | 'center' | 'right'
  showLabel?: boolean
  customText?: string
  style?: 'button' | 'switch' | 'dropdown'
  componentId?: string
}

export default function ThemeToggleButton({
  variant = 'both',
  size = 'md',
  position = 'center',
  showLabel = true,
  customText = '',
  style = 'button',
  componentId = ''
}: ThemeToggleButtonProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [currentTheme, setCurrentTheme] = React.useState({ id: 'light', name: 'Light' })
  const availableThemes = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'blue', name: 'Blue' },
    { id: 'green', name: 'Green' }
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  if (style === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${positionClasses[position]}`}>
        {showLabel && (
          <span className="text-sm font-medium" style={{ color: 'var(--theme-text, #111827)' }}>
            {customText || 'Theme'}
          </span>
        )}
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    )
  }

  if (style === 'dropdown') {
    return (
      <div className={`relative ${positionClasses[position]}`}>
        <select
          value={currentTheme.id}
          onChange={(e) => {
            const theme = availableThemes.find(t => t.id === e.target.value)
            if (theme) setCurrentTheme(theme)
          }}
          className={`${sizeClasses[size]} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          style={{
            backgroundColor: 'var(--theme-surface, #f9fafb)',
            color: 'var(--theme-text, #111827)',
            borderColor: 'var(--theme-border, #e5e7eb)'
          }}
        >
          {availableThemes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {customText || theme.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // Default button style
  return (
    <div className={`flex ${positionClasses[position]}`}>
      <button
        onClick={toggleDarkMode}
        className={`${sizeClasses[size]} rounded-md font-medium transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2`}
        style={{
          backgroundColor: 'var(--theme-primary, #3b82f6)',
          color: 'var(--theme-background, #ffffff)',
          border: '1px solid var(--theme-border, #e5e7eb)'
        }}
      >
        {variant === 'icon' || variant === 'both' ? (
          isDarkMode ? (
            <Moon className={iconSizes[size]} />
          ) : (
            <Sun className={iconSizes[size]} />
          )
        ) : (
          <Palette className={iconSizes[size]} />
        )}

        {(variant === 'text' || variant === 'both') && showLabel && (
          <span>
            {customText || (isDarkMode ? 'Dark Mode' : 'Light Mode')}
          </span>
        )}
      </button>
    </div>
  )
}