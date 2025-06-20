import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"

type CarouselProps = {
  orientation?: "horizontal" | "vertical"
  className?: string
  children?: React.ReactNode
}

type CarouselContextProps = {
  currentIndex: number
  totalItems: number
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation: "horizontal" | "vertical"
  scrollToIndex: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [totalItems, setTotalItems] = React.useState(5) // Default to 5 items

    const canScrollPrev = currentIndex > 0
    const canScrollNext = currentIndex < totalItems - 1

    const scrollPrev = React.useCallback(() => {
      setCurrentIndex(prev => Math.max(0, prev - 1))
    }, [])

    const scrollNext = React.useCallback(() => {
      setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1))
    }, [totalItems])

    const scrollToIndex = React.useCallback((index: number) => {
      setCurrentIndex(Math.max(0, Math.min(totalItems - 1, index)))
    }, [totalItems])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    // Count children to set total items - simplified approach
    React.useEffect(() => {
      // Use a timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const carouselElement = ref && 'current' in ref ? ref.current : null
        if (carouselElement) {
          const carouselContent = carouselElement.querySelector('[data-carousel-content]')
          if (carouselContent) {
            const itemCount = carouselContent.children.length
            if (itemCount > 0) {
              setTotalItems(itemCount)
            }
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    }, [children, ref])

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          totalItems,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
          scrollToIndex,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation, currentIndex } = useCarousel()

  const transform = orientation === "horizontal"
    ? `translateX(-${currentIndex * 100}%)`
    : `translateY(-${currentIndex * 100}%)`

  return (
    <div className="overflow-hidden">
      <div
        ref={ref}
        data-carousel-content
        className={cn(
          "flex transition-transform duration-300 ease-in-out",
          orientation === "horizontal" ? "" : "flex-col",
          className
        )}
        style={{ transform }}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}