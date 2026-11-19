import { useLayoutEffect, type RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { animateSalesAssistance } from "./salesMotion"

gsap.registerPlugin(ScrollTrigger)

export function useEditorialMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const page = root.current
    if (!page) return
    const media = gsap.matchMedia(page)
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } })
      entrance
        .fromTo(
          ".home-gallery-window",
          { clipPath: "inset(0% 0% 0% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            clearProps: "clipPath",
          },
          0,
        )
        .from(
          ".home-title-line",
          {
            opacity: 0,
            yPercent: 35,
            duration: 0.78,
            stagger: 0.13,
            clearProps: "opacity,transform",
          },
          0.08,
        )
        .from(
          [".home-hero-lead", ".home-entry", ".home-assurances"],
          {
            opacity: 0.22,
            y: 14,
            stagger: 0.1,
            duration: 0.6,
            clearProps: "opacity,transform",
          },
          0.35,
        )
        .from(
          ".home-gallery-bar",
          { opacity: 0, y: 8, duration: 0.45, clearProps: "opacity,transform" },
          0.65,
        )

      // Trigger on stationary layout boxes so moving the children never shifts
      // their own activation point during a resize or an accordion expansion.
      const reveal = (id: string, selector: string) => {
        const trigger = page.querySelector<HTMLElement>(selector)!
        return gsap.timeline({
          defaults: { duration: 0.72, ease: "power3.out" },
          scrollTrigger: {
            id,
            trigger,
            start: () =>
              Math.max(
                12,
                trigger.getBoundingClientRect().top +
                  window.scrollY -
                  window.innerHeight * 0.78,
              ),
            toggleActions: "play none none reverse",
          },
        })
      }

      reveal("home-services", ".home-section-heading")
        .from("#services-title", { y: 20, opacity: 0.36 }, 0)
        .fromTo(
          ".home-image-reveal",
          { clipPath: "inset(0% 32% 0% 0%)", scale: 1.07 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.05,
          },
          0.09,
        )
        .from(
          ".home-service-content",
          { y: 20, opacity: 0.55, stagger: 0.12 },
          0.15,
        )
        .from(".home-broker", { y: 10, opacity: 0.65 }, 0.32)

      const owner = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".home-owner",
          start: "top 88%",
          end: "bottom 72%",
          scrub: 0.28,
        },
      })
      owner
        .fromTo(
          ".home-owner-window img",
          { clipPath: "inset(6% 40% 8% 0%)", scale: 1.045 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.85 },
          0,
        )
        .from(
          ".home-owner-copy h2",
          { y: 22, opacity: 0.55, duration: 0.38 },
          0,
        )
        .from(
          ".home-owner-copy p",
          { y: 12, opacity: 0.65, duration: 0.36 },
          0.13,
        )
        .from(
          ".home-owner-caption",
          { y: 8, opacity: 0.7, duration: 0.34 },
          0.32,
        )
        .from(
          ".home-owner-ideas li",
          { x: 15, opacity: 0.6, stagger: 0.1, duration: 0.3 },
          0.5,
        )

      reveal("home-journey", ".home-journey-heading")
        .from("#process-title", { y: 19, opacity: 0.36 }, 0)
        .from(
          ".home-journey-heading .home-button",
          { y: 12, opacity: 0.55 },
          0.16,
        )

      const steps = Array.from(
        page.querySelectorAll<HTMLElement>(".home-steps li"),
      )
      const journey = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "home-journey-progress",
          trigger: steps[0],
          endTrigger: steps[steps.length - 1],
          start: "top 88%",
          end: "center 57%",
          scrub: 0.32,
        },
      })
      steps.forEach((step, index) => {
        const cue = [
          step.querySelector(".home-step-number"),
          step.querySelector(".home-step-copy"),
        ]
        journey
          .from(
            cue,
            { y: 19, opacity: 0.5, stagger: 0.08, duration: 0.48 },
            index,
          )
          .from(
            step.querySelector(".home-step-dot"),
            { scale: 0.58, opacity: 0.4, duration: 0.42 },
            index,
          )
        const line = step.querySelector(".home-step-track i")
        if (line)
          journey.from(
            line,
            { scaleY: 0, transformOrigin: "top", duration: 0.98 },
            index + 0.1,
          )
      })

      const restoreSalesNumbers = animateSalesAssistance(page)
      reveal("home-faq", ".home-faq > div:first-child")
        .from(".home-faq > div:first-child > *", { y: 23, opacity: 0.36 }, 0)
        .from(
          ".home-faq > div:last-child > div",
          { y: 17, opacity: 0.58, stagger: 0.065 },
          0.08,
        )
      return restoreSalesNumbers
    })

    media.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const lenis = new Lenis({
          autoRaf: false,
          anchors: false,
          syncTouch: false,
          lerp: 0.11,
          stopInertiaOnNavigate: true,
          virtualScroll: ({ event }) =>
            !document.querySelector("dialog[open]") &&
            !(
              event.target instanceof Element &&
              event.target.closest(
                "input, textarea, select, [data-lenis-prevent]",
              )
            ),
        })
        // Drive Lenis from GSAP's frame loop. The absolute timestamp preserves real
        // elapsed time without changing GSAP's global lag settings on other routes.
        const tick = () => lenis.raf(performance.now())
        const endWheelScroll = (event: MouseEvent) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a[href*='#']") &&
            lenis.isScrolling
          ) {
            lenis.stop()
            lenis.start()
          }
        }
        lenis.on("scroll", ScrollTrigger.update)
        gsap.ticker.add(tick)
        document.addEventListener("click", endWheelScroll, true)
        return () => {
          document.removeEventListener("click", endWheelScroll, true)
          gsap.ticker.remove(tick)
          lenis.destroy()
        }
      },
    )
    return () => media.revert()
  }, [root])
}
