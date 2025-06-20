'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

interface FloatingCardsSceneProps {
  sceneType?: 'basic' | 'portfolio' | 'creative'
  autoRotate?: boolean
  perspective?: number
  backgroundColor?: string
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
  numCustomImages?: number
  customImage1?: string
  customImage2?: string
  customImage3?: string
  customImage4?: string
  customImage5?: string
  customImage6?: string
  customImage7?: string
  customImage8?: string
  customImage9?: string
  customImage10?: string
  customTitle1?: string
  customTitle2?: string
  customTitle3?: string
  customTitle4?: string
  customTitle5?: string
  customTitle6?: string
  customTitle7?: string
  customTitle8?: string
  customTitle9?: string
  customTitle10?: string
  className?: string
}

// Floating card component with dynamic spawning and movement
function FloatingCard({
  index = 0,
  image = '',
  title = '',
  autoRotate = false,
  cards = [],
  spawnTime = 0,
  globalTime = 0,
  row = 'top',
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150
}: {
  index?: number
  image?: string
  title?: string
  autoRotate?: boolean
  cards?: Array<{ image?: string; title?: string }>
  spawnTime?: number
  globalTime?: number
  row?: 'top' | 'bottom'
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate card age and position
  const cardAge = globalTime - spawnTime
  const isTopRow = row === 'top'
  const baseY = isTopRow ? -100 : 100
  const baseZ = 0

  // Movement configuration - consistent speed for smooth flow
  const speed = 80 // Balanced speed - fast enough to be dynamic, slow enough for proper spacing
  const direction = isTopRow ? -1 : 1 // Top row moves left, bottom row moves right

  // Start each card closer to the visible area for immediate appearance
  const screenWidth = 1400 // Wide screen area
  const startX = isTopRow ? screenWidth/2 + 100 : -screenWidth/2 - 100 // Start closer to screen edge

  // Calculate current position based on age
  const cardX = startX + (cardAge * speed * direction)

  // Use the card's unique index to determine content (no looping)
  const currentCard = { image, title }

  // No rotation for clean linear movement
  const baseRotateY = 0
  const baseRotateX = 0

  // Override position when zoomed
  const x = isZoomed ? 0 : cardX
  const y = isZoomed ? 0 : baseY
  const z = isZoomed ? 500 : baseZ // Bring to front when zoomed
  const rotateY = isZoomed ? 0 : baseRotateY
  const rotateX = isZoomed ? 0 : baseRotateX
  const scale = isZoomed ? 2.2 : (isHovered ? 1.05 : 1)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newZoomedState = !isZoomed
    setIsZoomed(newZoomedState)

    // Emit event to parent to track if any card is zoomed
    const event = new CustomEvent('cardZoomChange', {
      detail: { hasZoomedCard: newZoomedState }
    })
    window.dispatchEvent(event)
  }

  return (
    <div
      className={`absolute cursor-pointer ${isZoomed ? 'z-50' : 'z-10'}`}
      style={{
        left: '50%',
        top: '50%',
        transform: `
          translate3d(${x}px, ${y}px, ${z}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          translate(-50%, -50%)
        `,
        transformStyle: 'preserve-3d',
        transition: isZoomed ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.3s ease-out'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden ${
          isZoomed
            ? 'shadow-4xl border-blue-300 ring-4 ring-blue-200'
            : isHovered
              ? 'shadow-3xl border-gray-300'
              : 'shadow-2xl'
        }`}
        style={{
          width: isZoomed ? `${cardWidth * 2}px` : `${cardWidth}px`, // 2x size when zoomed
          height: isZoomed ? `${cardHeight * 2}px` : `${cardHeight}px`, // 2x size when zoomed
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          // Ensure crisp rendering
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          // Force hardware acceleration for smooth transitions
          willChange: 'width, height, box-shadow'
        }}
      >
        {currentCard.image ? (
          <img
            src={currentCard.image}
            alt={currentCard.title}
            className="w-full h-full object-cover"
            style={{
              // High quality image rendering
              imageRendering: 'auto',
              // Prevent blur during scaling
              backfaceVisibility: 'hidden',
              // Smooth transitions
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span
              className="text-white font-bold transition-all duration-400"
              style={{
                fontSize: isZoomed ? '1.5rem' : '1.125rem',
                transition: 'font-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {currentCard.title || `Card ${index + 1}`}
            </span>
          </div>
        )}

        {/* Title overlay when zoomed */}
        {isZoomed && currentCard.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent transition-all duration-400"
               style={{ padding: isZoomed ? '16px' : '12px' }}>
            <h3
              className="text-white font-semibold transition-all duration-400"
              style={{ fontSize: isZoomed ? '18px' : '14px' }}
            >
              {currentCard.title}
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

// Scene content component with dynamic card spawning
function SceneContent({
  sceneType = 'basic',
  autoRotate = false,
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150,
  customImages = []
}: {
  sceneType?: string
  autoRotate?: boolean
  cardWidth?: number
  cardHeight?: number
  cardSpacing?: number
  customImages?: Array<{ image: string; title: string }>
}) {
  const [activeCards, setActiveCards] = useState<Array<{id: number, spawnTime: number, row: 'top' | 'bottom'}>>([])
  const [globalTime, setGlobalTime] = useState(0)
  const [cardCounter, setCardCounter] = useState(0)

  // Sample images and titles for the floating cards
  const portfolioCards = [
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      title: 'Digital Design'
    },
    {
      image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop',
      title: 'Web Development'
    },
    {
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      title: 'Mobile Apps'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      title: 'Data Analytics'
    },
    {
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
      title: 'UI/UX Design'
    }
  ]

  const creativeCards = [
    {
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      title: 'Abstract Art'
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Photography'
    },
    {
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      title: 'Illustration'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      title: 'Branding'
    },
    {
      image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&h=300&fit=crop',
      title: 'Motion Graphics'
    }
  ]

  const basicCards = [
    { title: 'Project 1' },
    { title: 'Project 2' },
    { title: 'Project 3' },
    { title: 'Project 4' },
    { title: 'Project 5' },
    { title: 'Project 6' },
    { title: 'Project 7' },
    { title: 'Project 8' },
    { title: 'Project 9' },
    { title: 'Project 10' }
  ]

  let cards = basicCards

  // Use custom images if provided, otherwise use default cards based on scene type
  if (customImages && customImages.length > 0) {
    cards = customImages
  } else {
    switch (sceneType) {
      case 'portfolio':
        cards = portfolioCards
        break
      case 'creative':
        cards = creativeCards
        break
      default:
        cards = basicCards
        break
    }
  }

  // Dynamic card spawning system
  useEffect(() => {
    if (!autoRotate) return

    let localTopCounter = 0
    let localBottomCounter = 0

    const interval = setInterval(() => {
      setGlobalTime(prev => {
        const newTime = prev + 0.016 // ~60fps - consistent timing

        // Spawn new cards continuously with better spacing
        setActiveCards(prevCards => {
          const newCards = [...prevCards]
          const spawnInterval = 2.5 // Better spacing - cards appear every 2.5 seconds

          // Check if it's time to spawn new cards (staggered timing for visual separation)
          const timeSinceLastSpawn = newTime % spawnInterval
          if (timeSinceLastSpawn < 0.016) { // Within one frame of spawn time
            // Spawn a card for the top row with cycling image index
            newCards.push({
              id: localTopCounter,
              spawnTime: newTime,
              row: 'top'
            })
            localTopCounter++
          }

          // Spawn bottom row cards with slight offset for visual separation
          const bottomSpawnOffset = spawnInterval / 2
          const timeSinceBottomSpawn = (newTime + bottomSpawnOffset) % spawnInterval
          if (timeSinceBottomSpawn < 0.016) {
            // Spawn a card for the bottom row with cycling image index
            newCards.push({
              id: localBottomCounter,
              spawnTime: newTime,
              row: 'bottom'
            })
            localBottomCounter++
          }

          // Remove cards that have moved completely off screen
          const cleanedCards = newCards.filter(card => {
            const age = newTime - card.spawnTime
            const speed = 80 // Same speed as in FloatingCard component
            const direction = card.row === 'top' ? -1 : 1
            const screenWidth = 1400
            const startX = card.row === 'top' ? screenWidth/2 + 100 : -screenWidth/2 - 100
            const cardX = startX + (age * speed * direction)

            // Remove cards that are far off the opposite side of the screen
            const isOffScreen = card.row === 'top' ? cardX < -1000 : cardX > 1000
            return !isOffScreen
          })

          return cleanedCards
        })

        return newTime
      })
    }, 16)

    return () => clearInterval(interval)
  }, [autoRotate, cardSpacing])

  return (
    <>
      {activeCards.map((cardData) => {
        // Use the imageIndex from cardData to ensure proper cycling
        const numericId = cardData.id
        const cardIndex = numericId % cards.length
        const card = cards[cardIndex]

        return (
          <FloatingCard
            key={cardData.id}
            index={numericId}
            image={(card as any).image || ''}
            title={card.title}
            autoRotate={autoRotate}
            cards={cards}
            spawnTime={cardData.spawnTime}
            globalTime={globalTime}
            row={cardData.row}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardSpacing={cardSpacing}
          />
        )
      })}
    </>
  )
}

export default function FloatingCardsScene({
  sceneType = 'portfolio',
  autoRotate = true,
  perspective = 1200,
  backgroundColor = '',
  cardWidth = 192,
  cardHeight = 128,
  cardSpacing = 150,
  numCustomImages = 5,
  customImage1 = '',
  customImage2 = '',
  customImage3 = '',
  customImage4 = '',
  customImage5 = '',
  customImage6 = '',
  customImage7 = '',
  customImage8 = '',
  customImage9 = '',
  customImage10 = '',
  customTitle1 = '',
  customTitle2 = '',
  customTitle3 = '',
  customTitle4 = '',
  customTitle5 = '',
  customTitle6 = '',
  customTitle7 = '',
  customTitle8 = '',
  customTitle9 = '',
  customTitle10 = '',
  className = ''
}: FloatingCardsSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [hasZoomedCard, setHasZoomedCard] = useState(false)

  // Create custom images array from individual props based on numCustomImages
  const customImages = React.useMemo(() => {
    const images: Array<{ image: string; title: string }> = []
    const allImageProps = [
      { image: customImage1, title: customTitle1 },
      { image: customImage2, title: customTitle2 },
      { image: customImage3, title: customTitle3 },
      { image: customImage4, title: customTitle4 },
      { image: customImage5, title: customTitle5 },
      { image: customImage6, title: customTitle6 },
      { image: customImage7, title: customTitle7 },
      { image: customImage8, title: customTitle8 },
      { image: customImage9, title: customTitle9 },
      { image: customImage10, title: customTitle10 }
    ]

    // Only use the number of images specified by numCustomImages
    const imageProps = allImageProps.slice(0, numCustomImages)

    for (const { image, title } of imageProps) {
      if (image) {
        images.push({ image, title: title || 'Custom Image' })
      }
    }

    return images
  }, [
    numCustomImages,
    customImage1, customImage2, customImage3, customImage4, customImage5,
    customImage6, customImage7, customImage8, customImage9, customImage10,
    customTitle1, customTitle2, customTitle3, customTitle4, customTitle5,
    customTitle6, customTitle7, customTitle8, customTitle9, customTitle10
  ])

  // Listen for card zoom events
  useEffect(() => {
    const handleCardZoomChange = (event: any) => {
      setHasZoomedCard(event.detail.hasZoomedCard)
    }

    window.addEventListener('cardZoomChange', handleCardZoomChange)
    return () => window.removeEventListener('cardZoomChange', handleCardZoomChange)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x: x * 15, y: y * -15 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  // Use custom background color if provided, otherwise use default gradient
  const backgroundStyle = backgroundColor
    ? { backgroundColor }
    : {}

  const defaultClasses = backgroundColor
    ? "relative w-full h-96 overflow-hidden border border-gray-700 rounded-lg"
    : "relative w-full h-96 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 border border-gray-700 rounded-lg"

  return (
    <div
      className={cn(defaultClasses, className)}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...backgroundStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Subtle backdrop overlay when a card is zoomed */}
      {hasZoomedCard && (
        <div
          className="absolute inset-0 bg-black/20 z-40 transition-all duration-300"
          onClick={() => {
            // Close any zoomed cards when clicking backdrop
            const event = new CustomEvent('cardZoomChange', {
              detail: { hasZoomedCard: false }
            })
            window.dispatchEvent(event)
          }}
        />
      )}

      {/* 3D Scene Container */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${mousePosition.y}deg)
            rotateY(${mousePosition.x}deg)
            ${isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'}
          `
        }}
      >
        <SceneContent
          sceneType={sceneType}
          autoRotate={autoRotate}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          cardSpacing={cardSpacing}
          customImages={customImages}
        />
      </div>

      {/* Enhanced ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}