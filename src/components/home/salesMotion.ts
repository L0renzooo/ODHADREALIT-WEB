import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { formatSalesNumber } from "./salesMetrics"

export function animateSalesAssistance(
  page: HTMLElement,
  journey: ScrollTrigger,
) {
  const section = page.querySelector<HTMLElement>(".sales-assistance")!
  const stage = page.querySelector<HTMLElement>("#ako-to-funguje")!
  const guide = page.querySelector<HTMLElement>(".home-guide")!
  const header = document.querySelector<HTMLElement>(".home-header")!
  const numbers = section.querySelectorAll<HTMLElement>("[data-sales-number]")
  const renderNumbers = ({ progress }: ScrollTrigger) => {
    const fraction = gsap.utils.clamp(0, 1, (progress - 0.3) / 0.56)
    numbers.forEach((node) => {
      node.textContent = formatSalesNumber(
        Number(node.dataset.salesNumber) * fraction,
      )
    })
  }
  const coverEnd = () => {
    const radius = parseFloat(getComputedStyle(section).borderTopLeftRadius)
    return "top " + (header.offsetHeight - radius - 1) + "px"
  }
  // Hold the guide in its original reading position. Only the missing scroll
  // distance goes below it, so tall mobile guides need no extra spacer.
  const pin = ScrollTrigger.create({
    id: "home-sales-cover",
    trigger: stage,
    start: () => {
      const start =
        stage.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight
      const readingDistance = gsap.utils.clamp(
        60,
        140,
        window.innerHeight * 0.16,
      )
      section.style.marginBlockStart =
        Math.max(0, Math.ceil(journey.end + readingDistance - start)) + "px"
      return start
    },
    endTrigger: section,
    end: coverEnd,
    pin: guide,
    pinSpacing: false,
  })
  const reveal = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: coverEnd,
      scrub: true,
      // A fast wheel movement can cross the pause before the smoothed scrub settles.
      onEnter: () => journey.getTween()?.progress(1),
      onUpdate: renderNumbers,
      onRefresh: renderNumbers,
    },
  })

  reveal
    .from(
      section.querySelector(".sales-assistance-photo img"),
      {
        clipPath: "inset(0 0 5% 0)",
        scale: 1.025,
        duration: 0.48,
      },
      0,
    )
    .from(
      section.querySelector("h2"),
      { y: 14, opacity: 0.55, duration: 0.36 },
      0.12,
    )
    .from(
      section.querySelector(".sales-assistance-intro"),
      { y: 9, opacity: 0.6, duration: 0.32 },
      0.22,
    )
    .from(
      section.querySelector(".sales-assistance-cta"),
      { y: 6, opacity: 0.7, duration: 0.28 },
      0.32,
    )

  const results = section.querySelector(".sales-assistance-results")
  if (results) {
    reveal.from(
      results.children,
      { y: 9, opacity: 0.55, stagger: 0.09, duration: 0.3 },
      0.3,
    )
  }

  // Native focus scrolling cannot see that the foreground covers a pinned control.
  const showFocusedControl = (event: FocusEvent) => {
    if (!pin.progress || !(event.target instanceof HTMLElement)) return
    const control = event.target.getBoundingClientRect()
    const headerBottom = header.getBoundingClientRect().bottom
    if (
      control.top >= headerBottom &&
      control.bottom <= section.getBoundingClientRect().top
    )
      return
    const offsetInGuide = control.top - guide.getBoundingClientRect().top
    const naturalTop =
      window.scrollY +
      guide.parentElement!.getBoundingClientRect().top +
      offsetInGuide
    const centeredTop =
      naturalTop - (headerBottom + window.innerHeight - control.height) / 2
    window.scrollTo({
      top: Math.min(pin.start - 1, centeredTop),
      behavior: "instant",
    })
  }
  guide.addEventListener("focusin", showFocusedControl)

  // The example and the preceding story can reflow independently of a window resize.
  let refreshFrame = 0
  const resize = new ResizeObserver(() => {
    cancelAnimationFrame(refreshFrame)
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
  })
  for (const node of page.querySelectorAll(".valuation-story, .sales-stack")) {
    resize.observe(node)
  }
  return () => {
    guide.removeEventListener("focusin", showFocusedControl)
    resize.disconnect()
    cancelAnimationFrame(refreshFrame)
    section.style.removeProperty("margin-block-start")
    numbers.forEach((node) => {
      node.textContent = formatSalesNumber(Number(node.dataset.salesNumber))
    })
  }
}
