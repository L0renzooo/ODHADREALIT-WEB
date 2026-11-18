import { useLayoutEffect, useState, type FormEvent, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Search } from "lucide-react"
import { useRouter } from "@/lib/router"
import { cx, Eyebrow } from "@/components/ui"

gsap.registerPlugin(ScrollTrigger)

/*
 * Design primitives extracted verbatim from the approved homepage so every
 * page shares the same headings, search field, skyline motif and motion.
 */

/* ---------- Motion (GSAP, disabled for reduced motion) ---------- */

export function useHomeMotion(rootRef: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroItems = root.querySelectorAll("[data-hero-item]")
      if (heroItems.length) {
        gsap.from(heroItems, {
          y: 22,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        })
      }

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root)
      if (items.length) {
        gsap.set(items, { y: 26, autoAlpha: 0 })
        const reveal = (batch: Element[]) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          })
        // Reveal on every entry path so fast scrolls or anchor jumps never leave content hidden.
        ScrollTrigger.batch(items, {
          start: "top 90%",
          onEnter: reveal,
          onEnterBack: reveal,
          onLeave: reveal,
        })
      }

      const stage = root.querySelector("[data-showcase-stage]")
      if (stage) {
        gsap.fromTo(
          stage,
          { rotateX: 10, y: 48, scale: 0.95, transformPerspective: 1800 },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: stage, start: "top 95%", end: "top 40%", scrub: 0.6 },
          },
        )
      }
    })
    return () => mm.revert()
  }, [rootRef])
}

/* ---------- Shared homepage primitives ---------- */

export function HomeHeading({
  id,
  eyebrow,
  children,
  lead,
  align = "left",
  className,
}: {
  id: string
  eyebrow?: string
  children: ReactNode
  lead?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      data-reveal
      className={cx(align === "center" && "mx-auto max-w-2xl text-center", className)}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className="mt-5 text-[clamp(1.85rem,1.35rem+1.8vw,2.85rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink text-balance-safe"
      >
        {children}
      </h2>
      {lead && (
        <p className={cx("mt-5 text-lead text-muted", align === "left" && "max-w-xl")}>{lead}</p>
      )}
    </div>
  )
}

export function Soft({ children }: { children: ReactNode }) {
  return <span className="text-olive">{children}</span>
}

/* Minimal line-drawn skyline used behind the search field. */
export function Skyline({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const stroke = tone === "light" ? "var(--color-lime)" : "rgba(255,255,255,0.16)"
  const fill = tone === "light" ? "#fff" : "transparent"
  const towers = [
    { x: 36, y: 40, w: 54 },
    { x: 196, y: 12, w: 64 },
    { x: 318, y: 52, w: 86 },
    { x: 420, y: 22, w: 46 },
    { x: 578, y: 46, w: 42 },
  ]
  return (
    <svg viewBox="0 0 656 110" className={className} aria-hidden fill="none">
      <g style={{ stroke }} strokeWidth="1.5" strokeLinejoin="round">
        {towers.map((t) => (
          <g key={t.x}>
            <rect x={t.x} y={t.y} width={t.w} height={108 - t.y} rx="3" style={{ fill }} />
            {Array.from({ length: Math.floor((96 - t.y) / 14) }).map((_, r) =>
              Array.from({ length: Math.floor((t.w - 8) / 14) }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={t.x + 9 + c * 14}
                  y={t.y + 10 + r * 14}
                  width="5"
                  height="5"
                  rx="1"
                />
              )),
            )}
          </g>
        ))}
        <path d="M106 108V72l30-24 30 24v36Z" style={{ fill }} />
        <rect x="128" y="84" width="16" height="24" rx="2" />
        <path d="M478 108V74l28-22 28 22v34Z" style={{ fill }} />
        <rect x="498" y="86" width="16" height="22" rx="2" />
        <circle cx="290" cy="84" r="14" style={{ fill }} />
        <path d="M290 98v10" />
        <circle cx="556" cy="88" r="11" style={{ fill }} />
        <path d="M556 99v9" />
        <path d="M0 108h656" />
      </g>
    </svg>
  )
}

