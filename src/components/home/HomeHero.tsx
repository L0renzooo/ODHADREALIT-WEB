import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react"
import { AddressEntry } from "./HomeAddress"
import house from "@/assets/home/house-1400.webp"
import houseSmall from "@/assets/home/house-720.webp"
import interior from "@/assets/home/interior-1400.webp"
import interiorSmall from "@/assets/home/interior-720.webp"

import morning from "@/assets/home/morning-at-home-1920.webp"
import morningSmall from "@/assets/home/morning-at-home-1100.webp"
import morningMobile from "@/assets/home/morning-at-home-mobile.webp"

const frames = [
  {
    image: morning,
    small: morningSmall,
    label: "Ráno doma",
    alt: "Dvojica pri rannej káve v presvetlenej domácej kuchyni.",
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
    <section className="home-hero home-wide" aria-labelledby="home-title">
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
                <source media="(max-width: 760px)" srcSet={morningMobile} />
              )}
              <img
                src={frame.image}
                srcSet={`${frame.small} ${
                  i === 0 ? 1100 : 720
                }w, ${frame.image} ${i === 0 ? 1920 : 1400}w`}
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
