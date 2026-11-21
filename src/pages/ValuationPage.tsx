import { useCallback, useLayoutEffect, useRef, useState, type FormEvent } from "react"
import gsap from "gsap"
import { ArrowLeft, ArrowRight, Check, CheckCheck } from "lucide-react"
import { Link, useRouter } from "@/lib/router"
import {
  initialDraft,
  type Address,
  type Flat,
  type House,
} from "@/components/calculator/model"
import {
  AddressStep,
  type AddressMode,
} from "@/components/calculator/AddressStep"
import {
  BasicStep,
  ConstructionStep,
  FeaturesStep,
  SellingStep,
  TypeStep,
} from "@/components/calculator/PropertySteps"
import {
  EmailStep,
  ReviewStep,
  steps,
} from "@/components/calculator/ReviewEmail"
import "@/components/calculator/calculator.css"

const titles = [
  ["Kde sa nachádza", "vaša nehnuteľnosť?"],
  ["Akú nehnuteľnosť", "chcete oceniť?"],
  ["Aké sú jej", "základné rozmery?"],
  ["Čo patrí", "k nehnuteľnosti?"],
  ["Povedzte nám viac", "o stavbe."],
  ["Plánujete svoju", "nehnuteľnosť predať?"],
  ["Skontrolujte údaje", "o svojej nehnuteľnosti."],
  ["Váš odhad je", "o krok bližšie."],
]
const leads = [
  "Vyhľadajte adresu na Slovensku alebo ju zadajte ručne.",
  "Podľa typu nehnuteľnosti vám zobrazíme príslušné otázky.",
  "",
  "Uveďte vybavenie, ktoré poznáte. Ostatné údaje môžete vynechať.",
  "Vyberte materiál stavby a uveďte rok dokončenia, ak ho poznáte.",
  "Pomôže nám to lepšie prispôsobiť ďalší postup vašim potrebám.",
  "Pred posledným krokom si údaje prejdite. Každú časť môžete upraviť.",
  "Vyplnili ste všetky potrebné údaje. Zadajte svoj e-mail, na ktorý vám budeme môcť zaslať orientačný odhad hodnoty vašej nehnuteľnosti.",
]

