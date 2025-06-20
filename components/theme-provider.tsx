'use client'

import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
  themes: string[]
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme)
  const themes = ['light', 'dark', ...(enableSystem ? ['system'] : [])]

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') || defaultTheme
    setThemeState(savedTheme)
    applyTheme(savedTheme)
  }, [defaultTheme])

  const applyTheme = (newTheme: string) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.setAttribute(attribute, systemTheme)
    } else {
      root.setAttribute(attribute, newTheme)
    }
  }

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
    applyTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}