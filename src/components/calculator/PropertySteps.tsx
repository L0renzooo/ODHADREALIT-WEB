import { Building2, House as HouseIcon } from "lucide-react"
import {
  amenities,
  areas,
  entries,
  flatMaterials,
  houseMaterials,
  intentions,
  materialLabels,
  type Answer,
  type Draft,
  type Flat,
  type House,
} from "./model"

export function NumberField({
  label,
  value,
  onChange,
  unit,
  whole = false,
  required = false,
  max,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  unit?: string
  whole?: boolean
  required?: boolean
  max?: number
}) {
  return (
    <label>
      {label}
      <span className="calc-unit">
        <input
          type="number"
          inputMode={whole ? "numeric" : "decimal"}
          min={whole ? 1 : 0}
          step={whole ? 1 : "any"}
          max={max}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {unit && <span aria-hidden="true">{unit}</span>}
      </span>
    </label>
  )
}

export function TypeStep({
  value,
  change,
}: {
  value: Draft["type"]
  change: (v: "flat" | "house") => void
}) {
  return (
    <fieldset className="calc-types">
      <legend className="sr-only">Typ nehnuteľnosti</legend>
      {([
        ["flat", "Byt", Building2],
        ["house", "Rodinný dom", HouseIcon],
      ] as const).map(([id, label, Icon]) => (
        <label className="calc-type" key={id}>
          <input
            type="radio"
            required
            name="type"
            checked={value === id}
            onChange={() => change(id)}
          />
          <Icon size={44} strokeWidth={1.4} />
          <strong>{label}</strong>
          <span className="calc-radio-mark" />
        </label>
      ))}
    </fieldset>
  )
}
interface Props {
  data: Draft
  setFlat: (p: Partial<Flat>) => void
  setHouse: (p: Partial<House>) => void
}
export function BasicStep({ data, setFlat, setHouse }: Props) {
  return (
    <div className="calc-fields">
      {data.type === "flat" ? (
        <>
          <NumberField
            required
            label="Úžitková plocha bytu"
            unit="m²"
            value={data.flat.usable_area_m2}
            onChange={(v) => setFlat({ usable_area_m2: v })}
          />
          <NumberField
            label="Počet izieb"
            whole
            value={data.flat.rooms}
            onChange={(v) => setFlat({ rooms: v })}
          />
        </>
      ) : (
        <>
          <NumberField
            required
            label="Úžitková plocha domu"
            unit="m²"
            value={data.house.usable_area_m2}
            onChange={(v) => setHouse({ usable_area_m2: v })}
          />
          <NumberField
            required
            label="Plocha pozemku"
            unit="m²"
            value={data.house.property_area_m2}
            onChange={(v) => setHouse({ property_area_m2: v })}
          />
        </>
      )}
    </div>
  )
}
function YesNo({
  label,
  value,
  change,
}: {
  label: string
  value: Answer
  change: (v: Answer) => void
}) {
  return (
    <fieldset className="calc-feature">
      <legend>{label}</legend>
      <div className="calc-segment">
        {([
          ["yes", "Áno"],
          ["no", "Nie"],
          ["", "Neuvedené"],
        ] as const).map(([id, text]) => (
          <label key={id}>
            <input
              type="radio"
              name={label}
              checked={value === id}
              onChange={() => change(id)}
            />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
export function FeaturesStep({ data, setFlat, setHouse }: Props) {
  if (data.type === "house")
    return (
      <div className="calc-feature-list">
        {entries(amenities).map(([key, label]) => (
          <YesNo
            key={key}
            label={label}
            value={data.house[key]}
            change={(v) => setHouse({ [key]: v })}
          />
        ))}
      </div>
    )
  return (
    <div className="calc-feature-list">
      {entries(areas).map(([key, label]) => {
        const a = data.flat[key]
        return (
          <div key={key}>
            <YesNo
              label={label}
              value={a.present}
              change={(v) => setFlat({ [key]: { ...a, present: v } })}
            />
            {a.present === "yes" && (
              <div className="calc-reveal">
                <NumberField
                  label={"Plocha · " + label}
                  required
                  unit="m²"
                  value={a.size}
                  onChange={(v) => setFlat({ [key]: { ...a, size: v } })}
                />
              </div>
            )}
          </div>
        )
      })}
      <NumberField
        label="Počet podlaží bytového domu"
        whole
        value={data.flat.total_floors}
        onChange={(v) => setFlat({ total_floors: v })}
      />
    </div>
  )
}
export function ConstructionStep({ data, setFlat, setHouse }: Props) {
  const flat = data.type === "flat",
    branch = flat ? data.flat : data.house
  const patch = (p: {
    unknownYear?: boolean
    year_built?: string
    period?: string
  }) => (flat ? setFlat(p) : setHouse(p))
  return (
    <div className="calc-fields">
      <div>
        {!branch.unknownYear && (
          <NumberField
            label="Rok výstavby"
            required
            whole
            max={new Date().getFullYear()}
            value={branch.year_built}
            onChange={(v) => patch({ year_built: v })}
          />
        )}
        <label className="calc-check">
          <input
            type="checkbox"
            checked={branch.unknownYear}
            onChange={(e) => patch({ unknownYear: e.target.checked })}
          />
          Neviem rok výstavby
        </label>
        {branch.unknownYear && (
          <label className="calc-reveal">
            Približné obdobie
            <select
              value={branch.period}
              onChange={(e) => patch({ period: e.target.value })}
            >
              <option value="">Neviem určiť</option>
              {[
                "Do roku 1999",
                "2000 – 2007",
                "2008 – 2015",
                "2016 – 2023",
                "Od roku 2024",
              ].map((period) => (
                <option key={period}>{period}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <label>
        Materiál stavby
        <select
          required
          value={branch.material}
          onChange={(e) =>
            flat
              ? setFlat({ material: e.target.value as Flat["material"] })
              : setHouse({ material: e.target.value as House["material"] })
          }
        >
          <option value="">Vyberte materiál</option>
          {[...(flat ? flatMaterials : houseMaterials), "unknown" as const].map(
            (k) => (
              <option key={k} value={k}>
                {materialLabels[k]}
              </option>
            ),
          )}
        </select>
      </label>
    </div>
  )
}
export function SellingStep({
  value,
  change,
}: {
  value: Draft["sale_intent"]
  change: (v: Draft["sale_intent"]) => void
}) {
  return (
    <fieldset className="calc-intentions">
      <legend className="sr-only">Plán predaja</legend>
      {entries(intentions).map(([id, label]) => (
        <label key={id}>
          <input
            type="radio"
            name="sale_intent"
            required
            checked={value === id}
            onChange={() => change(id)}
          />
          <span>{label}</span>
          <span className="calc-radio-mark" />
        </label>
      ))}
    </fieldset>
  )
}