export function AddressSearch({ id, tone = "light" }: { id: string; tone?: "light" | "dark" }) {
  const { navigate } = useRouter()
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = address.trim()
    if (v.length < 3) {
      setError("Zadajte aspoň ulicu alebo obec, aby sme mohli pokračovať.")
      return
    }
    navigate(``)
  }
  const dark = tone === "dark"
  return (
    <form onSubmit={submit} noValidate className="relative mx-auto w-full max-w-[660px] text-left">
      <label htmlFor={id} className="sr-only">
        Adresa nehnuteľnosti
      </label>
      <div
        className={cx(
          "flex items-center gap-2 rounded-[20px] bg-white p-2 pl-4 transition-[box-shadow,border-color] sm:pl-5",
          dark
            ? "shadow-[0_24px_60px_-24px_rgb(0_0_0/0.6)] focus-within:shadow-[0_0_0_4px_rgb(181_195_201/0.45)]"
            : "border border-line shadow-lift focus-within:border-sage focus-within:shadow-[0_0_0_5px_rgb(103_134_148/0.16)]",
          error && "border-danger",
        )}
      >
        <MapPin aria-hidden className="size-5 shrink-0 text-sage" strokeWidth={2} />
        <input
          id={id}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            if (error) setError("")
          }}
          placeholder="Zadajte adresu nehnuteľnosti"
          autoComplete="street-address"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent text-[1rem] font-medium text-ink outline-none placeholder:text-muted/80 sm:h-14"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-[14px] bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-2 sm:h-14 sm:px-6 sm:text-[0.95rem]"
        >
          <Search aria-hidden className="size-4" strokeWidth={2.4} />
          <span className="max-[380px]:sr-only">Zistiť odhad</span>
        </button>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className={cx(
            "mt-3 pl-4 text-sm font-semibold sm:pl-5",
            dark ? "text-lime" : "text-danger",
          )}
        >
          {error}
        </p>
      )}
    </form>
  )
}

/* ---------- Page-level building blocks for the inner pages ---------- */

export const usePageMotion = useHomeMotion
export const SectionHeading = HomeHeading

/* Light intro section matching the homepage hero (white, faint grid). */
export function PageIntro({
  id = "page-title",
  eyebrow,
  title,
  lead,
  align = "left",
  children,
  aside,
  footer,
}: {
  id?: string
  eyebrow: string
  title: ReactNode
  lead: string
  align?: "left" | "center"
  children?: ReactNode
  aside?: ReactNode
  footer?: ReactNode
}) {
  const center = align === "center"
  return (
    <section aria-labelledby={id} className="relative overflow-hidden">
      <div aria-hidden className="bg-hero-light absolute inset-0" />
      <div aria-hidden className="bg-grid-light absolute inset-0" />
      <div className="container-site relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div
          className={cx(
            "grid items-center gap-12 lg:gap-16 [&>*]:min-w-0",
            !!aside && "lg:grid-cols-[1.05fr_0.95fr]",
            center && "text-center",
          )}
        >
          <div className={cx(center && "mx-auto max-w-3xl")}>
            <p
              data-hero-item
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-[0.8rem] font-semibold text-muted backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-sage" />
              {eyebrow}
            </p>
            <h1
              data-hero-item
              id={id}
              className={cx(
                "mt-6 text-[clamp(2.1rem,1.5rem+2.4vw,3.4rem)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink text-balance-safe",
                center ? "mx-auto max-w-3xl" : "max-w-2xl",
              )}
            >
              {title}
            </h1>
            <p
              data-hero-item
              className={cx("mt-5 text-lead text-muted", center ? "mx-auto max-w-[36rem]" : "max-w-xl")}
            >
              {lead}
            </p>
            {children && (
              <div
                data-hero-item
                className={cx("mt-9 flex flex-wrap items-center gap-3", center && "justify-center")}
              >
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div data-hero-item className="relative">
              {aside}
            </div>
          )}
        </div>
        {footer && <div data-hero-item>{footer}</div>}
      </div>
    </section>
  )
}

/* Navy closing banner, same treatment as the homepage closing CTA. */
export function ClosingBanner({
  id,
  title,
  highlight,
  text,
  children,
}: {
  id: string
  title: string
  highlight: string
  text: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="container-site pb-16 sm:pb-20 lg:pb-24">
      <div
        data-reveal
        className="on-dark bg-navy relative overflow-hidden rounded-[28px] px-6 pt-16 pb-36 text-center text-white sm:rounded-hero sm:px-10 sm:pt-20 sm:pb-40 lg:pt-24 lg:pb-44"
      >
        <Skyline
          tone="dark"
          className="pointer-events-none absolute bottom-0 left-1/2 w-[760px] max-w-none -translate-x-1/2"
        />
        <div className="relative">
          <h2
            id={id}
            className="mx-auto max-w-3xl text-[clamp(1.9rem,1.35rem+2vw,3rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance-safe"
          >
            {title} <span className="text-lime">{highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lead text-white/75">{text}</p>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  )
}

/* Compact icon + title + text item used in divided rows. */
export function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>
  title: string
  text: string
}) {
  return (
    <div>
      <Icon aria-hidden className="size-6 text-sage" strokeWidth={1.6} />
      <h3 className="mt-4 text-[1.05rem] font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
    </div>
  )
}