function CalculatorProgress({ step, done }: { step: number; done: boolean }) {
  return (
    <aside className="calc-rail" aria-label="Priebeh odhadu">
      <div className="calc-progress-head">
        <strong>Priebeh odhadu</strong>
        <span>{step + 1} z 8</span>
      </div>
      <progress
        max={8}
        value={step + 1}
        aria-label={"Krok " + (step + 1) + " z 8"}
      />
      <p className="calc-mobile-step">{steps[step]}</p>
      <ol>
        {steps.map((label, i) => (
          <li
            key={label}
            data-past={i < step || done}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i < step || done ? <Check size={15} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="calc-rail-photo" aria-hidden="true" />
    </aside>
  )
}

export default function ValuationPage() {
  const { addressPrefill, search } = useRouter()
  const [data, setData] = useState(() =>
    initialDraft(
      addressPrefill ?? new URLSearchParams(search).get("adresa") ?? "",
    ),
  )
  const [step, setStep] = useState(0),
    [mode, setMode] = useState<AddressMode>("search"),
    [editing, setEditing] = useState(false),
    [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const changeAddress = useCallback((address: Address) => {
    setData(draft => ({ ...draft, address }))
  }, [])
  const reviewDraft = useRef<typeof data | null>(null)
  const panel = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    invalid = useRef<HTMLElement | null>(null)
  const visited = useRef(false)
  useLayoutEffect(() => {
    if (visited.current) {
      heading.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    visited.current = true
    const motion = gsap.matchMedia()
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(panel.current, { y: 8, opacity: 0.72 }, {
        y: 0,
        opacity: 1,
        duration: 0.24,
        ease: "power2.out",
        clearProps: "transform,opacity",
      })
    })
    return () => motion.revert()
  }, [step, done])
  function clearError() {
    invalid.current?.removeAttribute("aria-invalid")
    invalid.current?.removeAttribute("aria-describedby")
    invalid.current = null
    setError("")
  }
  function move(i: number) {
    clearError()
    setStep(i)
  }
  function setFlat(p: Partial<Flat>) {
    setData((d) => ({ ...d, flat: { ...d.flat, ...p } }))
  }
  function setHouse(p: Partial<House>) {
    setData((d) => ({ ...d, house: { ...d.house, ...p } }))
  }
  const props = { data, setFlat, setHouse }
  const switchedType = editing && step === 1 && data.type !== reviewDraft.current?.type
  const addressBlocked = step === 0 && mode !== "search" && !data.address.verified
  let nextLabel = "Pokračovať"
  if (step === 0) nextLabel = mode === "search" ? "Doplniť adresu" : "Potvrdiť adresu"
  if (editing && !switchedType && !(step === 0 && mode === "search")) nextLabel = "Uložiť a späť na kontrolu"
  if (step === 7) nextLabel = "Získať odhad e-mailom"
  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    clearError()
    if (step === 0 && mode === "search") {
      setMode("manual")
      return
    }
    if (addressBlocked) {
      setError("Pred pokračovaním vyberte alebo overte presnú adresu domu.")
      return
    }
    const field = Array.from(e.currentTarget.elements).find(
      (el): el is HTMLInputElement | HTMLSelectElement => {
        if (
          !(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)
        )
          return false
        return (
          !el.validity.valid ||
          (el instanceof HTMLInputElement &&
            el.type === "number" &&
            el.valueAsNumber <= 0)
        )
      },
    )
    if (field) {
      let message = "Vyplňte označené pole."
      if (field.type === "radio" || field instanceof HTMLSelectElement)
        message = "Vyberte jednu z možností."
      else if (field.type === "email")
        message = "Zadajte platnú e-mailovú adresu."
      else if (field.type === "number")
        message = field.validity.rangeOverflow
          ? "Rok výstavby nemôže byť v budúcnosti."
          : field.step === "1"
            ? "Zadajte kladné celé číslo."
            : "Zadajte plochu väčšiu ako nula."
      else if (field.pattern && field.inputMode === "numeric")
        message = "Zadajte päťmiestne PSČ."
      setError(message)
      invalid.current = field
      field.setAttribute("aria-invalid", "true")
      field.setAttribute("aria-describedby", "calc-error")
      field.focus()
      return
    }
    if (step === 0) setMode("selected")
    if (step === 7) {
      setDone(true)
      return
    }
    if (editing) {
      reviewDraft.current = null
      setEditing(false)
      move(switchedType ? 2 : 6)
    } else move(step + 1)
  }
  function back() {
    if (editing && reviewDraft.current) {
      setData(reviewDraft.current)
      reviewDraft.current = null
      setMode("selected")
      setEditing(false)
      move(6)
      return
    }
    if (step === 0 && mode !== "search") {
      setData(d => ({ ...d, address: { street: d.address.street, municipality: "", postcode: "", district: null } }))
      setMode("search")
      clearError()
      return
    }
    move(Math.max(0, step - 1))
  }
  return (
    <div className="calc-wrap">
      <CalculatorProgress step={step} done={done} />
      <div className="calc-panel" ref={panel}>
        {done ? (
          <>
            <CheckCheck className="calc-complete-icon" size={42} />
            <h1 ref={heading} tabIndex={-1}>
              Ukážka je <em>dokončená.</em>
            </h1>
            <p className="calc-lead">
              Prešli ste všetkými ôsmimi krokmi. Odosielanie žiadostí zatiaľ nie
              je pripojené. Odhad sa nevypočítal a e-mail sa neodoslal.
            </p>
            <Link className="calc-primary" to="/">
              Späť na úvod <ArrowRight size={18} />
            </Link>
          </>
        ) : (
          <>
            <h1 ref={heading} tabIndex={-1}>
              {titles[step][0]} <em>{titles[step][1]}</em>
            </h1>
            <p className="calc-lead">
              {step === 2
                ? data.type === "flat"
                  ? "Zadajte úžitkovú plochu bytu. Počet izieb môžete doplniť, ak ho poznáte."
                  : "Zadajte úžitkovú plochu domu a celkovú výmeru pozemku."
                : leads[step]}
            </p>
            <form key={step} noValidate onSubmit={next} onChange={clearError}>
              {step === 0 && (
                <AddressStep
                  address={data.address}
                  mode={mode}
                  setMode={(m) => {
                    clearError()
                    setMode(m)
                  }}
                  change={changeAddress}
                />
              )}
              {step === 1 && (
                <TypeStep
                  value={data.type}
                  change={(v) => setData((d) => ({ ...d, type: v }))}
                />
              )}
              {step === 2 && <BasicStep {...props} />}
              {step === 3 && <FeaturesStep {...props} />}
              {step === 4 && <ConstructionStep {...props} />}
              {step === 5 && (
                <SellingStep
                  value={data.sale_intent}
                  change={(v) => setData((d) => ({ ...d, sale_intent: v }))}
                />
              )}
              {step === 6 && (
                <ReviewStep
                  data={data}
                  edit={(i) => {
                    reviewDraft.current = data
                    setEditing(true)
                    move(i)
                  }}
                />
              )}
              {step === 7 && (
                <EmailStep
                  email={data.contact.email}
                  change={(email) =>
                    setData((d) => ({ ...d, contact: { email } }))
                  }
                />
              )}
              {error && (
                <p className="calc-error" role="alert" id="calc-error">
                  {error}
                </p>
              )}
              <div className="calc-actions">
                {(editing || step > 0 || mode !== "search") && (
                  <button type="button" className="calc-back" onClick={back}>
                    <ArrowLeft size={16} />
                    {editing ? "Zrušiť úpravu" : "Späť"}
                  </button>
                )}
                <button type="submit" className="calc-primary" disabled={addressBlocked}>
                  {nextLabel}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
