// Type declarations for CSS custom properties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

export {}
