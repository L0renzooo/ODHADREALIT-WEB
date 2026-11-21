import type gsap from "gsap"

// Each scene has its own entrance, reading time and exit. The parent timeline
// adds the progress tween at time zero so every pause freezes the whole scene.
export function animateStoryScene(
  tl: gsap.core.Timeline,
  scene: HTMLElement,
  index: number,
  seconds: number,
) {
  const find = (selector: string) => scene.querySelectorAll(selector)
  switch (index) {
    case 0:
      tl.from(
        find(".story-address-box"),
        { y: 28, opacity: 0, duration: 0.6 },
        0,
      )
        .from(
          find(".story-typed b"),
          { opacity: 0, stagger: 0.08, duration: 0.01 },
          0.48,
        )
        .from(
          find(".story-checklist"),
          { height: 0, opacity: 0, duration: 0.75 },
          2.05,
        )
        .from(
          find(".story-checklist li"),
          { x: -10, opacity: 0, duration: 0.42, stagger: 0.77 },
          2.4,
        )
        .from(
          find(".story-checklist i"),
          { scale: 0.3, opacity: 0, duration: 0.25, stagger: 0.77 },
          2.83,
        )
        .to(scene, { y: 18, opacity: 0, duration: 0.36 }, seconds - 0.36)
      break
    case 1:
      tl.from(
        find(".story-phone"),
        { yPercent: 45, rotation: -6, scale: 0.92, opacity: 0, duration: 0.88 },
        0,
      )
        .from(
          find(".story-phone img"),
          { clipPath: "inset(0 100% 0 0)", duration: 0.82 },
          0.46,
        )
        .from(
          find(".story-phone dd"),
          { x: 12, opacity: 0, duration: 0.45, stagger: 0.62 },
          1.28,
        )
        .from(
          find(".story-phone dd svg"),
          { scale: 0, duration: 0.28, stagger: 0.62 },
          1.58,
        )
        .to(
          find(".story-phone"),
          { y: 25, rotation: 2, opacity: 0, duration: 0.42 },
          seconds - 0.42,
        )
      break
    case 2:
      tl.from(
        find(".story-document"),
        { yPercent: 82, rotation: -4, duration: 0.85, opacity: 0 },
        0,
      )
        .from(
          find(".story-doc-title, .story-summary"),
          { x: -12, opacity: 0, stagger: 0.16, duration: 0.48 },
          0.55,
        )
        .from(
          find(".story-price strong"),
          { clipPath: "inset(0 100% 0 0)", duration: 0.95 },
          1.32,
        )
        .from(find(".story-range-line i"), { scaleX: 0, duration: 1.08 }, 1.64)
        .from(
          find(".story-doc-note"),
          { y: 6, opacity: 0, duration: 0.42 },
          2.66,
        )
        .to(
          find(".story-document"),
          { y: 25, rotation: 2, opacity: 0, duration: 0.38 },
          seconds - 0.38,
        )
      break
    case 3:
      tl.from(
        find(".story-note"),
        { xPercent: -62, rotation: -9, opacity: 0, duration: 0.82 },
        0,
      )
        .from(
          find(".story-options"),
          { yPercent: 68, rotation: 5, opacity: 0, duration: 0.85 },
          0.54,
        )
        .from(
          find(".story-options p"),
          { x: 14, opacity: 0, stagger: 0.42, duration: 0.45 },
          1.42,
        )
        .to(
          find(".story-note, .story-options"),
          { y: 23, opacity: 0, duration: 0.38, stagger: 0.06 },
          seconds - 0.44,
        )
  }
}
