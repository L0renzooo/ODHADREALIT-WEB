import { lazy, Suspense, useState } from "react"
import {
  Building2,
  ChevronDown,
  MapPin,
  MoveHorizontal,
  Ruler,
} from "lucide-react"
import { formatEur } from "@/content"
import AnimatedContent from "./react-bits/AnimatedContent"

const CountUp = lazy(() => import("./react-bits/CountUp"))

// Published examples for the same 60 m² Bratislava flat, without balcony or parking.
// Each pair is the rounded output of the existing four-step prototype.
const examples = [
  { label: "Dobrý stav", low: 201000, high: 231000 },
  { label: "Na rekonštrukciu", low: 161000, high: 185000 },
  { label: "Novostavba", low: 231000, high: 266000 },
]

export function EstimateExample() {
  const [index, setIndex] = useState(0)
  const sample = examples[index]
  const scaleMin = examples[1].low
  const scaleWidth = examples[2].high - scaleMin
  return (
    <section
      id="prehlad-trhu"
      className="home-example"
      aria-labelledby="example-title"
    >
      <AnimatedContent
        once={false}
        distance={28}
        initialOpacity={0.68}
        duration={0.7}
        threshold={0.12}
      >
        <div className="home-example-sheet">
          <div className="home-sheet-heading">
            <h2 id="example-title">Ukážka odhadu</h2>
            <Building2 aria-hidden="true" size={26} strokeWidth={1.5} />
          </div>
          <p className="home-property">
            <MapPin size={16} /> Bratislava <span>·</span> 2-izbový byt
          </p>
          <p className="home-range-label">Orientačné cenové rozpätie</p>
          <p className="home-range" aria-hidden="true">
            <Suspense
              fallback={`${sample.low.toLocaleString("sk-SK")} – ${formatEur(sample.high)}`}
            >
              <CountUp
                from={examples[0].low}
                to={sample.low}
                separator=" "
                duration={0.55}
              />{" "}
              –{" "}
              <CountUp
                from={examples[0].high}
                to={sample.high}
                separator=" "
                duration={0.55}
              />{" "}
              €
            </Suspense>
          </p>
          <span className="sr-only" role="status">
            Orientačný odhad pre stav „{sample.label}“ je od{" "}
            {formatEur(sample.low)} do {formatEur(sample.high)}.
          </span>
          <div className="home-range-rule" aria-hidden="true">
            <MoveHorizontal
              size={20}
              style={{
                left: `${(100 * (sample.low - scaleMin)) / scaleWidth}%`,
                width: `${(100 * (sample.high - sample.low)) / scaleWidth}%`,
              }}
            />
          </div>
          <dl>
            <div>
              <dt>
                <Ruler size={16} /> Úžitková plocha
              </dt>
              <dd>60 m²</dd>
            </div>
          </dl>
          <div className="home-condition">
            <label htmlFor="sample-condition">Vyskúšajte iný stav</label>
            <span>
              <select
                id="sample-condition"
                value={index}
                onChange={(e) => setIndex(Number(e.target.value))}
              >
                {examples.map((example, i) => (
                  <option key={example.label} value={i}>
                    {example.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </span>
          </div>
        </div>
        <p className="home-model-note">
          Ilustračný výpočet bez údajov o aktuálnych transakciách. Odhad
          nenahrádza znalecký posudok.
        </p>
      </AnimatedContent>
    </section>
  )
}
