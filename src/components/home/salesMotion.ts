import gsap from "gsap"
import { formatSalesNumber } from "./salesMetrics"

// Called inside the homepage's scoped, reduced-motion-aware GSAP context.
export function animateSalesAssistance(page: HTMLElement) {
  const section = page.querySelector<HTMLElement>(".sales-assistance")!
  const guide = page.querySelector<HTMLElement>(".home-guide")!
  const photo = section.querySelector<HTMLElement>(
    ".sales-assistance-photo img",
  )!
  const travel = () =>
    Math.min(
      window.innerHeight * (window.innerWidth <= 800 ? 0.26 : 0.58),
      guide.offsetHeight * 0.78,
      section.offsetHeight * 0.78,
    )

  // Counteract the page scroll on the outgoing surface. The anchor and both
  // sections' layout boxes stay in normal flow while the foreground covers it.
  gsap.fromTo(guide, { y: 0, scale: 1 }, {
    y: () => travel() * 0.96,
    scale: () => (window.innerWidth <= 800 ? 0.99 : 0.97),
    transformOrigin: "center top",
    ease: "none",
    scrollTrigger: {
      id: "home-sales-cover",
      trigger: section,
      start: "top 91%",
      end: () => "+=" + travel(),
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  const reveal = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "home-sales-content",
      trigger: section,
      start: "top 76%",
      end: "top 23%",
      scrub: true,
    },
  })
  reveal
    .from(
      section.querySelectorAll("h2 > *"),
      { yPercent: 23, opacity: 0.38, stagger: 0.09, duration: 0.3 },
      0,
    )
    .from(
      section.querySelector(".sales-assistance-intro"),
      { y: 11, opacity: 0.4, duration: 0.29 },
      0.18,
    )
  const results = section.querySelector(".sales-assistance-results")
  if (results) {
    reveal.from(results, { y: 9, opacity: 0.45, duration: 0.28 }, 0.35)
    section
      .querySelectorAll<HTMLElement>("[data-sales-number]")
      .forEach((node) => {
        const counter = { value: 0 }
        node.textContent = formatSalesNumber(0)
        reveal.to(
          counter,
          {
            value: Number(node.dataset.salesNumber),
            duration: 0.48,
            onUpdate: () => {
              node.textContent = formatSalesNumber(Math.round(counter.value))
            },
          },
          0.37,
        )
      })
  }
  reveal.from(
    section.querySelector(".sales-assistance-cta"),
    { y: 8, opacity: 0.55, duration: 0.26 },
    results ? 0.73 : 0.46,
  )
  gsap.from(photo, {
    clipPath: "inset(0% 0% 12% 7%)",
    scale: 1.035,
    ease: "none",
    scrollTrigger: {
      id: "home-sales-photo",
      trigger: photo.parentElement,
      start: "top 84%",
      end: "top 40%",
      scrub: true,
    },
  })
  // Reverting GSAP restores styles. Restore the formatted text as well when
  // someone enables reduced motion partway through the count.
  return () =>
    section
      .querySelectorAll<HTMLElement>("[data-sales-number]")
      .forEach((node) => {
        node.textContent = formatSalesNumber(Number(node.dataset.salesNumber))
      })
}
