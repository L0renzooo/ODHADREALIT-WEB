import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  ArrowUpRight,
  Bookmark,
  Check,
  FileText,
  House,
  KeyRound,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  SlidersHorizontal,
} from "lucide-react"
import gsap from "gsap"
import { Link } from "@/lib/router"
import exterior from "@/assets/home/house-1400.webp"
import exteriorSmall from "@/assets/home/house-720.webp"
import interior from "@/assets/home/area-1400.webp"
import interiorSmall from "@/assets/home/area-720.webp"
import { animateStoryScene } from "./storyMotion"
import "./valuationStory.css"

const chapters = [
  {
    title: "Získajte orientačný odhad",
    description: "Zadajte adresu a pár základných údajov o nehnuteľnosti.",
    icon: MapPin,
    seconds: 7.8,
  },
  {
    title: "Ukážte nám svoju nehnuteľnosť",
    description:
      "Doplňte podrobnosti o nehnuteľnosti a pomôžte nám spresniť jej hodnotu.",
    icon: SlidersHorizontal,
    seconds: 6.8,
  },
  {
    title: "Získajte spresnený odhad",
    description:
      "Po doplnení informácií môžete získať presnejší pohľad na hodnotu svojej nehnuteľnosti.",
    icon: FileText,
    seconds: 6.4,
  },
  {
    title: "Vyberte si ďalší krok",
    description:
      "Máte lepší prehľad o hodnote nehnuteľnosti. Ďalšie rozhodnutie je na vás.",
    icon: MessageCircle,
    seconds: 7.2,
  },
]

const address = "Lipová 12, Modra"
const messages = [
  "Načítavame údaje o adrese",
  "Spracovávame informácie o nehnuteľnosti",
  "Vyhodnocujeme dostupné údaje",
  "Pripravujeme orientačný odhad",
]
const fields = [
  ["Typ", "Rodinný dom"],
  ["Úžitková plocha", "118 m²"],
  ["Stav", "Po rekonštrukcii"],
  ["Terasa", "Áno"],
]

