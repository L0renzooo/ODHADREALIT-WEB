import { useRef, useState, type FormEvent, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Check,
  Compass,
  Handshake,
  LayoutList,
  LineChart,
  MapPin,
  MapPinned,
  MousePointerClick,
  Scale,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Link, useRouter } from "@/lib/router"
import { faqs, images } from "@/content"
import { Accordion, ButtonLink, cx, DemoBadge, Eyebrow } from "@/components/ui"
import { AgentBoard, CtaVisual, HeroDevices, MiniMap, PriceChart } from "@/components/visuals"

import { AddressSearch, HomeHeading, Skyline, Soft, useHomeMotion } from "@/components/site"

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  useHomeMotion(rootRef)
  return (
    <div ref={rootRef} className="[&>section+section]:pt-0">
      <Hero />
      <Showcase />
      <Services />
      <Process />
      <Trust />
      <SellingBanner />
      <Agents />
      <Faq />
      <ClosingCta />
    </div>
  )
}

/* ---------- Hero ---------- */

const benefits = [
  { icon: Calculator, title: "Odhad ceny online", text: "Orientačné rozpätie bez obhliadky." },
  { icon: LineChart, title: "Prehľad trhu", text: "Kontext lokality na jednom mieste." },
  { icon: MousePointerClick, title: "Jednoduchý proces", text: "Pár krokov a zrozumiteľný výstup." },
  { icon: Handshake, title: "Pomoc pri predaji", text: "Podpora pri ďalšom rozhodnutí." },
]

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-hero-light absolute inset-0" />
      <div aria-hidden className="bg-grid-light absolute inset-0" />
      <div className="container-site relative pt-14 pb-16 text-center sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        <p
          data-hero-item
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-[0.8rem] font-semibold text-muted backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-sage" />
          Orientačný odhad ceny bytu a domu
        </p>
        <h1
          data-hero-item
          id="hero-title"
          className="mx-auto mt-7 max-w-4xl text-[clamp(2.2rem,1.45rem+3vw,4rem)] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink text-balance-safe"
        >
          Poznajte <span className="text-sage">skutočnú hodnotu</span>
          <br className="hidden sm:block" /> svojej nehnuteľnosti.
        </h1>
        <p data-hero-item className="mx-auto mt-6 max-w-[36rem] text-lead text-muted">
          Získajte orientačný odhad ceny bytu či domu, spoznajte situáciu na trhu a rozhodnite sa o
          ďalšom kroku s väčšou istotou.
        </p>

        <div data-hero-item className="relative mx-auto mt-10 max-w-[660px] sm:mt-12">
          <Skyline className="mx-auto -mb-px hidden w-[78%] sm:block" />
          <AddressSearch id="home-address" />
        </div>

        <div
          data-hero-item
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          <ButtonLink to="" variant="outline" size="sm">
            Zistiť odhad zdarma
          </ButtonLink>
          <Link
            to="/#ako-to-funguje"
            className="group inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-bold text-ink/80 transition-colors hover:text-brand"
          >
            Ako to funguje
            <ArrowDown
              aria-hidden
              className="size-4 transition-transform group-hover:translate-y-0.5"
            />
          </Link>
        </div>

        <ul
          data-hero-item
          className="mx-auto mt-16 grid max-w-[1120px] grid-cols-2 gap-y-8 border-t border-line pt-10 text-left sm:mt-20 lg:grid-cols-4 lg:gap-y-0"
        >
          {benefits.map((b, i) => (
            <li
              key={b.title}
              className={cx(
                "flex flex-col gap-3 px-3 sm:flex-row sm:items-start sm:px-6",
                i > 0 && "lg:border-l lg:border-line",
                i % 2 === 1 && "max-lg:border-l max-lg:border-line",
              )}
            >
              <b.icon aria-hidden className="size-6 shrink-0 text-sage" strokeWidth={1.6} />
              <div>
                <h2 className="text-[0.98rem] font-extrabold tracking-tight text-ink">{b.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Product showcase (former hero devices) ---------- */

function Showcase() {
  const features = [
    { icon: Scale, t: "Cenové rozpätie", d: "Realistický interval namiesto jedného zavádzajúceho čísla." },
    { icon: MapPinned, t: "Kontext lokality", d: "Vývoj cien a poloha nehnuteľnosti v súvislostiach." },
    { icon: LayoutList, t: "Porovnateľné ponuky", d: "Podobné nehnuteľnosti v okolí pre lepšie porovnanie." },
  ]
  return (
    <section id="prehlad-trhu" aria-labelledby="showcase-title" className="container-site section-y">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-surface via-white to-white px-4 pt-14 pb-10 sm:rounded-hero sm:px-10 sm:pt-20 lg:px-16 lg:pb-14">
        <HomeHeading
          id="showcase-title"
          eyebrow="Prehľad trhu"
          align="center"
          lead="Cena nehnuteľnosti súvisí s lokalitou, stavom aj ponukou v okolí. Prehľadné zobrazenie vám pomôže pochopiť súvislosti a naplánovať ďalší krok."
        >
          Rozhodnutia podložené <Soft>lepším prehľadom o trhu.</Soft>
        </HomeHeading>

        <div className="mx-auto mt-14 max-w-[1000px] pb-8 sm:mt-16 sm:pb-12">
          <div data-showcase-stage className="will-change-transform">
            <HeroDevices />
          </div>
        </div>

        <ul className="mx-auto grid max-w-[1000px] gap-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-10">
          {features.map((f) => (
            <li key={f.t} data-reveal>
              <f.icon aria-hidden className="size-6 text-sage" strokeWidth={1.6} />
              <h3 className="mt-4 text-[1.05rem] font-extrabold tracking-tight text-ink">{f.t}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{f.d}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-muted">
          Zobrazené rozhranie a hodnoty sú ilustračné. Prototyp nie je napojený na databázu reálnych
          transakcií.
        </p>
      </div>
    </section>
  )
}

/* ---------- Services ---------- */

function Services() {
  return (
    <section aria-labelledby="services-title" className="container-site section-y">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <HomeHeading id="services-title" eyebrow="Služby" className="max-w-2xl">
          <Soft>Všetko, čo potrebujete vedieť</Soft> o svojej nehnuteľnosti.
        </HomeHeading>
        <p data-reveal className="max-w-sm text-muted lg:pb-1">
          Od prvého odhadu až po rozhodnutie, či predávať klasicky, alebo zvoliť rýchlejšiu cestu.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        <ServiceCard
          to="/odhad-ceny"
          index="01"
          title="Online odhad ceny"
          text="Zistite približnú trhovú hodnotu bytu alebo domu na základe lokality a parametrov."
          cta="Spustiť odhad"
          visual={
            <div className="on-dark bg-navy flex h-full items-center justify-center p-6">
              <div className="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-device">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-muted">Byt 2 izby · 61 m²</p>
                  <DemoBadge label="Demo" />
                </div>
                <p className="mt-2 text-xl font-extrabold tracking-tight text-brand">
                  168 – 184 tis. €
                </p>
                <PriceChart
                  className="mt-2"
                  showAxis={false}
                  data={[18, 20, 19, 23, 22, 26, 29, 31]}
                />
              </div>
            </div>
          }
        />
        <ServiceCard
          to="/predaj-nehnutelnosti"
          index="02"
          title="Predaj nehnuteľnosti"
          text="Pomôžeme vám pripraviť predaj tak, aby prebehol za vhodných podmienok."
          cta="Viac o predaji"
          visual={
            <img
              src={images.interior.src}
              alt={images.interior.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          }
        />
        <ServiceCard
          to="/vykup-nehnutelnosti"
          index="03"
          title="Rýchly výkup nehnuteľnosti"
          text="Preskúmajte rýchlejšiu možnosť predaja a požiadajte o individuálnu, nezáväznú ponuku."
          cta="Mám záujem o výkup"
          className="md:col-span-2 lg:col-span-1"
          visual={
            <div className="flex h-full flex-col justify-center gap-2.5 bg-surface px-8">
              {["Dopyt", "Individuálne posúdenie", "Nezáväzná ponuka"].map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-card"
                >
                  <span
                    className={cx(
                      "inline-flex size-7 items-center justify-center rounded-lg text-xs font-extrabold",
                      i === 2 ? "bg-brand text-white" : "bg-brand-soft text-brand",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-ink">{s}</span>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </section>
  )
}

function ServiceCard({
  to,
  index,
  title,
  text,
  cta,
  visual,
  className,
}: {
  to: string
  index: string
  title: string
  text: string
  cta: string
  visual: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      data-reveal
      className={cx(
        "group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative h-56 overflow-hidden sm:h-60">{visual}</div>
      <div className="flex flex-1 flex-col p-7">
        <span className="text-xs font-bold tracking-[0.14em] text-olive">{index}</span>
        <h3 className="mt-3 text-[1.3rem] font-extrabold tracking-tight text-ink">{title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{text}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand">
          {cta}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  )
}

/* ---------- Process ---------- */

function Process() {
  return (
    <section id="ako-to-funguje" aria-labelledby="process-title" className="container-site section-y">
      <HomeHeading id="process-title" eyebrow="Ako to funguje" className="max-w-2xl">
        <Soft>Od odhadu</Soft> k správnemu rozhodnutiu.
      </HomeHeading>
      <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.t} data-reveal className="group relative border-t border-line pt-7">
            <span
              aria-hidden
              className="absolute -top-px left-0 h-0.5 w-10 bg-brand transition-[width] duration-500 group-hover:w-full"
            />
            <span className="block text-[2.75rem] leading-none font-extrabold tracking-[-0.04em] text-lime">
              0{i + 1}
            </span>
            <h3 className="mt-5 text-[1.15rem] font-extrabold tracking-tight text-ink">{s.t}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------- Trust ---------- */

const trust = [
  { icon: Compass, t: "Prehľadné informácie", d: "Výstupy, v ktorých sa zorientujete aj bez skúseností s realitným trhom." },
  { icon: MousePointerClick, t: "Jednoduché používanie", d: "Pýtame sa len na to, čo je pre orientačný odhad naozaj dôležité." },
  { icon: UserRound, t: "Individuálny prístup", d: "Ak potrebujete viac než orientačné číslo, situáciu posúdime jednotlivo." },
  { icon: ShieldCheck, t: "Pomoc pri ďalšom rozhodovaní", d: "Pomôžeme porovnať možnosti a zvoliť krok, ktorý zodpovedá vašim cieľom." },
]

function Trust() {
  return (
    <section aria-labelledby="trust-title" className="container-site section-y">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <HomeHeading
          id="trust-title"
          eyebrow="Prečo odhadrealit.sk"
          lead="Kvalitné rozhodnutie začína porozumením. Preto stavíme na zrozumiteľnosť, transparentnosť a ľudský prístup."
        >
          Technológia, <Soft>ktorá vysvetľuje,</Soft> nie mätie.
        </HomeHeading>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {trust.map((c) => (
            <li key={c.t} data-reveal className="flex gap-4 border-t border-line py-7">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <c.icon aria-hidden className="size-5" strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-[1.05rem] font-extrabold tracking-tight text-ink">{c.t}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{c.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Selling banner ---------- */

function SellingBanner() {
  return (
    <section aria-labelledby="sell-title" className="container-site section-y">
      <div className="relative grid grid-cols-1 lg:grid-cols-12 lg:items-center [&>*]:min-w-0">
        <div
          data-reveal
          className="relative h-[320px] overflow-hidden rounded-[28px] sm:h-[440px] sm:rounded-hero lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:h-[560px]"
        >
          <img
            src={images.apartments.src}
            alt={images.apartments.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/30 via-brand/5 to-transparent" />
        </div>
        <div
          data-reveal
          className="relative z-10 mx-3 -mt-20 rounded-card border border-line bg-white p-7 shadow-lift sm:mx-8 sm:p-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-11"
        >
          <Eyebrow>Predaj a výkup</Eyebrow>
          <h2
            id="sell-title"
            className="mt-5 text-[clamp(1.7rem,1.3rem+1.4vw,2.4rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink"
          >
            Keď poznáte cenu, ľahšie sa rozhodnete.
          </h2>
          <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {[
              { t: "Asistovaný predaj", d: "Keď máte čas a chcete dosiahnuť vhodnú cenu na trhu." },
              { t: "Dopyt na výkup", d: "Rýchlejšia alternatíva s individuálnou, nezáväznou ponukou." },
            ].map((p) => (
              <li key={p.t} className="flex gap-3 py-4">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-sage" strokeWidth={2.2} />
                <div>
                  <p className="font-extrabold text-ink">{p.t}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <ButtonLink to="/predaj-nehnutelnosti" className="mt-8 w-full sm:w-auto">
            Preskúmať možnosti predaja
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/* ---------- Agents ---------- */

function Agents() {
  return (
    <section aria-labelledby="agents-title" className="container-site section-y">
      <div className="rounded-[28px] bg-surface px-6 py-12 sm:rounded-hero sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 [&>*]:min-w-0">
          <div>
            <HomeHeading
              id="agents-title"
              eyebrow="Pre maklérov"
              lead="Pre maklérov a realitné kancelárie, ktorí chcú klientom ponúknuť zrozumiteľný orientačný odhad a lepší začiatok spolupráce."
            >
              Pomáhame aj <Soft>realitným profesionálom.</Soft>
            </HomeHeading>
            <ul data-reveal className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                "Odhady s vlastnou značkou",
                "Príprava na stretnutie",
                "Štruktúrované údaje",
                "Individuálna spolupráca",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                  <Check aria-hidden className="size-4 text-sage" strokeWidth={2.6} />
                  {t}
                </li>
              ))}
            </ul>
            <div data-reveal>
              <ButtonLink to="/pre-maklerov" variant="outline" className="mt-10">
                Zistiť možnosti spolupráce
              </ButtonLink>
            </div>
          </div>
          <div data-reveal>
            <AgentBoard />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="container-site section-y">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <HomeHeading id="faq-title" eyebrow="Časté otázky">
            Máte otázky? <Soft>Máme odpovede.</Soft>
          </HomeHeading>
          <p data-reveal className="mt-6 text-muted">
            Nenašli ste odpoveď?{" "}
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-1 font-bold text-brand underline-offset-4 hover:underline"
            >
              Napíšte nám <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </p>
        </div>
        <div data-reveal>
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  )
}

/* ---------- Closing CTA ---------- */

function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="container-site pb-16 sm:pb-20 lg:pb-24">
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
            id="cta-title"
            className="mx-auto max-w-3xl text-[clamp(1.9rem,1.35rem+2vw,3rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance-safe"
          >
            Vaša nehnuteľnosť má hodnotu. <span className="text-lime">Spoznajte ju.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lead text-white/75">
            Začnite orientačným odhadom a získajte lepší prehľad o svojich možnostiach.
          </p>
          <div className="mt-10">
            <AddressSearch id="cta-address" tone="dark" />
          </div>
          <p className="mt-6 text-sm text-white/65">
            Nezáväzne a bez registrácie ·{" "}
            <Link to="" className="font-bold text-white underline-offset-4 hover:underline">
              Zistiť odhad zdarma
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------- Shared exports kept for other pages (404, O nás) ---------- */

export function AddressForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
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
    navigate(`/odhad-ceny?adresa=${encodeURIComponent(v)}`)
  }
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[560px]">
      <label htmlFor="hero-address" className="sr-only">
        Adresa nehnuteľnosti
      </label>
      <div
        className={cx(
          "flex items-center gap-2 rounded-full p-1.5 pl-5 transition-shadow focus-within:shadow-[0_0_0_4px_rgb(156_227_125/0.45)]",
          tone === "dark"
            ? "bg-white shadow-[0_20px_50px_-20px_rgba(20,10,30,0.6)]"
            : "border border-line bg-white",
        )}
      >
        <MapPin
          aria-hidden
          className="size-5 shrink-0 text-brand"
          strokeWidth={2}
        />
        <input
          id="hero-address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            if (error) setError("")
          }}
          placeholder="Zadajte adresu nehnuteľnosti"
          autoComplete="street-address"
          aria-invalid={!!error}
          aria-describedby={error ? "hero-address-error" : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent text-[0.98rem] font-medium text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-deep sm:px-5"
        >
          <Search aria-hidden className="size-4" strokeWidth={2.4} />
          <span className="hidden sm:inline">Odhadnúť</span>
        </button>
      </div>
      {error && (
        <p
          id="hero-address-error"
          role="alert"
          className={cx(
            "mt-2.5 pl-5 text-sm font-semibold",
            tone === "dark" ? "text-lime" : "text-danger",
          )}
        >
          {error}
        </p>
      )}
    </form>
  )
}

export const steps = [
  {
    t: "Zadáte nehnuteľnosť",
    d: "Uvediete adresu, typ nehnuteľnosti a niekoľko základných parametrov. Zaberie to len pár minút.",
  },
  {
    t: "Získate orientačný odhad",
    d: "Zobrazíme cenové rozpätie, ktoré vám pomôže zorientovať sa v tom, akú hodnotu môže mať vaša nehnuteľnosť.",
  },
  {
    t: "Spoznáte svoje možnosti",
    d: "Porovnáte klasický predaj, rýchly výkup alebo ponechanie nehnuteľnosti – podľa toho, čo dáva zmysel vám.",
  },
  {
    t: "Vyberiete ďalší krok",
    d: "Rozhodnutie je na vás. Ak budete chcieť, pomôžeme s predajom alebo pripravíme individuálnu ponuku.",
  },
]

export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="container-site pb-16 sm:pb-20 lg:pb-24"
    >
      <div className="on-dark bg-hero relative overflow-hidden rounded-[28px] text-white sm:rounded-hero">
        <div aria-hidden className="bg-grid-fine absolute inset-0" />
        <div
          aria-hidden
          className="absolute -bottom-20 left-[35%] h-60 w-[50%] opacity-25"
        >
          <MiniMap markers={false} className="opacity-40 mix-blend-overlay" />
        </div>
        <div className="relative grid items-center gap-10 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-20">
          <div>
            <h2
              id="cta-title"
              className="text-title font-extrabold text-balance-safe"
            >
              Vaša nehnuteľnosť má hodnotu.{" "}
              <span className="text-lime">Spoznajte ju.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lead text-white/80">
              Začnite orientačným odhadom a získajte lepší prehľad o svojich
              možnostiach.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink to="" size="lg">
                Zistiť odhad zdarma
              </ButtonLink>
              <span className="text-sm font-semibold text-white/70">
                Nezáväzne · Bez registrácie
              </span>
            </div>
          </div>
          <CtaVisual />
        </div>
      </div>
    </section>
  )
}
