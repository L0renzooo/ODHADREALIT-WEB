import { useEffect, useRef } from "react"
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react"
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
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 980px)")
    const close = () => {
      if (desktop.matches) menu.current?.close()
    }
    desktop.addEventListener("change", close)
    return () => desktop.removeEventListener("change", close)
  }, [])
  return (
    <header className="home-header">
      <div className="home-nav-inner">
        <HomeLogo />
        <nav aria-label="Hlavná navigácia" className="home-nav-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="home-button nav-cta"
            to="/odhad-ceny"
            aria-label="Odhad zdarma"
          >
            <span>
              Odhad<span className="home-free"> zdarma</span>
            </span>
            <ArrowUpRight size={17} />
          </Link>
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
