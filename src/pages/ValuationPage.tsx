import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Scale,
  Signpost,
  SlidersHorizontal,
  Building,
  Check,
  Hammer,
  Home,
  Info,
  KeyRound,
  Pencil,
  RotateCcw,
  Sparkle,
  Sparkles,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { formatEur } from "@/content"
import {
  Button,
  ButtonLink,
  ChoiceGroup,
  cx,
  DemoBadge,
  InputField,
  SelectField,
} from "@/components/ui"
import { Link } from "@/lib/router"
import { InfoItem, PageIntro, SectionHeading, Soft, usePageMotion } from "@/components/site"
import { PriceChart } from "@/components/visuals"

type Data = {
  address: string
  city: string
  postcode: string
  type: "" | "byt" | "dom"
  condition: "" | "novostavba" | "dobry" | "rekonstrukcia"
  area: string
  rooms: string
  floor: string
  year: string
  balcony: boolean
  parking: boolean
  consent: boolean
}

type Errors = Partial<Record<keyof Data, string>>

const empty: Data = {
  address: "",
  city: "",
  postcode: "",
  type: "",
  condition: "",
  area: "",
  rooms: "",
  floor: "",
  year: "",
  balcony: false,
  parking: false,
  consent: false,
}

const stepLabels = [
  { t: "Lokalita", d: "Kde sa nehnuteľnosť nachádza" },
  { t: "Typ a stav", d: "Byt alebo dom, celkový stav" },
  { t: "Parametre", d: "Plocha, izby a vybavenie" },
  { t: "Súhrn", d: "Kontrola údajov" },
]

const conditionLabel = {
  novostavba: "Novostavba",
  dobry: "Dobrý stav",
  rekonstrukcia: "Na rekonštrukciu",
}

function validate(step: number, d: Data): Errors {
  const e: Errors = {}
  const num = (v: string) => Number(v.replace(",", "."))
  if (step === 0) {
    if (d.address.trim().length < 3)
      e.address = "Zadajte ulicu a číslo, prípadne názov lokality."
    if (d.city.trim().length < 2) e.city = "Zadajte obec alebo mesto."
    if (!/^\d{3}\s?\d{2}$/.test(d.postcode.trim()))
      e.postcode = "PSČ má mať 5 číslic, napríklad 821 08."
  }
  if (step === 1) {
    if (!d.type) e.type = "Vyberte typ nehnuteľnosti."
    if (!d.condition) e.condition = "Vyberte stav nehnuteľnosti."
  }
  if (step === 2) {
    const a = num(d.area)
    if (!d.area || Number.isNaN(a) || a < 15 || a > 1000)
      e.area = "Zadajte plochu od 15 do 1 000 m²."
    const r = num(d.rooms)
    if (!d.rooms || !Number.isInteger(r) || r < 1 || r > 10)
      e.rooms = "Zadajte počet izieb od 1 do 10."
    if (d.type === "byt") {
      const f = num(d.floor)
      if (d.floor === "" || !Number.isInteger(f) || f < 0 || f > 40)
        e.floor = "Zadajte poschodie od 0 (prízemie) do 40."
    }
    if (d.year) {
      const y = num(d.year)
      if (!Number.isInteger(y) || y < 1800 || y > new Date().getFullYear() + 3)
        e.year = "Zadajte platný rok, napríklad 1998."
    }
  }
  if (step === 3 && !d.consent)
    e.consent =
      "Pre zobrazenie výsledku potvrďte, že ide o orientačný demo výpočet."
  return e
}

