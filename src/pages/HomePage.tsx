import { useRef, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  UsersRound,
} from "lucide-react"
import { Link } from "@/lib/router"
import { Accordion } from "@/components/ui"
import { EstimateExample } from "@/components/home/EstimateExample"
import { HomeHero } from "@/components/home/HomeHero"
import { OwnershipSection } from "@/components/home/OwnershipSection"
import { ValuationStory } from "@/components/home/ValuationStory"
import { SalesAssistance } from "@/components/home/SalesAssistance"
import BorderGlow from "@/components/home/react-bits/BorderGlow"
import { useEditorialMotion } from "@/components/home/useEditorialMotion"
import { faqs } from "@/content"
import apartments from "@/assets/home/apartments-1100.webp"
import apartmentsSmall from "@/assets/home/apartments-720.webp"

function ServiceGlow({
  light,
  children,
}: {
  light?: boolean
  children: ReactNode
}) {
  return (
    <BorderGlow
      backgroundColor={light ? "#e8eedf" : "#315a44"}
      glowColor={light ? "132 42 44" : "84 91 76"}
      colors={["#d0f883", "#80ac69", "#315a44"]}
      borderRadius={16}
      glowRadius={12}
      glowIntensity={0.85}
      edgeSensitivity={40}
      coneSpread={17}
      fillOpacity={0.12}
    >
      {children}
    </BorderGlow>
  )
}

function Services() {
  return (
    <section
      id="sluzby"
      aria-labelledby="services-title"
      className="home-section home-content"
    >
      <div className="home-section-heading">
        <h2 id="services-title">Hodnota vašej nehnuteľnosti, vaše možnosti.</h2>
        <Link className="home-text-link" to="/#ako-to-funguje">
          Ako funguje odhad <ArrowDown size={16} />
        </Link>
      </div>
      <div className="home-services">
        <ServiceGlow>
          <Link to="/odhad-ceny" className="home-sale">
            <img
              className="home-image-reveal"
              src={apartments}
              srcSet={`${apartmentsSmall} 720w, ${apartments} 1100w`}
              sizes="(max-width: 760px) 100vw, 55vw"
              loading="lazy"
              alt=""
            />
            <div className="home-service-content">
              <h3>Odhad ceny nehnuteľnosti</h3>
              <p>
                Zistite orientačnú hodnotu svojej nehnuteľnosti jednoducho
                online.
              </p>
            </div>
            <span className="home-round-arrow">
              <ArrowUpRight />
            </span>
          </Link>
        </ServiceGlow>
        <ServiceGlow light>
          <Link to="/vykup-nehnutelnosti" className="home-buyout">
            <div className="home-key" aria-hidden="true">
              <KeyRound size={43} strokeWidth={1.25} />
            </div>
            <div className="home-service-content">
              <h3>Priamy výkup</h3>
              <p>
                Zvažujete predaj? Požiadajte o individuálnu ponuku na priamy
                výkup.
              </p>
            </div>
            <span className="home-round-arrow">
              <ArrowUpRight />
            </span>
          </Link>
        </ServiceGlow>
      </div>
      <Link className="home-broker" to="/pre-maklerov">
        <UsersRound size={24} strokeWidth={1.5} />
        <strong>Pre maklérov</strong>
        <span>
          Odhady pod vašou značkou a podklady na stretnutia s klientmi.
        </span>
        <ArrowRight size={20} />
      </Link>
    </section>
  )
}

const steps = [
  ["Zadajte adresu", "Uveďte ulicu, obec a PSČ svojho bytu alebo domu."],
  [
    "Doplňte informácie",
    "Vyberte typ a stav nehnuteľnosti. Doplňte plochu a počet izieb.",
  ],
  [
    "Získajte orientačný odhad",
    "Skontrolujte údaje a pozrite si odhadované cenové rozpätie.",
  ],
]

function ValuationGuide() {
  return (
    <section
      id="ako-to-funguje"
      className="home-wide"
      aria-labelledby="process-title"
    >
      <div className="home-guide">
        <div className="home-journey-heading">
          <h2 id="process-title">
            Ako funguje <em>odhad?</em>
          </h2>
          <Link to="/odhad-ceny" className="home-button dark-cta">
            Začať odhad <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-journey-body">
          <ol className="home-steps">
            {steps.map(([title, text], i) => (
              <li key={title}>
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="home-step-track">
                    <i />
                  </span>
                )}
                <span className="home-step-dot" aria-hidden="true" />
                <span className="home-step-number" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="home-step-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <EstimateExample />
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null)
  useEditorialMotion(root)
  return (
    <div ref={root}>
      <HomeHero />
      <Services />
      <ValuationStory />
      <div className="sales-stack">
        <ValuationGuide />
        <SalesAssistance />
      </div>
      <OwnershipSection />
      <section
        id="faq"
        className="home-faq home-section home-content"
        aria-labelledby="faq-title"
      >
        <div>
          <h2 id="faq-title">Časté otázky</h2>
          <p>Máte inú otázku?</p>
          <Link to="/kontakt" className="home-text-link">
            Napíšte nám <ArrowUpRight size={16} />
          </Link>
        </div>
        <Accordion items={faqs} />
      </section>
    </div>
  )
}
