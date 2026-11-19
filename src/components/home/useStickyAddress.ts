import { useEffect, useState, type RefObject } from "react"

export function useStickyAddress(
  header: RefObject<HTMLElement | null>,
  heroInput: RefObject<HTMLInputElement | null>,
) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const bar = header.current
    const input = heroInput.current
    if (!bar || !input) return
    let frame = 0
    let compact = false
    const measure = () => {
      frame = 0
      const boundary = bar.getBoundingClientRect().bottom
      const bottom = input.getBoundingClientRect().bottom
      // A two-pixel return band absorbs fractional scroll and zoom rounding.
      const next = bottom <= boundary + (compact ? 2 : 0)
      if (next !== compact) {
        compact = next
        setPast(next)
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const resize = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--home-sticky-inset",
        bar.offsetHeight + "px",
      )
      schedule()
    })
    resize.observe(bar)
    resize.observe(input)
    resize.observe(input.closest("section")!)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("pageshow", schedule)
    window.addEventListener("resize", schedule)
    measure()
    return () => {
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("pageshow", schedule)
      window.removeEventListener("resize", schedule)
      document.documentElement.style.removeProperty("--home-sticky-inset")
    }
  }, [header, heroInput])
  return past
}
