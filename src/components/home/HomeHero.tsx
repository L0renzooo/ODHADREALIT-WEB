import { useRef, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react"
import { useRouter } from "@/lib/router"
import house from "@/assets/home/house-1400.webp"
import houseSmall from "@/assets/home/house-720.webp"
import interior from "@/assets/home/interior-1400.webp"
import interiorSmall from "@/assets/home/interior-720.webp"

const frames = [
  {
    image: house,
    small: houseSmall,
    label: "Rodinný dom",
    alt: "Biely rodinný dom so slnečnou záhradou a veľkou borovicou.",
  },
  {
    image: interior,
    small: interiorSmall,
    label: "Mestský byt",
    alt: "Svetlá obývacia izba s výhľadom z mestského bytu.",
  },
]

function AddressEntry() {
  const { navigate } = useRouter()
  const field = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  function submit(event: FormEvent) {
    event.preventDefault()
    const address = field.current?.value.trim() ?? ""
    if (address.length < 3) {
      setError(true)
      field.current?.focus()
      return
    }
    navigate(`/odhad-ceny?adresa=${encodeURIComponent(address)}`)
  }
  return (
    <form onSubmit={submit} className="home-entry" noValidate>
      <label htmlFor="home-address" className="sr-only">
        Adresa nehnuteľnosti
      </label>
      <div className="home-input-group">
        <MapPin aria-hidden="true" size={21} />
        <input
          ref={field}
          id="home-address"
          autoComplete="street-address"
          placeholder="Zadajte ulicu alebo obec"
          onChange={() => setError(false)}
          aria-invalid={error}
          aria-describedby={error ? "home-address-error" : undefined}
        />
        <button type="submit">
          Zistiť odhad <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id="home-address-error" role="alert">
          Zadajte aspoň tri znaky z názvu ulice alebo obce.
        </p>
      )}
    </form>
  )
}

export function HomeHero() {
  const [index, setIndex] = useState(0)
  function advance(direction: number) {
    setIndex((current) => (current + direction + frames.length) % frames.length)
  }
  return (
    <section className="home-hero home-wide" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <h1 id="home-title">
          <span className="home-title-line">Koľko stojí</span>{" "}
          <em className="home-title-line">váš domov?</em>
        </h1>
        <p className="home-hero-lead">
          Získajte orientačný odhad trhovej hodnoty svojho bytu či domu. Začnite
          jeho adresou.
        </p>
        <AddressEntry />
        <ul className="home-assurances">
          <li>
            <Check /> Bezplatne
          </li>
          <li>
            <Check /> Bez registrácie
          </li>
        </ul>
      </div>
      <div className="home-gallery">
        <figure
          className="home-gallery-window"
          aria-label="Fotogaléria nehnuteľností"
        >
          {frames.map((frame, i) => (
            <img
              key={frame.label}
              src={frame.image}
              srcSet={`${frame.small} 720w, ${frame.image} 1400w`}
              sizes="(max-width: 760px) 100vw, 52vw"
              alt={frame.alt}
              aria-hidden={index !== i}
              fetchPriority={i === 0 ? "high" : "low"}
              className={index === i ? "is-current" : ""}
            />
          ))}
          <figcaption className="home-gallery-bar">
            <span aria-live="polite" aria-atomic="true">
              <small>
                0{index + 1} / 0{frames.length}
              </small>
              {frames[index].label}
            </span>
            <span className="home-gallery-controls">
              <button
                aria-label="Predchádzajúca fotografia"
                onClick={() => advance(-1)}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                aria-label="Nasledujúca fotografia"
                onClick={() => advance(1)}
              >
                <ArrowRight size={18} />
              </button>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
