import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react"
import { AddressEntry } from "./HomeAddress"
import house from "@/assets/home/house-1400.webp"
import houseSmall from "@/assets/home/house-720.webp"
import interior from "@/assets/home/interior-1400.webp"
import interiorSmall from "@/assets/home/interior-720.webp"

import family from "@/assets/home/family-at-home-1916.webp"
import familySmall from "@/assets/home/family-at-home-1100.webp"
import familyMobile from "@/assets/home/family-at-home-mobile.webp"

const frames = [
  {
    image: family,
    small: familySmall,
    label: "Rodinné chvíle",
    alt: "Rodičia sa hrajú s dvoma deťmi na pohovke pri okne v slnečnej obývačke.",
  },
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

export function HomeHero() {
  const [index, setIndex] = useState(0)
  function advance(direction: number) {
    setIndex((current) => (current + direction + frames.length) % frames.length)
  }
  return (
    <section
      className="home-hero home-wide"
      data-family={index === 0}
      aria-labelledby="home-title"
    >
      <div className="home-hero-copy">
        <h1 id="home-title">
          <span className="home-title-line">Koľko stojí</span>{" "}
          <em className="home-title-line">váš domov?</em>
        </h1>
        <p className="home-hero-lead">
          Zistite orientačnú hodnotu svojej nehnuteľnosti jednoducho online.
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
            <picture key={frame.label}>
              {i === 0 && (
                <source media="(max-width: 600px)" srcSet={familyMobile} />
              )}
              <img
                src={frame.image}
                srcSet={`${frame.small} ${
                  i === 0 ? 1100 : 720
                }w, ${frame.image} ${i === 0 ? 1916 : 1400}w`}
                sizes="(min-width: 1650px) 1580px, 96vw"
                alt={frame.alt}
                aria-hidden={index !== i}
                fetchPriority={i === 0 ? "high" : "low"}
                className={index === i ? "is-current" : ""}
              />
            </picture>
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
