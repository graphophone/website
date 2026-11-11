import { useRef } from "react"

const minimumSwipeDistance = 50

interface SwipeHandlers {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function useHorizontalSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers) {
  const swipeStartX = useRef<number | null>(null)

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.target instanceof HTMLInputElement) {
      swipeStartX.current = null
      return
    }
    swipeStartX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (swipeStartX.current === null) {
      return
    }

    const swipeDistance = event.changedTouches[0].clientX - swipeStartX.current
    swipeStartX.current = null

    if (swipeDistance <= -minimumSwipeDistance) {
      onSwipeLeft()
    } else if (swipeDistance >= minimumSwipeDistance) {
      onSwipeRight()
    }
  }

  return { onTouchStart, onTouchEnd }
}
