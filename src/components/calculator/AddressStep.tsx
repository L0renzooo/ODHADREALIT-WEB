import { Component, lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { Check, MapPin, Search } from "lucide-react"
import { addressDetail, addressTitle, districts, formatAddress, type Address } from "./model"
import { AddressVerificationError, busyMessage, errorMessage, searchable, searchAddresses, verificationIssue, verifyManualAddress } from "./addressSearch"

const PropertyLocationMap = lazy(() => import("./PropertyLocationMap"))
class MapFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <span role="status" className="calc-map-notice">Mapa je dočasne nedostupná.</span>
      : this.props.children
  }
}
export type AddressMode = "search" | "manual" | "selected"

function useSuggestions(query: string) {
  const [result, setResult] = useState<{ query: string; addresses: Address[]; message: string }>()
  useEffect(() => {
    if (!query) return
    let current = true
    const controller = new AbortController()
    let timeout: number
    const debounce = window.setTimeout(async () => {
      timeout = window.setTimeout(() => controller.abort(), 9000)
      try {
        const addresses = await searchAddresses(query, controller.signal)
        if (current) setResult({ query, addresses, message: addresses.length ? "" : "Pre tieto údaje sme nenašli overiteľnú adresu. Spresnite ulicu, číslo domu alebo obec." })
      } catch (error) {
        if (current) setResult({ query, addresses: [], message: error instanceof Error && error.message === busyMessage ? busyMessage : errorMessage })
      } finally {
        window.clearTimeout(timeout)
      }
    }, 450)
    return () => {
      current = false
      window.clearTimeout(debounce)
      window.clearTimeout(timeout)
      controller.abort()
      setResult(undefined)
    }
  }, [query])
  return query && result?.query === query ? result : undefined
}

function DistrictField({ address, change }: { address: Address; change: (district: number | null) => void }) {
  return (
    <div>
      <label htmlFor="calc-address-district">Okres</label>
      <select id="calc-address-district" required value={address.district ?? ""} onChange={e =>
        change(e.target.value === "" ? null : Number(e.target.value))}>
        <option value="">Vyberte okres</option>
        {districts.map((name, code) => <option key={name} value={code}>{name}</option>)}
      </select>
    </div>
  )
}

