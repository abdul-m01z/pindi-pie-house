import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BUSINESS } from '../data/business.js'

// The hero plays a pizza video as 100 still frames. The frame that is drawn depends on how far
// the user has scrolled through this section, so scrolling "plays" the video forwards and backwards.
const FRAME_COUNT = 100
const frameUrl = (i) => `/frames/f${String(i + 1).padStart(3, '0')}.webp`

export default function ScrollHero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frames = new Array(FRAME_COUNT).fill(null)
    let current = reduceMotion ? FRAME_COUNT - 1 : 0
    let ticking = false

    function draw() {
      // Use the wanted frame, or the closest earlier frame that has finished loading.
      let i = current
      while (i >= 0 && !frames[i]) i--
      const img = frames[i]
      if (!img) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
    }

    function frameForScroll() {
      const scrollable = section.offsetHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollable)) : 0
      return Math.round(progress * (FRAME_COUNT - 1))
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const next = frameForScroll()
        if (next !== current) {
          current = next
          draw()
        }
      })
    }

    // Load the wanted frame first, then the rest in the background.
    const order = [current, ...Array.from({ length: FRAME_COUNT }, (_, i) => i).filter((i) => i !== current)]
    let cancelled = false
    order.forEach((index) => {
      const img = new Image()
      img.onload = () => {
        if (cancelled) return
        frames[index] = img
        if (index === current || index === 0) draw()
      }
      img.src = frameUrl(index)
    })

    if (!reduceMotion) {
      current = frameForScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="scroll-hero" aria-labelledby="hero-title">
      <div className="scroll-hero__sticky">
        <canvas
          ref={canvasRef}
          className="scroll-hero__canvas"
          role="img"
          aria-label="A pizza being made, from dough to a finished pizza, shown as you scroll"
        />
        <div className="scroll-hero__text">
          <h1 id="hero-title">{BUSINESS.name}</h1>
          <p className="scroll-hero__lead">{BUSINESS.tagline}</p>
          <Link to="/menu" className="btn btn--primary">
            See the menu
          </Link>
          <p className="scroll-hero__hint">Scroll to watch the pizza come together</p>
        </div>
      </div>
    </section>
  )
}
