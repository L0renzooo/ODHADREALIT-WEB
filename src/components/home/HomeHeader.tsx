import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowRight, ArrowUpRight, Menu, Search, X } from "lucide-react"
import { AddressEntry, useHomeAddress } from "./HomeAddress"
import { useStickyAddress } from "./useStickyAddress"
import { Link } from "@/lib/router"
import { mainNav } from "@/content"

export function HomeLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="odhadrealit.sk – domov"
      className="home-logo"
    >
      <span className="home-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        odhadrealit<span className="home-domain">.sk</span>
      </span>
    </Link>
  )
}

const links = [
  { label: "Ako to funguje", to: "/#ako-to-funguje" },
  { label: "Služby", to: "/#sluzby" },
  ...mainNav.slice(3),
]

export function HomeHeader() {
  const menu = useRef<HTMLDialogElement>(null)
  const header = useRef<HTMLElement>(null)
  const searchButton = useRef<HTMLButtonElement>(null)
  const searchArea = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const { heroInput } = useHomeAddress()
  const past = useStickyAddress(header, heroInput)
  const [expanded, setExpanded] = useState(false)
  useLayoutEffect(() => {
    if (!past) setExpanded(false)
    else if (expanded) field.current?.focus({ preventScroll: true })
  }, [past, expanded])
  useEffect(() => {
    if (!expanded) return
    const narrow = matchMedia("(max-width: 600px)")
    const close = () => setExpanded(false)
    const outside = (event: PointerEvent | FocusEvent) => {
      if (
        event.target instanceof Node &&
        !searchArea.current?.contains(event.target)
      )
        close()
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("focusin", outside)
    narrow.addEventListener("change", close)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("focusin", outside)
      narrow.removeEventListener("change", close)
    }
  }, [expanded])
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 980px)")
    const close = () => {
      if (desktop.matches) menu.current?.close()
    }
    desktop.addEventListener("change", close)
    return () => desktop.removeEventListener("change", close)
  }, [])
  return (
    <header ref={header} className="home-header" data-compact={past}>
      <div className="home-nav-inner">
        <HomeLogo />
        <nav aria-label="Hlavná navigácia" className="home-nav-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          className="home-nav-action"
          ref={searchArea}
          data-expanded={expanded}
          onKeyDown={(event) => {
            if (event.key === "Escape" && expanded) {
              setExpanded(false)
              searchButton.current?.focus()
            }
          }}
        >
          <Link
            className="home-button nav-cta"
            to="/odhad-ceny"
            aria-label="Odhad zdarma"
            inert={past}
          >
            <span>
              Odhad<span className="home-free"> zdarma</span>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          <button
            className="home-button home-search-toggle"
            ref={searchButton}
            type="button"
            aria-label="Vyhľadať adresu"
            aria-expanded={expanded}
            aria-controls="home-sticky-entry"
            inert={!past}
            onClick={() => setExpanded(!expanded)}
          >
            <Search size={17} /> Adresa
          </button>
          <div
            className="home-sticky-entry"
            id="home-sticky-entry"
            inert={!past}
          >
            <AddressEntry headerInput={field} />
          </div>
        </div>
        <button
          className="home-menu-toggle"
          type="button"
          aria-label="Otvoriť menu"
          aria-haspopup="dialog"
          onClick={() => menu.current?.showModal()}
        >
          <Menu size={22} />
        </button>
      </div>
      <dialog
        ref={menu}
        className="home-drawer"
        aria-label="Mobilná navigácia"
        data-lenis-prevent=""
      >
        <div className="flex items-center justify-between">
          <HomeLogo onClick={() => menu.current?.close()} />
          <button
            type="button"
            className="home-menu-toggle"
            aria-label="Zavrieť menu"
            onClick={() => menu.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <nav aria-label="Mobilná navigácia">
          {[...links.slice(0, 2), ...mainNav].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => menu.current?.close()}
            >
              {link.to === "/predaj-nehnutelnosti"
                ? "Informácie pre predávajúcich"
                : link.label}
              <ArrowRight size={18} />
            </Link>
          ))}
        </nav>
      </dialog>
    </header>
  )
}
