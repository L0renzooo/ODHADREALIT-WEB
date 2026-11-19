import { lazy, Suspense, useState } from "react"
import { Pause, Play } from "lucide-react"
import interior from "@/assets/home/area-1400.webp"
import interiorSmall from "@/assets/home/area-720.webp"
import "./ownership.css"

const TrueFocus = lazy(() => import("./react-bits/TrueFocus"))
const phrases = ["Majte prehľad", "Zvážte možnosti", "Plánujte vopred"]

export function OwnershipSection() {
  const [paused, setPaused] = useState(false)
  const pauseLabel = paused
    ? "Spustiť zvýrazňovanie fráz"
    : "Pozastaviť zvýrazňovanie fráz"
  return (
    <section
      id="hodnota-majetku"
      aria-labelledby="owner-title"
      className="home-owner home-content"
    >
      <div className="home-owner-copy">
        <h2 id="owner-title">
          Poznajte hodnotu toho, <em>čo vlastníte.</em>
        </h2>
        <p>
          Aj keď svoj domov neplánujete predať, orientačný odhad vám pomôže pri
          rozhodnutiach o bývaní.
        </p>
      </div>
      <figure className="home-owner-visual">
        <div className="home-owner-window">
          <img
            src={interior}
            srcSet={`${interiorSmall} 720w, ${interior} 1400w`}
            sizes="(max-width: 800px) 94vw, 51vw"
            loading="lazy"
            width={1400}
            height={1050}
            alt="Slnečná obývacia izba s veľkými oknami a drevenou podlahou."
          />
        </div>
        <figcaption className="home-owner-caption">
          <span className="sr-only">{phrases.join(". ")}.</span>
          <div className="owner-focus" aria-hidden="true">
            <Suspense
              fallback={
                <div className="owner-focus-fallback">
                  {phrases.map((phrase) => (
                    <span key={phrase}>{phrase}</span>
                  ))}
                </div>
              }
            >
              <TrueFocus
                sentence={phrases.join("|")}
                separator="|"
                paused={paused}
                focusStyle="brackets"
                borderColor="var(--lime)"
                cornerSize={7}
                borderWidth={1.5}
                blurAmount={0.65}
                unfocusedOpacity={0.78}
                focusScale={1.025}
                animationDuration={0.48}
                pauseBetweenAnimations={1.85}
              />
            </Suspense>
          </div>
          <button
            type="button"
            className="owner-focus-control"
            aria-label={pauseLabel}
            title={pauseLabel}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? (
              <Play size={15} aria-hidden="true" />
            ) : (
              <Pause size={15} aria-hidden="true" />
            )}
          </button>
        </figcaption>
      </figure>
      <ul className="home-owner-ideas">
        <li>Doplňte si prehľad o hodnote rodinného majetku.</li>
        <li>Porovnajte rozpočet na obnovu s hodnotou domova.</li>
        <li>Urobte si predstavu o možnostiach ďalšieho bývania.</li>
      </ul>
    </section>
  )
}
