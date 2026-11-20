import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "")

function readLocation() {
  let pathname = window.location.pathname
  if (BASE && pathname.startsWith(BASE))
    pathname = pathname.slice(BASE.length) || "/"
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, "")
  return {
    pathname,
    search: window.location.search,
    hash: window.location.hash,
  }
}

type RouterValue = {
  pathname: string
  search: string
  addressPrefill?: string
  navigate: (to: string, addressPrefill?: string) => void
}

const RouterContext = createContext<RouterValue | null>(null)

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  })
  const focusTarget = el.querySelector<HTMLElement>("h1, h2") ?? el
  if (!focusTarget.hasAttribute("tabindex"))
    focusTarget.setAttribute("tabindex", "-1")
  focusTarget.focus({ preventScroll: true })
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState<ReturnType<typeof readLocation> & {
    addressPrefill?: string
  }>(readLocation)

  useEffect(() => {
    const onPop = () => setLoc(readLocation())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const navigate = useCallback((to: string, addressPrefill?: string) => {
    const url = new URL(to, window.location.origin)
    const current = readLocation()
    const id = url.hash.slice(1)
    const samePage =
      url.pathname === current.pathname && url.search === current.search

    if (samePage && id) {
      window.history.replaceState(
        null,
        "",
        `${BASE}${url.pathname}${url.search}${url.hash}`,
      )
      scrollToId(id)
      return
    }

    window.history.pushState(
      null,
      "",
      `${BASE}${url.pathname}${url.search}${url.hash}`,
    )
    setLoc({ ...readLocation(), addressPrefill })
    requestAnimationFrame(() => {
      if (id) {
        requestAnimationFrame(() => scrollToId(id))
      } else {
        window.scrollTo({ top: 0, behavior: "auto" })
        const h1 = document.querySelector<HTMLElement>("main h1")
        if (h1) {
          h1.setAttribute("tabindex", "-1")
          h1.focus({ preventScroll: true })
        }
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      pathname: loc.pathname,
      search: loc.search,
      addressPrefill: loc.addressPrefill,
      navigate,
    }),
    [loc.pathname, loc.search, navigate],
  )

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider")
  return ctx
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string
}

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    )
      return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={`${BASE}${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