/** Transparent demo formula — not a real valuation model. */
function demoEstimate(d: Data) {
  const c = d.city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  let base = 1600
  let tier = "ostatné obce"
  if (c.includes("bratislav")) {
    base = 3600
    tier = "hlavné mesto"
  } else if (c.includes("kosic")) {
    base = 2500
    tier = "krajské mesto"
  } else if (
    ["zilin", "trnav", "nitr", "bansk", "presov", "trencin"].some((k) =>
      c.includes(k),
    )
  ) {
    base = 2100
    tier = "krajské mesto"
  }
  const factors = [
    { label: `Lokalita (${tier})`, value: `${formatEur(base)}/m²` },
    {
      label: "Typ nehnuteľnosti",
      value: d.type === "dom" ? "× 0,90" : "× 1,00",
      m: d.type === "dom" ? 0.9 : 1,
    },
    {
      label: "Stav",
      value:
        d.condition === "novostavba"
          ? "× 1,15"
          : d.condition === "rekonstrukcia"
            ? "× 0,80"
            : "× 1,00",
      m:
        d.condition === "novostavba"
          ? 1.15
          : d.condition === "rekonstrukcia"
            ? 0.8
            : 1,
    },
    {
      label: "Balkón / terasa",
      value: d.balcony ? "× 1,03" : "—",
      m: d.balcony ? 1.03 : 1,
    },
    {
      label: "Parkovanie",
      value: d.parking ? "× 1,04" : "—",
      m: d.parking ? 1.04 : 1,
    },
  ]
  const area = Number(d.area.replace(",", "."))
  const mult = factors.reduce((acc, f) => acc * (f.m ?? 1), 1)
  const mid = area * base * mult
  const round = (n: number) => Math.round(n / 1000) * 1000
  return {
    low: round(mid * 0.93),
    mid: round(mid),
    high: round(mid * 1.07),
    perM2: Math.round(mid / area),
    factors,
  }
}

