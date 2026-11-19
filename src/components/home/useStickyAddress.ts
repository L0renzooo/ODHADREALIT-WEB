import { useEffect, useState, type RefObject } from "react"

export function useStickyAddress(
  header: RefObject<HTMLElement | null>,
  heroInput: RefObject<HTMLInputElement | null>,
) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const bar = header.current
    const input = heroInput.current
    if (!bar || !input) return
    const heroBox = input.closest(".home-input-group")!
    const slot = bar.querySelector<HTMLElement>(".home-nav-action")!
    const logo = bar.querySelector<HTMLElement>(".home-nav-inner > .home-logo")!
    const links = bar.querySelector<HTMLElement>(".home-nav-end")!
    const group = bar.querySelector<HTMLElement>(
      ".home-entry-compact .home-input-group",
    )!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const phone = matchMedia("(max-width: 700px)")
    let frame = 0
    let lastProgress = -1
    let travel = 0

    const measure = () => {
      frame = 0
      const rect = input.getBoundingClientRect()
      const lead = rect.height * 0.35
      const progress = Math.max(
        0,
        Math.min(
          1,
          (bar.getBoundingClientRect().bottom + lead - rect.top) /
            (rect.height + lead),
        ),
      )
      const painted = reduced.matches ? Number(progress >= 0.5) : progress
      if (painted === lastProgress) return
      const settled = painted === 1
      lastProgress = painted
      const phase = settled ? "ready" : painted > 0 ? "moving" : "hidden"
      if (phase !== bar.dataset.handoff) {
        bar.dataset.handoff = phase
        setReady(settled)
      }
      bar.style.setProperty("--address-opacity", String(painted))
      bar.style.setProperty("--address-rise", travel * (1 - painted) + "px")
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const layout = () => {
      const headerHeight = bar.offsetHeight
      document.documentElement.style.setProperty(
        "--home-sticky-inset",
        headerHeight + "px",
      )
      const gap = parseFloat(getComputedStyle(slot.parentElement!).columnGap)
      const bounds = slot.getBoundingClientRect()
      const min = logo.getBoundingClientRect().right + gap
      const max = links.getBoundingClientRect().left - gap - group.offsetWidth
      const left = Math.min(
        Math.max(heroBox.getBoundingClientRect().left, min),
        max,
      )
      bar.style.setProperty(
        "--address-x",
        (phone.matches ? 0 : left - bounds.left) + "px",
      )
      travel = (headerHeight + (phone.matches ? 38 : group.offsetHeight)) / 2
      lastProgress = -1
      schedule()
    }
    const resize = new ResizeObserver(layout)
    for (const el of [bar, heroBox, slot, logo, links, group])
      resize.observe(el)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("pageshow", layout)
    window.addEventListener("resize", layout)
    reduced.addEventListener("change", layout)
    layout()
    return () => {
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("pageshow", layout)
      window.removeEventListener("resize", layout)
      reduced.removeEventListener("change", layout)
      document.documentElement.style.removeProperty("--home-sticky-inset")
      delete bar.dataset.handoff
      for (const key of ["--address-x", "--address-opacity", "--address-rise"])
        bar.style.removeProperty(key)
    }
  }, [header, heroInput])
  return ready
}