function StoryArtwork({ active }: { active: number }) {
  return (
    <>
      <img
        className="story-photo"
        src={exteriorSmall}
        srcSet={exteriorSmall + " 720w, " + exterior + " 1400w"}
        sizes="(max-width: 800px) 94vw, 48vw"
        alt=""
        loading="lazy"
      />
      <img
        className="story-photo story-interior"
        data-visible={active === 1}
        src={interiorSmall}
        srcSet={interiorSmall + " 720w, " + interior + " 1400w"}
        sizes="(max-width: 800px) 94vw, 48vw"
        alt=""
        loading="lazy"
      />
      <div className="story-scene story-address" hidden={active !== 0}>
        <div className="story-address-box story-paper">
          <span className="story-pin">
            <MapPin />
          </span>
          <div>
            <small>Príklad adresy</small>
            <strong className="story-typed">
              <span className="sr-only">{address}</span>
              <span aria-hidden="true">
                {Array.from(address, (letter, i) => (
                  <b key={i}>{letter}</b>
                ))}
              </span>
            </strong>
          </div>
        </div>
        <div className="story-checklist story-paper">
          <ul>
            {messages.map((message) => (
              <li key={message}>
                <i>
                  <Check size={12} />
                </i>
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="story-scene story-details" hidden={active !== 1}>
        <div className="story-phone">
          <div className="story-speaker" aria-hidden="true" />
          <div className="story-phone-content">
            <strong>Moja nehnuteľnosť</strong>
            <img
              src={interiorSmall}
              alt="Ukážka interiéru domu"
              loading="lazy"
            />
            <dl>
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {value} <Check size={12} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="story-scene story-result" hidden={active !== 2}>
        <div className="story-document story-paper">
          <div className="story-letterhead">
            <House size={18} /> ODHADREALIT.SK
          </div>
          <strong className="story-doc-title">Odhad hodnoty domu</strong>
          <p className="story-summary">{address} · 118 m²</p>
          <div className="story-price">
            <small>Ilustračné cenové rozpätie</small>
            <strong>285 000 – 318 000 €</strong>
            <div className="story-range-line">
              <i />
            </div>
          </div>
          <p className="story-doc-note">
            <Check size={15} /> Orientačná hodnota v modelovom príklade
          </p>
        </div>
      </div>
      <div className="story-scene story-next" hidden={active !== 3}>
        <div className="story-note story-paper">
          <span className="story-bookmark">
            <Bookmark size={18} />
          </span>
          <div>
            <small>Pre váš prehľad</small>
            <strong>Odhad hodnoty domu</strong>
          </div>
        </div>
        <div className="story-options story-paper">
          <strong>Čo ďalej?</strong>
          <p>
            <MessageCircle size={18} /> Poradiť sa o odhade
          </p>
          <p>
            <KeyRound size={18} /> Zistiť viac o priamom výkupe
          </p>
        </div>
      </div>
    </>
  )
}

export function ValuationStory() {
  const root = useRef<HTMLElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const showStill = useRef(false)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [readingLink, setReadingLink] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12),
      { threshold: 0.12 },
    )
    observer.observe(root.current!)
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    const motionChanged = () => setReduced(preference.matches)
    const visibilityChanged = () => setTabVisible(!document.hidden)
    preference.addEventListener("change", motionChanged)
    document.addEventListener("visibilitychange", visibilityChanged)
    return () => {
      observer.disconnect()
      preference.removeEventListener("change", motionChanged)
      document.removeEventListener("visibilitychange", visibilityChanged)
    }
  }, [])

  // Changing steps replaces the scene clock. Visibility and pause changes only
  // stop or resume that clock, preserving both the artwork and the progress line.
  useLayoutEffect(() => {
    if (reduced) return
    const section = root.current!
    const scene = section.querySelector<HTMLElement>(
      ".story-scene:not([hidden])",
    )!
    const line = section.querySelector<HTMLElement>(
      ".story-step[data-active=true] .story-fill",
    )!
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => setActive((active + 1) % chapters.length),
      })
      timeline.current = tl
      animateStoryScene(tl, scene, active, chapters[active].seconds)
      tl.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: chapters[active].seconds },
        0,
      )
      if (showStill.current) {
        // Land on the completed artwork when browsing a paused demonstration.
        tl.seek(chapters[active].seconds - 1.5, true)
        showStill.current = false
      }
    }, section)
    return () => {
      context.revert()
      timeline.current = null
    }
  }, [active, reduced])

  useLayoutEffect(() => {
    timeline.current?.paused(
      !visible || !tabVisible || paused || hovering || readingLink,
    )
  }, [active, reduced, visible, tabVisible, paused, hovering, readingLink])

  function selectStep(index: number) {
    if (index === active) return
    showStill.current = paused
    setActive(index)
  }

  return (
    <section
      className="valuation-story home-content"
      id="ukazka-odhadu"
      aria-labelledby="valuation-story-title"
      ref={root}
    >
      <h2 id="valuation-story-title">
        Zistite hodnotu svojho domova <em>jednoducho.</em>
      </h2>
      <figure className="story-frame">
        <div
          className="story-stage"
          onPointerEnter={(event) =>
            setHovering(
              event.pointerType === "mouse" &&
                matchMedia("(hover: hover)").matches,
            )
          }
          onPointerLeave={() => setHovering(false)}
        >
          <StoryArtwork active={active} />
        </div>
        <figcaption>
          <span>
            <i aria-hidden="true" />
            Ilustračná ukážka
          </span>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Prehrať ukážku" : "Pozastaviť ukážku"}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          )}
        </figcaption>
      </figure>
      <ol className="story-steps">
        {chapters.map(({ title, description, icon: Icon }, i) => (
          <li className="story-step" key={title} data-active={i === active}>
            <button
              type="button"
              id={"story-step-" + i}
              aria-expanded={i === active}
              aria-controls={"story-copy-" + i}
              onClick={() => selectStep(i)}
            >
              <span className="story-step-icon">
                <Icon size={20} />
              </span>
              {title}
            </button>
            <div
              className="story-copy"
              id={"story-copy-" + i}
              aria-hidden={i !== active}
              inert={i !== active}
            >
              <div className="story-copy-clip">
                <div className="story-copy-body">
                  <p>{description}</p>
                  {i === 3 && (
                    <Link
                      className="home-text-link"
                      to="/kontakt"
                      onFocus={() => setReadingLink(true)}
                      onBlur={() => setReadingLink(false)}
                      onPointerEnter={(event) =>
                        setHovering(event.pointerType === "mouse")
                      }
                      onPointerLeave={() => setHovering(false)}
                    >
                      Kontaktujte nás <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="story-track" aria-hidden="true">
              <i className="story-fill" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
