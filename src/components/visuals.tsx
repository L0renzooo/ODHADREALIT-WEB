import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import {
  BarChart3,
  Bath,
  BedDouble,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Home,
  LayoutGrid,
  MapPin,
  Maximize2,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { cx, DemoBadge } from "@/components/ui"
import { images } from "@/content"

/* Scales a fixed-size design canvas to the width of its container. */
export function ScaleFrame({
  width,
  height,
  children,
  className,
}: {
  width: number
  height: number
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return (
    <div
      ref={ref}
      className={cx("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- Primitives ---------- */

const trend = [42, 44, 43, 47, 49, 48, 52, 55, 54, 58, 61, 60, 64, 67]

export function PriceChart({
  data = trend,
  className,
  dark = false,
  showAxis = true,
}: {
  data?: number[]
  className?: string
  dark?: boolean
  showAxis?: boolean
}) {
  const gid = useId().replace(/:/g, "")
  const w = 320
  const h = 120
  const min = Math.min(...data) - 4
  const max = Math.max(...data) + 2
  const pts = data.map(
    (v, i) =>
      [(i / (data.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const,
  )
  const line = pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ")
  const area = `${line} L${w},${h} L0,${h} Z`
  const last = pts[pts.length - 1]
  return (
    <svg
      viewBox={`0 0 ${w} ${h + (showAxis ? 18 : 0)}`}
      className={cx("w-full overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`a${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            style={{ stopColor: "var(--color-lime)" }}
            stopOpacity={dark ? 0.4 : 0.35}
          />
          <stop offset="100%" style={{ stopColor: "var(--color-lime)" }} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={w}
          y1={h * f}
          y2={h * f}
          style={{ stroke: dark ? "rgba(255,255,255,0.1)" : "var(--color-line)" }}
          strokeDasharray="3 5"
        />
      ))}
      <path d={area} fill={`url(#a${gid})`} />
      <path
        d={line}
        fill="none"
        style={{ stroke: dark ? "var(--color-lime)" : "var(--color-brand)" }}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="stroke-draw animate-draw"
      />
      <circle cx={last[0]} cy={last[1]} r="9" style={{ fill: "var(--color-lime)" }} opacity="0.35" />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="4.5"
        style={{ fill: dark ? "var(--color-lime)" : "var(--color-brand)" }}
        stroke="#fff"
        strokeWidth="2"
      />
      {showAxis &&
        ["2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((y, i) => (
          <text
            key={y}
            x={(i / 6) * w}
            y={h + 15}
            textAnchor={i === 0 ? "start" : i === 6 ? "end" : "middle"}
            fontSize="9"
            fontWeight="600"
            style={{ fill: dark ? "rgba(255,255,255,0.5)" : "var(--color-muted)" }}
          >
            {y}
          </text>
        ))}
    </svg>
  )
}

export function MiniMap({
  className,
  markers = true,
}: {
  className?: string
  markers?: boolean
}) {
  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      className={cx("h-full w-full", className)}
      aria-hidden
    >
      <rect width="300" height="200" style={{ fill: "var(--map-land)" }} />
      <path
        d="M-10 150 C 60 120, 110 175, 170 140 S 260 95, 320 120 L320 160 C 260 140, 200 185, 160 175 S 60 160, -10 190 Z"
        style={{ fill: "var(--map-water)" }}
      />
      <path
        d="M20 20 h70 v45 h-70z M210 30 h60 v38 h-60z"
        style={{ fill: "var(--map-park)" }}
        rx="6"
      />
      <circle cx="240" cy="170" r="18" style={{ fill: "var(--map-park)" }} />
      <g stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M0 95 H300" />
        <path d="M150 0 V200" />
        <path d="M30 200 L120 0" />
      </g>
      <g stroke="#fff" strokeWidth="3" fill="none">
        <path d="M0 45 H300 M0 125 H300 M60 0 V200 M230 0 V200 M195 0 L260 200" />
      </g>
      {markers && (
        <g>
          {[
            [74, 70],
            [205, 62],
            [190, 120],
            [102, 128],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="9" fill="#fff" />
              <circle cx={x} cy={y} r="5" style={{ fill: "var(--color-olive)" }} />
            </g>
          ))}
          <circle cx="150" cy="95" r="26" style={{ fill: "var(--color-brand)" }} opacity="0.12" />
          <circle cx="150" cy="95" r="15" style={{ fill: "var(--color-brand)" }} opacity="0.2" />
          <path
            d="M150 74 c-9 0 -15 6.5 -15 14.5 c0 10 15 22 15 22 s15 -12 15 -22 c0 -8 -6 -14.5 -15 -14.5z"
            style={{ fill: "var(--color-brand)" }}
          />
          <circle cx="150" cy="88.5" r="5" style={{ fill: "var(--color-lime)" }} />
        </g>
      )}
    </svg>
  )
}

function Comparable({
  img,
  title,
  meta,
  price,
}: {
  img: string
  title: string
  meta: string
  price: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
      <img
        src={img}
        alt=""
        className="size-14 rounded-xl object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ink">{title}</p>
        <p className="text-[11px] font-medium text-muted">{meta}</p>
      </div>
      <p className="pr-1 text-[13px] font-extrabold text-brand">{price}</p>
    </div>
  )
}

/* ---------- Laptop dashboard (960 x 600 canvas) ---------- */

export function ValuationDashboard() {
  return (
    <div className="flex h-[600px] w-[960px] bg-surface font-sans text-ink">
      <aside className="flex w-[68px] flex-col items-center gap-5 bg-brand py-5 text-white/60">
        <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-lime text-brand">
          <LogoMark className="size-5" />
        </span>
        {[LayoutGrid, Home, BarChart3, MapPin, FileText, Settings].map(
          (I, i) => (
            <span
              key={i}
              className={cx(
                "inline-flex size-10 items-center justify-center rounded-xl",
                i === 1 && "bg-white/12 text-white",
              )}
            >
              <I className="size-[18px]" strokeWidth={1.8} />
            </span>
          ),
        )}
      </aside>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13px] text-muted">
            <Search className="size-4" /> Vyhľadať adresu alebo lokalitu…
          </div>
          <DemoBadge />
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white">
            <Bell className="size-4 text-brand" />
          </span>
          <span className="size-10 rounded-full bg-gradient-to-br from-sage to-brand" />
        </div>

        <div className="grid flex-1 grid-cols-[1.25fr_1fr] gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <img
                src={images.house.thumb}
                alt=""
                className="h-[148px] w-[190px] rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <p className="text-[11px] font-bold tracking-[0.12em] text-olive uppercase">
                  Rodinný dom · 5 izieb
                </p>
                <p className="mt-1 text-[17px] leading-tight font-extrabold">
                  Javorová 14, Ukážkovo
                </p>
                <p className="text-[12px] text-muted">
                  Fiktívna adresa na ilustráciu
                </p>
                <div className="mt-auto flex gap-4 text-[12px] font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    <Maximize2 className="size-3.5" /> 164 m²
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="size-3.5" /> 5
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="size-3.5" /> 2
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold">
                  Vývoj ceny za m² v lokalite
                </p>
                <span className="flex items-center gap-1 rounded-full bg-lime-soft px-2 py-0.5 text-[11px] font-bold text-lime-ink">
                  <TrendingUp className="size-3" /> ilustračný trend
                </span>
              </div>
              <PriceChart className="mt-3" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-brand p-5 text-white">
              <div className="absolute -top-10 -right-10 size-40 rounded-full bg-lime/20 blur-2xl" />
              <p className="text-[12px] font-semibold text-white/70">
                Orientačný odhad (demo)
              </p>
              <p className="mt-1 text-[30px] leading-none font-extrabold tracking-tight">
                312 000 <span className="text-lime">€</span>
              </p>
              <p className="mt-2 text-[12px] text-white/70">
                Rozpätie 296 000 – 329 000 €
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/15">
                <div className="relative h-2 w-[62%] rounded-full bg-gradient-to-r from-sage to-lime">
                  <span className="absolute top-1/2 right-0 size-4 translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-lime" />
                </div>
              </div>
            </div>
            <div className="relative h-[142px] overflow-hidden rounded-3xl">
              <MiniMap />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand shadow-sm">
                4 porovnateľné ponuky v okolí
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Comparable
                img={images.villa.thumb}
                title="Dom, Lipová ul."
                meta="148 m² · 0,6 km"
                price="289 tis. €"
              />
              <Comparable
                img={images.interior.thumb}
                title="Dom, Brezová ul."
                meta="171 m² · 1,1 km"
                price="334 tis. €"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.5 11 14l2.2 2 3.8-4.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Laptop({ className }: { className?: string }) {
  return (
    <div className={cx("relative", className)}>
      <div className="relative rounded-[22px] bg-gradient-to-b from-[#2a2530] to-[#121015] p-[1.6%] shadow-device ring-1 ring-white/10">
        <div className="absolute top-[0.7%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white/20" />
        <div className="overflow-hidden rounded-[10px]">
          <ScaleFrame width={960} height={600}>
            <ValuationDashboard />
          </ScaleFrame>
        </div>
        <div className="pointer-events-none absolute inset-[1.6%] rounded-[10px] bg-gradient-to-tr from-transparent via-transparent to-white/10" />
      </div>
      <div className="relative mx-[-6%] h-[14px] rounded-b-[18px] bg-gradient-to-b from-[#d8d6dc] via-[#bfbcc4] to-[#8d8a93] shadow-[0_30px_40px_-20px_rgba(10,5,20,0.7)]">
        <div className="absolute top-0 left-1/2 h-[6px] w-[16%] -translate-x-1/2 rounded-b-lg bg-[#a6a3ab]" />
      </div>
    </div>
  )
}

/* ---------- Phone (300 x 620 canvas) ---------- */

export function PhoneScreen() {
  return (
    <div className="flex h-[620px] w-[300px] flex-col bg-white font-sans text-ink">
      <div className="flex items-center justify-between px-6 pt-4 text-[12px] font-bold">
        <span>9:41</span>
        <span className="h-[22px] w-[86px] rounded-full bg-black" />
        <span className="flex gap-1">
          <span className="h-2.5 w-4 rounded-sm bg-ink" />
        </span>
      </div>
      <div className="relative mx-3 mt-3 h-[210px] overflow-hidden rounded-[22px]">
        <img
          src={images.apartments.thumb}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/20 to-transparent" />
        <span className="absolute top-3 left-3">
          <DemoBadge tone="dark" label="Demo" />
        </span>
        <div className="absolute bottom-3 left-4 text-white">
          <p className="text-[11px] font-semibold text-white/75">
            Byt 3 izby · 78 m²
          </p>
          <p className="text-[16px] font-extrabold">Agátová 8, Ukážkovo</p>
        </div>
      </div>
      <div className="px-4 pt-4">
        <p className="text-[11px] font-bold tracking-[0.12em] text-olive uppercase">
          Orientačný odhad
        </p>
        <p className="mt-1 text-[28px] leading-none font-extrabold tracking-tight text-brand">
          186 500 €
        </p>
        <p className="mt-1 text-[12px] text-muted">Rozpätie 176 – 197 tis. €</p>
        <div className="mt-3 rounded-2xl bg-surface p-3">
          <PriceChart
            showAxis={false}
            data={[30, 32, 31, 35, 37, 36, 40, 43, 45]}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ["78 m²", "plocha"],
            ["3/6", "poschodie"],
            ["2009", "kolaudácia"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-line py-2">
              <p className="text-[13px] font-extrabold">{v}</p>
              <p className="text-[10px] font-medium text-muted">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-lime text-[13px] font-bold">
          Zobraziť možnosti <ChevronRight className="size-4" />
        </div>
      </div>
    </div>
  )
}

export function Phone({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "relative rounded-[42px] bg-[#16131a] p-[3.2%] shadow-device ring-1 ring-white/15",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[34px]">
        <ScaleFrame width={300} height={620}>
          <PhoneScreen />
        </ScaleFrame>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[42px] bg-gradient-to-tr from-transparent via-transparent to-white/15" />
    </div>
  )
}

export function HeroDevices() {
  return (
    <div className="relative mx-auto w-full max-w-[720px] lg:max-w-none">
      <div className="device-tilt animate-float-slow motion-reduce:animate-none">
        <Laptop className="ml-[4%] w-[92%] sm:ml-[8%] sm:w-[90%]" />
      </div>
      <div className="absolute bottom-[-6%] left-0 w-[27%] sm:left-[-2%] lg:left-[-1%]">
        <div className="phone-tilt animate-float motion-reduce:animate-none">
          <Phone />
        </div>
      </div>
      <div className="absolute top-[-4%] right-[2%] hidden items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:flex">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-lime-soft text-lime-ink">
          <Check className="size-4" strokeWidth={3} />
        </span>
        <div className="leading-tight">
          <p className="text-[0.72rem] font-semibold text-muted">
            Ukážka výstupu
          </p>
          <p className="text-[0.85rem] font-extrabold text-ink">
            Odhad pripravený
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Analytics composition (insights section) ---------- */

export function AnalyticsBoard() {
  return (
    <div className="relative">
      <div className="relative rounded-[28px] border border-line bg-surface p-3 shadow-lift sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-1 pb-4">
          <div>
            <p className="text-sm font-extrabold text-ink">Prehľad lokality</p>
            <p className="text-xs text-muted">
              Ukážkové zobrazenie analytického prehľadu
            </p>
          </div>
          <DemoBadge />
        </div>
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
          <div className="rounded-2xl bg-white p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">
                  Priemerná cena za m² (ilustračne)
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
                  2 840 €
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-lime-soft px-2.5 py-1 text-xs font-bold text-lime-ink">
                <TrendingUp className="size-3.5" /> rastúci trend
              </span>
            </div>
            <PriceChart
              className="mt-5"
              data={[38, 40, 39, 42, 41, 45, 47, 46, 50, 53, 52, 56, 58]}
            />
          </div>
          <div className="grid gap-3">
            <div className="relative min-h-40 overflow-hidden rounded-2xl">
              <MiniMap />
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold text-muted">
                Rozloženie ponúk podľa ceny
              </p>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[30, 48, 72, 100, 84, 58, 36, 22].map((v, i) => (
                  <span
                    key={i}
                    className={cx(
                      "flex-1 rounded-t-md",
                      i === 3 ? "bg-brand" : i === 4 ? "bg-sage" : "bg-line",
                    )}
                    style={{ height: `${v}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 [&>*]:min-w-0">
          {[
            {
              img: images.apartments.thumb,
              t: "Byt 2 izby",
              m: "54 m² · 0,4 km",
              p: "149 tis. €",
            },
            {
              img: images.interior.thumb,
              t: "Byt 3 izby",
              m: "76 m² · 0,8 km",
              p: "204 tis. €",
            },
            {
              img: images.villa.thumb,
              t: "Byt 3 izby",
              m: "81 m² · 1,2 km",
              p: "219 tis. €",
            },
          ].map((c) => (
            <Comparable
              key={c.p}
              img={c.img}
              title={c.t}
              meta={c.m}
              price={c.p}
            />
          ))}
        </div>
      </div>
      <div className="absolute -top-6 -left-4 hidden rounded-2xl border border-line bg-white p-4 shadow-lift lg:block xl:-left-10">
        <p className="text-xs font-semibold text-muted">Porovnanie s okolím</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand text-lime">
            <Sparkles className="size-5" strokeWidth={1.8} />
          </span>
          <p className="text-sm leading-tight font-extrabold text-ink">
            Mierne nad
            <br />
            priemerom lokality
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Agent workspace mockup ---------- */

export function AgentBoard() {
  const rows = [
    {
      t: "Byt 3 izby · Ukážkovo-Juh",
      s: "Nový dopyt",
      c: "bg-lime-soft text-lime-ink",
      i: MessageSquare,
    },
    {
      t: "Rodinný dom · Ukážková Ves",
      s: "Odhad pripravený",
      c: "bg-brand-soft text-brand",
      i: FileText,
    },
    {
      t: "Byt 2 izby · Centrum",
      s: "Stretnutie",
      c: "bg-surface text-olive",
      i: CalendarClock,
    },
  ]
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-line">
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#e7c1c5]" />
            <span className="size-2.5 rounded-full bg-[#ecdfb0]" />
            <span className="size-2.5 rounded-full bg-[#c4dcb8]" />
          </div>
          <p className="text-xs font-bold text-muted">
            Pracovný priestor makléra
          </p>
          <DemoBadge />
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[1fr_1.2fr] sm:p-5 [&>*]:min-w-0">
          <div className="flex flex-col gap-3 rounded-2xl bg-brand p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Building2 className="size-4 text-lime" /> Vaša značka
            </div>
            <p className="text-lg leading-snug font-extrabold">
              Kontakty na záujemcov o predaj a kúpu nehnuteľností
            </p>
            <div className="mt-auto rounded-xl bg-white/10 p-3">
              <PriceChart
                dark
                showAxis={false}
                data={[20, 22, 21, 25, 27, 26, 30, 33]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold tracking-[0.12em] text-olive uppercase">
              Prehľad príležitostí
            </p>
            {rows.map((r) => (
              <div
                key={r.t}
                className="flex items-center gap-3 rounded-2xl border border-line p-3"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface text-brand">
                  <r.i className="size-4" strokeWidth={1.8} />
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                  {r.t}
                </p>
                <span
                  className={cx(
                    "rounded-full px-2.5 py-1 text-[0.7rem] font-bold whitespace-nowrap",
                    r.c,
                  )}
                >
                  {r.s}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-2xl border border-dashed border-line p-3 text-sm font-semibold text-muted">
              <Users className="size-4" /> Zdieľanie s tímom
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-3 -bottom-6 hidden items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift sm:flex">
        <Clock3 className="size-4 text-lime" />
        <p className="text-sm font-bold">Štruktúrovaný príjem údajov</p>
      </div>
    </div>
  )
}

/* ---------- Final CTA visual ---------- */

export function CtaVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
      <div className="absolute inset-[8%_6%_14%_14%] rotate-[4deg] overflow-hidden rounded-[28px] shadow-device">
        <img
          src={images.villa.src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent" />
      </div>
      <div className="absolute bottom-[4%] left-0 w-[62%] -rotate-[3deg] rounded-[22px] bg-white p-4 shadow-device sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] font-bold tracking-[0.12em] text-olive uppercase">
            Orientačný odhad
          </p>
          <DemoBadge label="Demo" />
        </div>
        <p className="mt-2 text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
          248 – 271 tis. €
        </p>
        <PriceChart
          className="mt-3"
          showAxis={false}
          data={[22, 24, 23, 27, 26, 30, 32, 35]}
        />
      </div>
      <div className="absolute top-[2%] right-[2%] flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-extrabold text-ink shadow-lift">
        <MapPin className="size-4" /> Vaša adresa
      </div>
    </div>
  )
}
