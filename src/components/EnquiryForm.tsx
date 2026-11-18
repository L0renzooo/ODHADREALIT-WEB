import { useRef, useState, type FormEvent } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button, InputField, SelectField, TextareaField } from "@/components/ui"

type Values = {
  name: string
  email: string
  phone: string
  location: string
  topic: string
  message: string
}
type Errors = Partial<Record<keyof Values, string>>

export function EnquiryForm({
  id,
  title,
  submitLabel,
  topics,
  withLocation = false,
  messageLabel = "Správa",
  messagePlaceholder = "Opíšte, s čím vám môžeme pomôcť.",
}: {
  id: string
  title: string
  submitLabel: string
  topics?: string[]
  withLocation?: boolean
  messageLabel?: string
  messagePlaceholder?: string
}) {
  const [v, setV] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    location: "",
    topic: topics?.[0] ?? "",
    message: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  const set = (k: keyof Values, val: string) => {
    setV((s) => ({ ...s, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors = {}
    if (v.name.trim().length < 2) errs.name = "Zadajte svoje meno."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      errs.email = "Zadajte platnú e-mailovú adresu."
    if (v.phone && !/^[+\d][\d\s]{7,}$/.test(v.phone.trim()))
      errs.phone = "Zadajte telefón v tvare +421 900 000 000."
    if (withLocation && v.location.trim().length < 2)
      errs.location = "Zadajte lokalitu nehnuteľnosti."
    if (v.message.trim().length < 10)
      errs.message = "Napíšte aspoň krátku správu (min. 10 znakov)."
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    setSent(true)
    requestAnimationFrame(() => doneRef.current?.focus())
  }

  if (sent) {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="animate-rise rounded-card border border-line bg-white p-8 text-center shadow-card outline-none sm:p-12"
      >
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-lime-soft text-lime-ink">
          <CheckCircle2 aria-hidden className="size-8" strokeWidth={1.8} />
        </span>
        <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
          Ďakujeme, {v.name.split(" ")[0]}.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Takto bude vyzerať potvrdenie po odoslaní.{" "}
          <strong className="text-ink">
            V tomto prototype sa správa nikam neodoslala
          </strong>{" "}
          – formulár zatiaľ nie je napojený na e-mail ani CRM.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setSent(false)
            setV((s) => ({ ...s, message: "" }))
          }}
        >
          Vyplniť znova
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby={`${id}-title`}
      className="rounded-card border border-line bg-white p-6 shadow-card sm:p-10"
    >
      <h3
        id={`${id}-title`}
        className="text-2xl font-extrabold tracking-tight text-ink"
      >
        {title}
      </h3>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <InputField
          id={`${id}-name`}
          label="Meno a priezvisko"
          autoComplete="name"
          value={v.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <InputField
          id={`${id}-email`}
          label="E-mail"
          type="email"
          autoComplete="email"
          value={v.email}
          error={errors.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <InputField
          id={`${id}-phone`}
          label="Telefón"
          type="tel"
          optional
          autoComplete="tel"
          value={v.phone}
          error={errors.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        {withLocation ? (
          <InputField
            id={`${id}-location`}
            label="Lokalita nehnuteľnosti"
            placeholder="Obec, mestská časť"
            value={v.location}
            error={errors.location}
            onChange={(e) => set("location", e.target.value)}
          />
        ) : topics ? (
          <SelectField
            id={`${id}-topic`}
            label="Téma"
            value={v.topic}
            onChange={(e) => set("topic", e.target.value)}
            options={topics.map((t) => ({ value: t, label: t }))}
          />
        ) : null}
        {withLocation && topics && (
          <div className="sm:col-span-2">
            <SelectField
              id={`${id}-topic`}
              label="Typ nehnuteľnosti"
              value={v.topic}
              onChange={(e) => set("topic", e.target.value)}
              options={topics.map((t) => ({ value: t, label: t }))}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <TextareaField
            id={`${id}-message`}
            label={messageLabel}
            placeholder={messagePlaceholder}
            value={v.message}
            error={errors.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted">
          Odoslaním nevzniká žiadny záväzok. Spracovanie údajov popíšu zásady
          ochrany súkromia.
        </p>
        <Button type="submit" variant="brand" size="lg" arrow>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
