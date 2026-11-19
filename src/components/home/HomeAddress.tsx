import {
  createContext,
  useContext,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { ArrowRight, MapPin } from "lucide-react"
import { useRouter } from "@/lib/router"

type Entry = "hero" | "header"
type HomeAddressState = {
  address: string
  errorSource: Entry | null
  edit: (value: string) => void
  submit: (source: Entry) => boolean
  heroInput: RefObject<HTMLInputElement | null>
}

const AddressContext = createContext<HomeAddressState | null>(null)

export function HomeAddressProvider({ children }: { children: ReactNode }) {
  const { navigate } = useRouter()
  const heroInput = useRef<HTMLInputElement>(null)
  const [address, setAddress] = useState("")
  const [errorSource, setErrorSource] = useState<Entry | null>(null)
  function edit(value: string) {
    setAddress(value)
    setErrorSource(null)
  }
  function submit(source: Entry) {
    const value = address.trim()
    if (value.length < 3) {
      setErrorSource(source)
      return false
    }
    navigate("/odhad-ceny?adresa=" + encodeURIComponent(value))
    return true
  }
  return (
    <AddressContext.Provider
      value={{ address, edit, submit, errorSource, heroInput }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export function useHomeAddress() {
  const state = useContext(AddressContext)
  if (!state) throw new Error("Home address form requires HomeAddressProvider")
  return state
}

export function AddressEntry({
  headerInput,
}: {
  headerInput?: RefObject<HTMLInputElement | null>
}) {
  const { address, edit, submit, errorSource, heroInput } = useHomeAddress()

  const field = headerInput ?? heroInput
  const variant = headerInput ? "header" : "hero"
  const compact = variant === "header"
  const id = compact ? "home-header-address" : "home-address"
  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!submit(variant)) field.current?.focus()
  }
  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "home-entry home-entry-compact" : "home-entry"}
      noValidate
      aria-label={compact ? "Odhad z navigácie" : "Odhad podľa adresy"}
    >
      <label className="sr-only" htmlFor={id}>
        Adresa nehnuteľnosti
      </label>
      <div className="home-input-group">
        <MapPin size={compact ? 17 : 20} aria-hidden="true" />
        <input
          ref={field}
          id={id}
          autoComplete="street-address"
          value={address}
          onChange={(event) => edit(event.target.value)}
          placeholder={
            compact ? "Ulica alebo obec" : "Zadajte ulicu alebo obec"
          }
          aria-invalid={!!errorSource}
          aria-describedby={errorSource ? id + "-error" : undefined}
        />
        <button type="submit" aria-label="Zistiť odhad">
          <span>Zistiť odhad</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      {errorSource && (
        <p
          className="home-address-error"
          role={errorSource === variant ? "alert" : undefined}
          id={id + "-error"}
        >
          Zadajte aspoň tri znaky z názvu ulice alebo obce.
        </p>
      )}
    </form>
  )
}
