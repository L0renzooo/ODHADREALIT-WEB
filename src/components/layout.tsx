import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Cookie,
  FileText,
  Mail,
  MapPin,
  Menu,
  Phone as PhoneIcon,
  Shield,
  X,
} from "lucide-react"
import { Link, useRouter } from "@/lib/router"
import { mainNav } from "@/content"
import { Button, ButtonLink, cx } from "@/components/ui"
import { LogoMark } from "@/components/visuals"

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      to="/"
      aria-label="odhadrealit.sk – domov"
      className={cx(
        "inline-flex items-center gap-2.5 rounded-lg",
        tone === "dark" ? "text-brand" : "text-white",
      )}
    >
      <span
        className={cx(
          "inline-flex size-9 items-center justify-center rounded-[12px]",
          tone === "dark" ? "bg-brand text-lime" : "bg-lime text-brand",
        )}
      >
        <LogoMark className="size-5" />
      </span>
      <span className="text-[1.2rem] font-extrabold tracking-[-0.03em]">
        odhadrealit
        <span className={tone === "dark" ? "text-sage" : "text-lime"}>.sk</span>
      </span>
    </Link>
  )
}

export function Header() {
  const { pathname } = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1180 && setOpen(false)
    document.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    document.body.style.overflow = "hidden"
    menuRef.current?.querySelector<HTMLElement>("a")?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled || open
          ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl"
          : "bg-white",
      )}
    >
      <div className="container-site flex h-[76px] items-center justify-between gap-6">
        <Logo />
        <nav
          aria-label="Hlavná navigácia"
          className="hidden min-[1180px]:block"
        >
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = pathname === item.to
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-colors",
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-ink/80 hover:bg-surface hover:text-brand",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink
            to="/odhad-ceny"
            size="sm"
            className="max-sm:hidden min-[1180px]:h-11 min-[1180px]:px-5"
          >
            Zistiť odhad zdarma
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-brand transition-colors hover:bg-surface min-[1180px]:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-x-0 top-[76px] bottom-0 overflow-y-auto border-t border-line bg-white min-[1180px]:hidden"
      >
        <nav
          aria-label="Mobilná navigácia"
          className="container-site flex min-h-full flex-col py-6"
        >
          <ul className="flex flex-col">
            {mainNav.map((item, i) => (
              <li key={item.to} className="border-b border-line">
                <Link
                  to={item.to}
                  aria-current={pathname === item.to ? "page" : undefined}
                  className="flex items-center justify-between py-5 text-[1.5rem] font-extrabold tracking-tight text-ink transition-colors hover:text-brand aria-[current=page]:text-brand"
                >
                  {item.label}
                  <span className="text-sm font-bold text-olive">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <ButtonLink to="/odhad-ceny" size="lg" className="w-full">
              Zistiť odhad zdarma
            </ButtonLink>
            <p className="mt-4 text-center text-sm text-muted">
              Orientačný odhad je nezáväzný.
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}

/* ---------- Footer ---------- */

const legal = {
  privacy: {
    title: "Ochrana súkromia",
    icon: Shield,
    body: "Doplnim ked spustime web live",
  },
  cookies: {
    title: "Nastavenia cookies",
    icon: Cookie,
    body: "Doplnim ked spustime web live",
  },
  terms: {
    title: "Obchodné podmienky",
    icon: FileText,
    body: "Doplnim",
  },
} as const

type LegalKey = keyof typeof legal

export function Footer() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [doc, setDoc] = useState<LegalKey>("privacy")
  const openDoc = (k: LegalKey) => {
    setDoc(k)
    dialogRef.current?.showModal()
  }
  const D = legal[doc]

  const services = [
    { label: "Online odhad ceny", to: "/odhad-ceny" },
    { label: "Predaj nehnuteľnosti", to: "/predaj-nehnutelnosti" },
    { label: "Výkup nehnuteľnosti", to: "/vykup-nehnutelnosti" },
    { label: "Prehľad trhu", to: "/#prehlad-trhu" },
  ]
  const company = [
    { label: "O nás", to: "/o-nas" },
    { label: "Pre maklérov", to: "/pre-maklerov" },
    { label: "Časté otázky", to: "/#faq" },
    { label: "Kontakt", to: "/kontakt" },
  ]

  return (
    <footer className="mt-auto bg-gradient-to-b from-white to-surface">
      <div className="container-site">
        <div className="grid gap-12 border-t border-line pt-14 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 leading-relaxed text-muted">
              Pomáhame majiteľom aj profesionálom robiť rozhodnutia s lepším
              prehľadom.
            </p>
          </div>
          <FooterCol title="Služby" links={services} />
          <FooterCol title="Spoločnosť" links={company} />
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">
              Kontakt
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-[0.95rem] text-muted">
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="size-4 text-olive" />
                <span>
                  E-mail:{" "}
                  <em className="font-semibold text-ink/70 not-italic">
                    info@odhadrealit.sk
                  </em>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon aria-hidden className="size-4 text-olive" />
                <span>
                  Telefón:{" "}
                  <em className="font-semibold text-ink/70 not-italic">
                    +421 918 832 655
                  </em>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin aria-hidden className="size-4 text-olive" />
                <span>
                  Sídlo:{" "}
                  <em className="font-semibold text-ink/70 not-italic">
                    xxx
                  </em>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-line py-7 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} odhadrealit.sk · Odhady na webe sú
            orientačné a nenahrádzajú znalecký posudok.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(Object.keys(legal) as LegalKey[]).map((k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => openDoc(k)}
                  className="font-semibold text-ink/70 underline-offset-4 transition-colors hover:text-brand hover:underline"
                >
                  {legal[k].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="legal-title"
        className="m-auto w-[min(92vw,520px)] rounded-card border-0 bg-white p-0 shadow-device"
        onClick={(e) =>
          e.target === dialogRef.current && dialogRef.current?.close()
        }
      >
        <div className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <D.icon aria-hidden className="size-5" strokeWidth={1.8} />
            </span>
            <button
              type="button"
              aria-label="Zavrieť"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink hover:bg-surface"
            >
              <X className="size-4" />
            </button>
          </div>
          <h2
            id="legal-title"
            className="mt-5 text-2xl font-extrabold tracking-tight text-ink"
          >
            {D.title}
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{D.body}</p>
          <Button
            variant="brand"
            className="mt-7"
            onClick={() => dialogRef.current?.close()}
          >
            Rozumiem
          </Button>
        </div>
      </dialog>
    </footer>
  )
}

type NavLink = {
  label: string
  to: string
}

type FooterColProps = {
  title: string
  links: NavLink[]
}

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div>
      <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">
        {title}
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[0.95rem] font-medium text-muted transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
