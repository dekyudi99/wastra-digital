import { useEffect } from 'react'

/**
 * Add "is-visible" class to elements when they enter viewport.
 * Efek akan muncul SETIAP kali elemen masuk viewport,
 * dan hilang saat elemen keluar (bukan hanya sekali).
 * Usage: add className="reveal" to elements you want to animate.
 */
export function useRevealOnScroll({
  selector = '.reveal',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.12,
} = {}) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector))
    if (!elements.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        }
      },
      { root: null, rootMargin, threshold },
    )

    elements.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [selector, rootMargin, threshold])
}


