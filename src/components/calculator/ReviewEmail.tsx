import { LockKeyhole, Pencil, ArrowUpRight } from "lucide-react"
import {
  areas,
  amenities,
  districts,
  formatAddress,
  entries,
  intentions,
  materialLabels,
  type Draft,
} from "./model"

export const steps = [
  "Adresa",
  "Typ nehnuteľnosti",
  "Základné údaje",
  "Vybavenie",
  "Stavba",
  "Plán predaja",
  "Kontrola údajov",
  "E-mail",
]
export function ReviewStep({
  data,
  edit,
}: {
  data: Draft
  edit: (n: number) => void
}) {
  const flat = data.type === "flat",
    branch = flat ? data.flat : data.house
  const area = (v: string) =>
    v
      ? Number(v).toLocaleString("sk-SK", { maximumFractionDigits: 10 }) + " m²"
      : "Neuvedené"
  const groups: [string, string][][] = [
    [
      ["Adresa", formatAddress(data.address)],
      ["Okres", districts[data.address.district!]],
    ],
    [["Typ", flat ? "Byt" : "Rodinný dom"]],
    [
      ["Úžitková plocha", area(branch.usable_area_m2)],
      flat
        ? ["Počet izieb", data.flat.rooms || "Neuvedené"]
        : ["Plocha pozemku", area(data.house.property_area_m2)],
    ],
    flat
      ? [
          ...entries(areas).map(([k, label]): [string, string] => [
            label,
            data.flat[k].present === "yes"
              ? area(data.flat[k].size)
              : data.flat[k].present === "no"
                ? "Nie"
                : "Neuvedené",
          ]),
          ["Počet podlaží", data.flat.total_floors || "Neuvedené"],
        ]
      : entries(amenities).map(([k, label]) => [
          label,
          data.house[k] === "yes"
            ? "Áno"
            : data.house[k] === "no"
              ? "Nie"
              : "Neuvedené",
        ]),
    [
      [
        "Rok výstavby",
        branch.unknownYear ? branch.period || "Neznámy" : branch.year_built,
      ],
      [
        "Materiál",
        branch.material ? materialLabels[branch.material] : "Neuvedené",
      ],
    ],
    [["Zámer", data.sale_intent ? intentions[data.sale_intent] : "Neuvedené"]],
  ]
  return (
    <div className="calc-review">
      {groups.map((rows, i) => (
        <section key={steps[i]}>
          <div>
            <h2>{steps[i]}</h2>
            <button
              className="calc-text"
              type="button"
              aria-label={"Upraviť · " + steps[i]}
              onClick={() => edit(i)}
            >
              <Pencil size={14} />
              Upraviť
            </button>
          </div>
          <dl>
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
// Pass the published policy URL once the production notice is available.
function PrivacyInformation({ policyUrl }: { policyUrl?: string }) {
  return (
    <aside className="calc-privacy">
      <LockKeyhole size={22} />
      <div>
        <h2>Na ochrane vašich údajov nám záleží.</h2>
        <p>
          V tejto ukážke zostáva e-mail iba v pamäti stránky. Po jej obnovení sa
          vymaže.
        </p>
        {policyUrl ? (
          <a className="calc-text" href={policyUrl}>
            Zásady ochrany osobných údajov <ArrowUpRight size={14} />
          </a>
        ) : (
          <details>
            <summary>Zásady ochrany osobných údajov</summary>
            <p>
              Zásady pre vybavenie a doručenie odhadu budú zverejnené pred
              spustením služby.
            </p>
          </details>
        )}
      </div>
    </aside>
  )
}
export function EmailStep({
  email,
  change,
}: {
  email: string
  change: (v: string) => void
}) {
  return (
    <>
      <label>
        E-mailová adresa
        <input
          type="email"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          placeholder="vas@email.sk"
          value={email}
          onChange={(e) => change(e.target.value)}
        />
      </label>
      <PrivacyInformation />
      <p className="calc-fine">
        Tlačidlom dokončíte ukážku žiadosti. Vaše údaje sa nikam neodošlú.
      </p>
    </>
  )
}
