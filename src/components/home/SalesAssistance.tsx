import { ArrowUpRight } from "lucide-react"
import { Link } from "@/lib/router"
import room from "@/assets/home/morning-at-home-mobile.webp"
import { formatSalesNumber, salesMetrics } from "./salesMetrics"
import "./salesAssistance.css"

export function SalesAssistance() {
  return (
    <section
      id="od-odhadu-k-predaju"
      className="sales-assistance"
      aria-labelledby="sales-assistance-title"
    >
      <div
        className="sales-assistance-inner home-content"
        data-metrics={salesMetrics.length > 0}
      >
        <div className="sales-assistance-photo">
          <img
            src={room}
            width={800}
            height={500}
            loading="lazy"
            alt="Dvojica pri rannej káve v domácej kuchyni s výhľadom do záhrady."
          />
        </div>
        <div className="sales-assistance-copy">
          <h2 id="sales-assistance-title">
            <span>
              Od odhadu <span className="whitespace-nowrap">k predaju</span>
            </span>{" "}
            <em>— s väčšou istotou.</em>
          </h2>
          <p className="sales-assistance-intro">
            Poznajte hodnotu svojej nehnuteľnosti ešte pred predajom. A keď sa
            rozhodnete ísť ďalej, pomôžeme vám zorientovať sa v možnostiach a
            urobiť ďalší krok s väčšou istotou.
          </p>
          <Link
            to="/predaj-nehnutelnosti"
            className="home-button sales-assistance-cta"
          >
            Zistiť možnosti predaja{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        {salesMetrics.length > 0 && (
          <dl className="sales-assistance-results">
            {salesMetrics.map(({ label, value, prefix, suffix }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  <span className="sr-only">
                    {prefix}
                    {formatSalesNumber(value)}
                    {suffix}
                  </span>
                  <span aria-hidden="true">
                    {prefix}
                    <span data-sales-number={value}>
                      {formatSalesNumber(value)}
                    </span>
                    {suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