export function AddressStep({ address, mode, setMode, change }: {
  address: Address
  mode: AddressMode
  setMode: (mode: AddressMode) => void
  change: (address: Address) => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [selection, setSelection] = useState(0)
  const [failure, setFailure] = useState<{ draft: Address; message: string }>()
  const feedback = failure?.draft === address ? failure.message : ""
  const request = useRef<AbortController | null>(null)
  const list = useRef<HTMLUListElement>(null)
  const value = mode === "selected" ? formatAddress(address) : address.street
  const query = open && mode === "search" && searchable(value) ? value.trim().replace(/\s+/g, " ") : ""
  const results = useSuggestions(query)
  const matches = results?.addresses ?? []
  const expanded = !!query
  const manual = mode === "manual"
  const selected = mode === "selected"
  const optionId = (index: number) => "calc-address-option-" + index
  useEffect(() => {
    if (active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" })
  }, [active])

  function select(a: Address) {
    change(a)
    setOpen(false)
    setActive(-1)
    setSelection(n => n + 1)
    setMode("selected")
  }
  function manualEntry() {
    setOpen(false)
    setActive(-1)
    setMode("manual")
  }
  function edit(fields: Partial<Pick<Address, "street" | "municipality" | "postcode" | "district">>) {
    request.current?.abort()
    request.current = null
    const { street, municipality, postcode, district } = address
    change({ street, municipality, postcode, district, ...fields })
    setMode("manual")
  }
  const readyToCheck = manual && !address.verified && /\d/.test(address.street) && !!address.municipality.trim() &&
    /^\d{5}$/.test(address.postcode.replace(/\s/g, "")) && address.district !== null
  useEffect(() => {
    if (!readyToCheck) return
    const controller = new AbortController()
    request.current = controller
    let timeout: number
    const debounce = window.setTimeout(async () => {
      if (controller.signal.aborted) return
      timeout = window.setTimeout(() => controller.abort(), 9000)
      try {
        const result = await verifyManualAddress(address, controller.signal)
        if (request.current !== controller) return
        change(result)
        setSelection(n => n + 1)
      } catch (error) {
        if (request.current === controller) {
          setFailure({ draft: address, message: error instanceof AddressVerificationError ? error.message : errorMessage })
        }
      } finally {
        window.clearTimeout(timeout)
      }
    }, 550)
    return () => {
      window.clearTimeout(debounce)
      window.clearTimeout(timeout)
      controller.abort()
      if (request.current === controller) request.current = null
    }
  }, [address, change, readyToCheck])
  function editDistrict(district: number | null) { edit({ district }) }
  function keydown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return
    if (e.key === "Escape") {
      setOpen(false)
      setActive(-1)
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      setOpen(true)
      if (matches.length) setActive(index => e.key === "ArrowDown"
        ? (index + 1) % matches.length : (index <= 0 ? matches.length - 1 : index - 1))
    } else if (e.key === "Enter" && expanded) {
      e.preventDefault()
      if (matches[active]) select(matches[active])
      else if (matches.length) select(matches[0])
      else if (results) manualEntry()
    }
  }
  return (
    <>
      {!manual && (
        <div className="calc-address-search" onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setActive(-1) }
        }}>
          <label htmlFor="val-address">Ulica, číslo domu alebo obec</label>
          <div className="calc-search-input">
            <Search size={19} aria-hidden="true" />
            <input id="val-address" role="combobox" aria-autocomplete="list"
              aria-expanded={expanded} aria-controls={expanded ? "calc-address-list" : undefined}
              aria-activedescendant={expanded && matches[active] ? optionId(active) : undefined}
              autoComplete="off" placeholder="Napr. Lipová 12, Modra" value={value}
              onFocus={() => setOpen(true)} onKeyDown={keydown}
              onChange={e => {
                change({ street: e.target.value, municipality: "", postcode: "", district: null })
                setMode("search")
                setOpen(true)
                setActive(-1)
              }} />
          </div>
          {expanded && (
            <div className="calc-dropdown">
              <ul ref={list} role="listbox" id="calc-address-list" aria-label="Nájdené adresy" aria-busy={!results}>
                {matches.map((a, i) => (
                  <li key={optionId(i)} id={optionId(i)} role="option" aria-selected={i === active}
                    onMouseDown={e => e.preventDefault()} onClick={() => select(a)}>
                    <MapPin size={17} aria-hidden="true" />
                    <span><strong>{addressTitle(a)}</strong><small>{addressDetail(a)}</small></span>
                  </li>
                ))}
              </ul>
              <p role="status" className={matches.length ? "sr-only" : undefined}>
                {results ? results.message || "Počet nájdených adries: " + matches.length : "Vyhľadávame adresy…"}
              </p>
              <button type="button" className="calc-text" onClick={manualEntry}>Zadať adresu ručne</button>
            </div>
          )}
        </div>
      )}
      {selected && (
        <div className="calc-location-details">
          <p role="status" className={address.verified ? "calc-verified" : "calc-address-issue"}>
            {address.verified ? <><Check size={16} aria-hidden="true" /> Adresa overená</> : verificationIssue(address)}
          </p>
          <button type="button" className="calc-text" onClick={manualEntry}>Upraviť ručne</button>
        </div>
      )}
      {manual && (
        <div className="calc-fields">
          {([
            ["street", "Ulica a číslo"], ["municipality", "Obec alebo mesto"], ["postcode", "PSČ"],
          ] as const).map(([key, label]) => (
            <label key={key}>{label}
              <input id={key === "street" ? "val-address" : undefined} required
                pattern={key === "postcode" ? "[0-9]{3} ?[0-9]{2}" : ".*\\S.*"}
                inputMode={key === "postcode" ? "numeric" : "text"} value={address[key]}
                onChange={e => edit({ [key]: e.target.value })} />
            </label>
          ))}
          <DistrictField address={address} change={editDistrict} />
        </div>
      )}
      {manual && (
        <div className="calc-location-details">
          <p role="status" className={address.verified ? "calc-verified" : feedback ? "calc-address-issue" : undefined}>
            {address.verified ? <><Check size={16} aria-hidden="true" /> Adresa overená</> :
              feedback || (readyToCheck ? "Overujeme adresu…" : "Doplňte ulicu, číslo domu, obec, PSČ a okres.")}
          </p>
        </div>
      )}
      {selected && <DistrictField address={address} change={editDistrict} />}
      <div className="calc-map" role="region" aria-label="Mapa polohy nehnuteľnosti">
        <MapFallback>
          <Suspense fallback={<span className="calc-map-notice">Načítava sa mapa…</span>}>
            <PropertyLocationMap address={address} selection={selection} />
          </Suspense>
        </MapFallback>
      </div>
      <p className="calc-map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></p>
    </>
  )
}