export default function ValuationPage() {
  const { search } = useRouter()
  const prefill = useMemo(
    () => new URLSearchParams(search).get("adresa") ?? "",
    [search],
  )
  const [data, setData] = useState<Data>({ ...empty, address: prefill })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (prefill) setData((d) => ({ ...d, address: prefill }))
  }, [prefill])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step, done])

  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(step, data)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      requestAnimationFrame(() => {
        const el =
          document.getElementById(`val-${first}`) ??
          document.querySelector<HTMLElement>(`[name="val-${first}"]`)
        el?.focus()
      })
      return
    }
    if (step < 3) setStep(step + 1)
    else setDone(true)
  }

  const reset = () => {
    setData(empty)
    setErrors({})
    setStep(0)
    setDone(false)
  }

  const result = done ? demoEstimate(data) : null
  const rootRef = useRef<HTMLDivElement>(null)
  usePageMotion(rootRef)

  return (
    <div ref={rootRef} className="[&>section+section]:pt-0">
      <PageIntro
        eyebrow="Odhad ceny · ukážka"
        align="center"
        title={
          <>
            Orientačný odhad ceny <span className="text-sage">v štyroch krokoch.</span>
          </>
        }
        lead="Vyplňte základné údaje o byte alebo dome. Výsledok v tejto ukážke vypočítame jednoduchým, transparentným vzorcom priamo vo vašom prehliadači."
      />

      <section aria-label="Formulár odhadu" className="container-site pb-12 sm:pb-16 lg:pb-24">
        <div className="-mt-4 grid gap-6 lg:-mt-8 lg:grid-cols-[1fr_340px] lg:gap-8 [&>*]:min-w-0">
          <div className="rounded-card border border-line bg-white p-6 shadow-lift sm:p-10">
            {/* Progress */}
            <ol className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Priebeh odhadu">
              {stepLabels.map((s, i) => {
                const state = done || i < step ? "done" : i === step ? "current" : "todo"
                return (
                  <li key={s.t} aria-current={state === "current" ? "step" : undefined}>
                    <span
                      aria-hidden
                      className={cx(
                        "block h-1 rounded-full transition-colors duration-500",
                        state === "todo" ? "bg-line" : state === "current" ? "bg-brand" : "bg-sage",
                      )}
                    />
                    <span
                      className={cx(
                        "mt-3 flex items-center gap-1.5 text-xs font-bold sm:text-[0.8rem]",
                        state === "todo" ? "text-muted/80" : "text-ink",
                      )}
                    >
                      {state === "done" ? (
                        <Check aria-hidden className="size-3.5 text-sage" strokeWidth={3} />
                      ) : (
                        <span className="text-olive">0{i + 1}</span>
                      )}
                      <span className="max-sm:sr-only">{s.t}</span>
                      <span className="sr-only">
                        {state === "done" ? " – hotové" : state === "current" ? " – aktuálny krok" : ""}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>

            {!done ? (
              <form onSubmit={next} noValidate className="mt-10">
                <p className="text-sm font-semibold text-olive">
                  Krok {step + 1} z {stepLabels.length} · {stepLabels[step].d}
                </p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-2 text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] font-extrabold tracking-[-0.02em] text-ink outline-none"
                >
                  {
                    [
                      "Kde sa nehnuteľnosť nachádza?",
                      "O aký typ nehnuteľnosti ide?",
                      "Základné parametre",
                      "Skontrolujte svoje údaje",
                    ][step]
                  }
                </h2>

                {Object.keys(errors).filter((k) => errors[k as keyof Data]).length > 0 && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
                  >
                    Skontrolujte, prosím, označené polia.
                  </p>
                )}

                <div key={step} className="animate-rise mt-8">
                  {step === 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <InputField
                          id="val-address"
                          label="Ulica a číslo"
                          placeholder="Napríklad Hlavná 12"
                          autoComplete="address-line1"
                          value={data.address}
                          error={errors.address}
                          onChange={(e) => set("address", e.target.value)}
                        />
                      </div>
                      <InputField
                        id="val-city"
                        label="Obec / mesto"
                        placeholder="Napríklad Žilina"
                        autoComplete="address-level2"
                        value={data.city}
                        error={errors.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                      <InputField
                        id="val-postcode"
                        label="PSČ"
                        placeholder="010 01"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={data.postcode}
                        error={errors.postcode}
                        onChange={(e) => set("postcode", e.target.value)}
                      />
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col gap-8">
                      <ChoiceGroup
                        name="val-type"
                        legend="Typ nehnuteľnosti"
                        value={data.type}
                        error={errors.type}
                        onChange={(v) => set("type", v as Data["type"])}
                        options={[
                          {
                            value: "byt",
                            label: "Byt",
                            description: "Byt v bytovom dome",
                            icon: Building,
                          },
                          {
                            value: "dom",
                            label: "Rodinný dom",
                            description: "Samostatný alebo radový dom",
                            icon: Home,
                          },
                        ]}
                      />
                      <ChoiceGroup
                        name="val-condition"
                        legend="Celkový stav"
                        columns={3}
                        value={data.condition}
                        error={errors.condition}
                        onChange={(v) =>
                          set("condition", v as Data["condition"])
                        }
                        options={[
                          {
                            value: "novostavba",
                            label: "Novostavba",
                            description: "Do 5 rokov",
                            icon: Sparkles,
                          },
                          {
                            value: "dobry",
                            label: "Dobrý stav",
                            description: "Bežne udržiavaný",
                            icon: KeyRound,
                          },
                          {
                            value: "rekonstrukcia",
                            label: "Na rekonštrukciu",
                            description: "Potrebuje investíciu",
                            icon: Hammer,
                          },
                        ]}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InputField
                        id="val-area"
                        label="Úžitková plocha (m²)"
                        inputMode="decimal"
                        placeholder="Napríklad 72"
                        value={data.area}
                        error={errors.area}
                        onChange={(e) => set("area", e.target.value)}
                      />
                      <SelectField
                        id="val-rooms"
                        label="Počet izieb"
                        placeholder="Vyberte"
                        value={data.rooms}
                        error={errors.rooms}
                        onChange={(e) => set("rooms", e.target.value)}
                        options={Array.from({ length: 10 }, (_, i) => ({
                          value: String(i + 1),
                          label:
                            i === 9
                              ? "10 a viac"
                              : `${i + 1} ${
                                  i === 0 ? "izba" : i < 4 ? "izby" : "izieb"
                                }`,
                        }))}
                      />
                      {data.type === "byt" && (
                        <InputField
                          id="val-floor"
                          label="Poschodie"
                          inputMode="numeric"
                          placeholder="0 = prízemie"
                          value={data.floor}
                          error={errors.floor}
                          onChange={(e) => set("floor", e.target.value)}
                        />
                      )}
                      <InputField
                        id="val-year"
                        label="Rok výstavby / kolaudácie"
                        optional
                        inputMode="numeric"
                        placeholder="Napríklad 2006"
                        value={data.year}
                        error={errors.year}
                        onChange={(e) => set("year", e.target.value)}
                      />
                      <fieldset className="sm:col-span-2">
                        <legend className="mb-3 text-sm font-bold text-ink">
                          Vybavenie
                        </legend>
                        <div className="flex flex-wrap gap-3">
                          {([
                            ["balcony", "Balkón, lodžia alebo terasa"],
                            ["parking", "Parkovanie alebo garáž"],
                          ] as const).map(([k, l]) => (
                            <label
                              key={k}
                              className={cx(
                                "flex cursor-pointer items-center gap-3 rounded-full border px-4 py-3 text-sm font-bold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                                data[k]
                                  ? "border-brand bg-brand-soft text-brand"
                                  : "border-line text-ink hover:border-brand/40",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={data[k]}
                                onChange={(e) => set(k, e.target.checked)}
                                className="sr-only"
                              />
                              <span
                                aria-hidden
                                className={cx(
                                  "inline-flex size-5 items-center justify-center rounded-md border-2",
                                  data[k]
                                    ? "border-brand bg-brand text-white"
                                    : "border-line",
                                )}
                              >
                                {data[k] && (
                                  <Check className="size-3" strokeWidth={3.5} />
                                )}
                              </span>
                              {l}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col gap-6">
                      <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                        {[
                          {
                            k: "Adresa",
                            v: `${data.address}, ${data.postcode} ${data.city}`,
                            s: 0,
                          },
                          {
                            k: "Typ",
                            v: data.type === "dom" ? "Rodinný dom" : "Byt",
                            s: 1,
                          },
                          {
                            k: "Stav",
                            v: data.condition
                              ? conditionLabel[data.condition]
                              : "",
                            s: 1,
                          },
                          {
                            k: "Parametre",
                            v: `${data.area} m² · ${data.rooms} ${
                              Number(data.rooms) === 1 ? "izba" : "izby"
                            }${
                              data.type === "byt"
                                ? ` · ${data.floor}. posch.`
                                : ""
                            }`,
                            s: 2,
                          },
                          {
                            k: "Rok výstavby",
                            v: data.year || "neuvedené",
                            s: 2,
                          },
                          {
                            k: "Vybavenie",
                            v:
                              [
                                data.balcony && "balkón/terasa",
                                data.parking && "parkovanie",
                              ]
                                .filter(Boolean)
                                .join(", ") || "neuvedené",
                            s: 2,
                          },
                        ].map((row) => (
                          <div
                            key={row.k}
                            className="flex items-start justify-between gap-4 bg-white p-4"
                          >
                            <div>
                              <dt className="text-xs font-bold tracking-wide text-muted uppercase">
                                {row.k}
                              </dt>
                              <dd className="mt-1 font-bold text-ink">
                                {row.v}
                              </dd>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStep(row.s)}
                              aria-label={`Upraviť: ${row.k}`}
                              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-soft"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </div>
                        ))}
                      </dl>
                      <label
                        className={cx(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                          errors.consent
                            ? "border-danger bg-danger-soft/50"
                            : "border-line bg-surface",
                        )}
                      >
                        <input
                          id="val-consent"
                          type="checkbox"
                          checked={data.consent}
                          onChange={(e) => set("consent", e.target.checked)}
                          aria-describedby={
                            errors.consent ? "val-consent-error" : undefined
                          }
                          className="mt-0.5 size-5 shrink-0 accent-brand"
                        />
                        <span className="text-sm leading-relaxed text-ink">
                          Beriem na vedomie, že ide o{" "}
                          <strong>ilustračný demo výpočet</strong>, ktorý nie je
                          znaleckým posudkom ani garantovanou trhovou cenou.
                        </span>
                      </label>
                      {errors.consent && (
                        <p
                          id="val-consent-error"
                          className="-mt-3 text-sm font-semibold text-danger"
                        >
                          {errors.consent}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                      <ArrowLeft aria-hidden className="size-4" /> Späť
                    </Button>
                  ) : (
                    <span className="text-sm text-muted">Zaberie to približne 2 minúty.</span>
                  )}
                  <Button type="submit" variant="brand" size="lg" arrow>
                    {step === 3 ? "Zobraziť orientačný odhad" : "Pokračovať"}
                  </Button>
                </div>
              </form>
            ) : (
              result && (
                <div className="animate-rise mt-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <DemoBadge label="Ilustračný výsledok" />
                    <Button variant="outline" size="sm" onClick={reset}>
                      <RotateCcw aria-hidden className="size-4" /> Začať odznova
                    </Button>
                  </div>
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-6 text-sm font-semibold text-olive outline-none"
                  >
                    Orientačné cenové rozpätie pre {data.type === "dom" ? "rodinný dom" : "byt"} ·{" "}
                    {data.address}, {data.city}
                  </h2>
                  <div className="on-dark bg-navy relative mt-4 overflow-hidden rounded-card p-7 text-white sm:p-10">
                    <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
                      <div>
                        <p className="text-sm font-semibold text-white/70">Stred rozpätia</p>
                        <p className="mt-1 text-[clamp(2.3rem,1.8rem+2.2vw,3.4rem)] leading-none font-extrabold tracking-[-0.03em]">
                          {formatEur(result.mid)}
                        </p>
                        <p className="mt-3 text-lg font-bold text-lime">
                          {formatEur(result.low)} – {formatEur(result.high)}
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                          približne {formatEur(result.perM2)} za m²
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                        <p className="mb-2 text-xs font-semibold text-white/65">
                          Ilustračný vývoj (nie reálne údaje)
                        </p>
                        <PriceChart dark showAxis={false} data={[30, 32, 31, 34, 36, 35, 39, 41, 43]} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
                    <div>
                      <h3 className="text-[1.05rem] font-extrabold tracking-tight text-ink">
                        Ako sme počítali
                      </h3>
                      <dl className="mt-3 divide-y divide-line border-y border-line text-sm">
                        {result.factors.map((f) => (
                          <div key={f.label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-muted">{f.label}</dt>
                            <dd className="font-bold text-ink">{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        Ukážkový vzorec s pevnými koeficientmi. Nepoužíva reálne transakcie ani
                        externé databázy.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] font-extrabold tracking-tight text-ink">
                        Čo môžete urobiť ďalej
                      </h3>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {[
                          { to: "/predaj-nehnutelnosti", t: "Zvážiť asistovaný predaj", d: "Prejdeme s vami postup predaja." },
                          { to: "/vykup-nehnutelnosti", t: "Požiadať o ponuku na výkup", d: "Rýchlejšia, nezáväzná alternatíva." },
                          { to: "/kontakt", t: "Prebrať výsledok s nami", d: "Pomôžeme s interpretáciou." },
                        ].map((n) => (
                          <li key={n.to}>
                            <Link
                              to={n.to}
                              className="group flex items-center justify-between gap-4 py-3.5"
                            >
                              <span>
                                <span className="block font-bold text-ink transition-colors group-hover:text-brand">
                                  {n.t}
                                </span>
                                <span className="text-sm text-muted">{n.d}</span>
                              </span>
                              <ArrowUpRight
                                aria-hidden
                                className="size-4 shrink-0 text-sage transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-8 rounded-2xl bg-surface p-4 text-sm leading-relaxed text-muted">
                    Výsledok je ilustračný a slúži len na ukážku fungovania rozhrania. Nejde o
                    znalecký posudok, odhad banky ani garantovanú predajnú cenu. Zadané údaje neboli
                    odoslané ani uložené.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Aside */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-card border border-line bg-white p-6 sm:p-7">
              <h2 className="text-[1.05rem] font-extrabold tracking-tight text-ink">
                Čo budete potrebovať
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-[0.95rem] text-muted">
                {["Adresu alebo lokalitu", "Typ a stav nehnuteľnosti", "Úžitkovú plochu a počet izieb", "Vybavenie (nepovinné)"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <Check aria-hidden className="size-4 shrink-0 text-sage" strokeWidth={2.6} />
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="rounded-card bg-surface p-6 sm:p-7">
              <Info aria-hidden className="size-5 text-sage" />
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Prototyp nie je napojený na oceňovací model ani databázu transakcií. Údaje sa nikam
                neodosielajú.
              </p>
              <Link
                to="/kontakt"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand underline-offset-4 hover:underline"
              >
                Potrebujete pomoc? <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="valuation-about" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="valuation-about" eyebrow="Ako čítať výsledok">
            Odhad je <Soft>prvý krok,</Soft> nie konečná cena.
          </SectionHeading>
          <ul className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Scale, t: "Rozpätie", d: "Výsledok uvádzame ako interval, nie jedno presné číslo." },
              { icon: SlidersHorizontal, t: "Faktory", d: "Vidíte, ktoré parametre výsledok ovplyvnili a ako." },
              { icon: Signpost, t: "Ďalší krok", d: "Pri predaji či výkupe je vhodné individuálne posúdenie." },
            ].map((f) => (
              <li key={f.t} data-reveal className="border-t border-line pt-6">
                <InfoItem icon={f.icon} title={f.t} text={f.d} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
