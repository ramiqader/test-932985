'use client'

import React, { useState, useEffect } from 'react'

import FloatingCardsScene from "../components/FloatingCardsScene"
import ThemeToggleButton from "../components/ThemeToggleButton"
import { CursorMultifollow } from "../components/CursorMultifollow"
import { FormBuilder } from "../components/FormBuilder"
import { HoldToConfirm } from "../components/HoldToConfirm"
import { Navbar } from "../components/Navbar"
import { RadixTabs } from "../components/RadixTabs"
import { eventSystem } from "../lib/eventSystem"

import { ResponsiveCard } from '../components/ResponsiveCard'
import { ResponsiveHoldToConfirm } from '../components/ResponsiveHoldToConfirm'
import { ResponsiveButton } from '../components/ResponsiveButton'

export default function HomePage() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width <= 640) {
        setCurrentBreakpoint('mobile')
      } else if (width <= 1024) {
        setCurrentBreakpoint('tablet')
      } else {
        setCurrentBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return (
    <>
      
      <div
        className="canvas-container min-h-screen relative overflow-auto"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--theme-background)',
          margin: 0,
          padding: 0,
          position: 'relative'
        }}
        data-breakpoint={currentBreakpoint}
      >
        <div
      id="responsive-comp-1"
      data-component-id="comp-1"
      className="absolute responsive-component"
      style={{
        // Desktop positioning (default)
        left: '83px',
        top: '122px',
        width: '800px',
        height: '500px',
        // CSS custom properties for responsive positioning
        '--desktop-x': '83px',
        '--desktop-y': '122px',
        '--desktop-width': '800px',
        '--desktop-height': '500px',
        '--tablet-x': '83px',
        '--tablet-y': '122px',
        '--tablet-width': '800px',
        '--tablet-height': '500px',
        '--mobile-x': '83px',
        '--mobile-y': '122px',
        '--mobile-width': '800px',
        '--mobile-height': '500px',
      }}
    >
      <FloatingCardsScene sceneType="portfolio" autoRotate perspective={1200} cardWidth={192} cardHeight={128} cardSpacing={150} numCustomImages={5} />
    </div>
      </div>
      
    </>
  )
}